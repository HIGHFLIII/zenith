import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { LIBRARY_OWNER_EMAIL } from "@/lib/owner";
import { LIBRARY_STATUSES, type LibraryStatus } from "@/types";

const STATUS_TO_ENUM = {
  Playing: "PLAYING",
  Completed: "COMPLETED",
  Backlog: "BACKLOG",
  Dropped: "DROPPED",
  "Want to Play": "WANT_TO_PLAY",
  Favorite: "FAVORITE",
} as const satisfies Record<LibraryStatus, string>;

export type WriteResult = {
  error: string | null;
  saved: boolean;
};

const savedPaths = ["/", "/library", "/games", "/reviews", "/friends", "/profile", "/settings"];

function refreshPages() {
  for (const path of savedPaths) {
    revalidatePath(path);
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

async function ownerId() {
  const prisma = getPrisma();
  const owner = await prisma.user.upsert({
    where: { email: LIBRARY_OWNER_EMAIL },
    update: {},
    create: {
      email: LIBRARY_OWNER_EMAIL,
      displayName: "My Library",
    },
  });
  return owner.id;
}

export async function saveDisplayName(name: string): Promise<WriteResult> {
  const displayName = name.trim();
  if (displayName.length < 1 || displayName.length > 80) {
    return { error: "Enter a name up to 80 characters.", saved: false };
  }

  try {
    const prisma = getPrisma();
    await prisma.user.upsert({
      where: { email: LIBRARY_OWNER_EMAIL },
      update: { displayName },
      create: {
        email: LIBRARY_OWNER_EMAIL,
        displayName,
      },
    });
    refreshPages();
    return { error: null, saved: true };
  } catch {
    return { error: "The database did not save that name.", saved: false };
  }
}

export async function addLibraryGame(input: {
  title: string;
  platformSlug: string;
  status: string;
  genre: string;
  hours: string;
}): Promise<WriteResult> {
  const title = input.title.trim();
  const platformSlug = input.platformSlug.trim();
  const genre = input.genre.trim();
  const hoursRaw = input.hours.trim();

  if (title.length < 1 || title.length > 120) {
    return { error: "Enter a game title up to 120 characters.", saved: false };
  }
  if (!LIBRARY_STATUSES.includes(input.status as LibraryStatus)) {
    return { error: "Choose a library status.", saved: false };
  }
  const status = input.status as LibraryStatus;

  let playtimeMinutes = 0;
  if (hoursRaw !== "") {
    const hours = Number(hoursRaw);
    if (!Number.isFinite(hours) || hours < 0 || hours > 100000) {
      return { error: "Enter hours played as a number, or leave it blank.", saved: false };
    }
    playtimeMinutes = Math.round(hours * 60);
  }

  try {
    const prisma = getPrisma();
    const platform = await prisma.platform.findUnique({ where: { slug: platformSlug } });
    if (!platform) {
      return { error: "Choose a platform.", saved: false };
    }

    const userId = await ownerId();
    const existing = await prisma.game.findFirst({
      where: { title: { equals: title, mode: "insensitive" } },
    });

    let gameId = existing?.id;
    if (!gameId) {
      let slug = slugify(title);
      const taken = await prisma.game.findUnique({ where: { slug } });
      if (taken) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
      const created = await prisma.game.create({
        data: {
          title,
          slug,
          description: "Added in Zenith.",
          coverPath: "/covers/added.svg",
          genres: genre ? [genre.slice(0, 40)] : ["Unsorted"],
        },
      });
      gameId = created.id;
    }

    await prisma.platformGame.upsert({
      where: { gameId_platformId: { gameId, platformId: platform.id } },
      update: {},
      create: { gameId, platformId: platform.id },
    });

    const alreadyOwned = await prisma.userLibraryGame.findUnique({
      where: {
        userId_gameId_platformId: {
          userId,
          gameId,
          platformId: platform.id,
        },
      },
    });
    if (alreadyOwned) {
      return { error: "That game is already in your library on that platform.", saved: false };
    }

    await prisma.userLibraryGame.create({
      data: {
        userId,
        gameId,
        platformId: platform.id,
        status: STATUS_TO_ENUM[status],
        playtimeMinutes,
      },
    });
    refreshPages();
    return { error: null, saved: true };
  } catch {
    return { error: "The database did not save that game.", saved: false };
  }
}
