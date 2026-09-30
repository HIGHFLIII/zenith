import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { LIBRARY_OWNER_EMAIL } from "@/lib/owner";
import { fetchSteamLibrary, type SteamOwnedGame } from "@/services/gaming/steam";

export type SteamImportResult = {
  error: string | null;
  saved: boolean;
  imported: number;
  updated: number;
};

const pages = ["/", "/library", "/games", "/reviews", "/friends", "/profile", "/settings"];

function refreshPages() {
  try {
    for (const path of pages) revalidatePath(path);
  } catch {
    // A direct script has no Next.js request. The site reloads the database on the next visit.
  }
}

function slugify(title: string) {
  const base = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "game";
}

export async function saveSteamLibrary(
  games: SteamOwnedGame[],
  personaName: string | null,
): Promise<SteamImportResult> {
  const empty = { error: null, saved: false, imported: 0, updated: 0 };
  if (games.length === 0) {
    return {
      ...empty,
      error: "Steam returned no games. Set Game details to Public on your Steam profile, then try again.",
    };
  }

  try {
    const prisma = getPrisma();
    const platform = await prisma.platform.findUnique({ where: { slug: "steam" } });
    if (!platform) {
      return { ...empty, error: "The Steam platform is not in the database yet. Load the sample data once, then import." };
    }

    const owner = await prisma.user.upsert({
      where: { email: LIBRARY_OWNER_EMAIL },
      update: {},
      create: { email: LIBRARY_OWNER_EMAIL, displayName: personaName ?? "My Library" },
    });

    await prisma.platformAccount.upsert({
      where: { userId_platformId: { userId: owner.id, platformId: platform.id } },
      update: {
        status: "CONNECTED",
        displayName: personaName,
      },
      create: {
        userId: owner.id,
        platformId: platform.id,
        status: "CONNECTED",
        displayName: personaName,
      },
    });

    const [existingGames, steamLinks, libraryRows] = await Promise.all([
      prisma.game.findMany({ select: { id: true, title: true, slug: true } }),
      prisma.platformGame.findMany({ where: { platformId: platform.id } }),
      prisma.userLibraryGame.findMany({ where: { userId: owner.id, platformId: platform.id } }),
    ]);

    const gameByTitle = new Map(existingGames.map((game) => [game.title.toLowerCase(), game]));
    const linkByApp = new Map(
      steamLinks.filter((link) => link.externalId).map((link) => [link.externalId as string, link]),
    );
    const libraryByGame = new Map(libraryRows.map((row) => [row.gameId, row]));
    const usedSlugs = new Set(existingGames.map((game) => game.slug));

    let imported = 0;
    let updated = 0;

    for (const steamGame of games) {
      const appId = String(steamGame.appid);
      const title = steamGame.name.slice(0, 180);
      const playtimeMinutes = Math.max(0, Math.round(steamGame.playtime_forever ?? 0));
      const playedRecently = (steamGame.playtime_2weeks ?? 0) > 0;
      const linked = linkByApp.get(appId);
      let gameId = linked?.gameId ?? gameByTitle.get(title.toLowerCase())?.id;

      if (!gameId) {
        let slug = slugify(title);
        if (usedSlugs.has(slug)) slug = `${slug}-${appId}`.slice(0, 80);
        usedSlugs.add(slug);
        const created = await prisma.game.create({
          data: {
            title,
            slug,
            description: "Imported from Steam.",
            coverPath: `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`,
            genres: ["Unsorted"],
          },
        });
        gameId = created.id;
        gameByTitle.set(title.toLowerCase(), { id: created.id, title, slug });
      }

      if (!linked) {
        const link = await prisma.platformGame.upsert({
          where: { gameId_platformId: { gameId, platformId: platform.id } },
          update: { externalId: appId },
          create: { gameId, platformId: platform.id, externalId: appId },
        });
        linkByApp.set(appId, link);
      }

      const owned = libraryByGame.get(gameId);
      if (owned) {
        await prisma.userLibraryGame.update({
          where: { id: owned.id },
          data: {
            playtimeMinutes,
            lastPlayedAt: playedRecently ? new Date() : owned.lastPlayedAt,
          },
        });
        updated += 1;
        continue;
      }

      const createdLibrary = await prisma.userLibraryGame.create({
        data: {
          userId: owner.id,
          gameId,
          platformId: platform.id,
          status: playedRecently ? "PLAYING" : "BACKLOG",
          playtimeMinutes,
          lastPlayedAt: playedRecently ? new Date() : null,
        },
      });
      libraryByGame.set(gameId, createdLibrary);
      imported += 1;
    }

    refreshPages();
    return { error: null, saved: true, imported, updated };
  } catch {
    return {
      error: "The database did not save the Steam library.",
      saved: false,
      imported: 0,
      updated: 0,
    };
  }
}

export async function importSteamLibrary(): Promise<SteamImportResult> {
  const fetched = await fetchSteamLibrary();
  if ("error" in fetched) {
    return { error: fetched.error, saved: false, imported: 0, updated: 0 };
  }
  return saveSteamLibrary(fetched.games, fetched.personaName);
}
