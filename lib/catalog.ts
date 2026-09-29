import { LIBRARY_OWNER_EMAIL } from "@/lib/owner";
import { getPrisma } from "@/lib/prisma";
import type {
  FriendActivity,
  GameCardModel,
  LibraryStatus,
  PlatformAccountStatus,
  PlatformSlug,
  ReviewRecord,
} from "@/types";

const STATUS_LABEL = {
  PLAYING: "Playing",
  COMPLETED: "Completed",
  BACKLOG: "Backlog",
  DROPPED: "Dropped",
  WANT_TO_PLAY: "Want to Play",
  FAVORITE: "Favorite",
} as const satisfies Record<string, LibraryStatus>;

const ACCOUNT_STATUS = {
  CONNECTED: "Connected",
  NOT_CONNECTED: "Not Connected",
  PARTIAL_SYNC: "Partial Sync",
  MANUAL_LIBRARY: "Manual Library",
} as const satisfies Record<string, PlatformAccountStatus>;

const PLATFORM_SLUGS: readonly PlatformSlug[] = [
  "steam",
  "xbox",
  "playstation",
  "nintendo",
  "epic",
  "gog",
  "google-play",
  "apple",
];

function platformSlug(value: string): PlatformSlug | null {
  return PLATFORM_SLUGS.find((slug) => slug === value) ?? null;
}

export type CatalogState = "ok" | "empty" | "unavailable";

export type CatalogProfile = {
  displayName: string;
  email: string;
  favoriteGenres: string[];
};

export type CatalogAccount = {
  id: string;
  platformName: string;
  status: PlatformAccountStatus;
  displayName: string | null;
};

export type CatalogSnapshot = {
  state: CatalogState;
  library: GameCardModel[];
  recommended: GameCardModel[];
  continuePlaying: GameCardModel[];
  popularGames: GameCardModel[];
  reviews: ReviewRecord[];
  friends: FriendActivity[];
  platformNames: string[];
  genres: string[];
  profile: CatalogProfile | null;
  accounts: CatalogAccount[];
  platforms: { slug: string; name: string }[];
};

function emptyCatalog(state: CatalogState): CatalogSnapshot {
  return {
    state,
    library: [],
    recommended: [],
    continuePlaying: [],
    popularGames: [],
    reviews: [],
    friends: [],
    platformNames: [],
    genres: [],
    profile: null,
    accounts: [],
    platforms: [],
  };
}

export async function loadCatalog(): Promise<CatalogSnapshot> {
  try {
    const prisma = getPrisma();
    const [platformRows, gameRows, alex, reviewRows, ratingRows, friendRows] = await Promise.all([
      prisma.platform.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.game.findMany({
        orderBy: { createdAt: "asc" },
        include: {
          platformGames: { include: { platform: true } },
        },
      }),
      prisma.user.findUnique({
        where: { email: LIBRARY_OWNER_EMAIL },
        include: {
          libraryGames: {
            include: {
              game: true,
              platform: true,
            },
          },
          ratings: true,
          preference: true,
          platformAccounts: {
            include: { platform: true },
          },
        },
      }),
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          game: true,
        },
      }),
      prisma.rating.findMany(),
      prisma.userLibraryGame.findMany({
        where: {
          status: "PLAYING",
          user: { email: { not: LIBRARY_OWNER_EMAIL } },
        },
        include: {
          user: true,
          game: true,
          platform: true,
        },
        orderBy: { lastPlayedAt: "desc" },
      }),
    ]);

    const ratingByGameId = new Map((alex?.ratings ?? []).map((rating) => [rating.gameId, rating.score]));
    const ratingByUserGame = new Map(
      ratingRows.map((rating) => [`${rating.userId}:${rating.gameId}`, rating.score]),
    );

    const library: GameCardModel[] = (alex?.libraryGames ?? []).map((entry) => ({
      id: entry.id,
      title: entry.game.title,
      slug: entry.game.slug,
      coverPath: entry.game.coverPath,
      platforms: [entry.platform.name],
      rating: ratingByGameId.get(entry.gameId) ?? null,
      playtimeMinutes: entry.playtimeMinutes,
      status: STATUS_LABEL[entry.status],
      aiMatchPercent: entry.aiMatchPercent,
      genres: [...entry.game.genres],
      multiplayer: entry.game.multiplayer,
      coop: entry.game.coop,
      pve: entry.game.pve,
      pvp: entry.game.pvp,
      lastPlayedAt: entry.lastPlayedAt ? entry.lastPlayedAt.toISOString() : null,
    }));

    const libraryBySlug = new Map<string, GameCardModel[]>();
    for (const entry of library) {
      const list = libraryBySlug.get(entry.slug) ?? [];
      list.push(entry);
      libraryBySlug.set(entry.slug, list);
    }

    const popularGames: GameCardModel[] = gameRows.map((game) => {
      const mine = libraryBySlug.get(game.slug) ?? [];
      const bestMatch = mine.reduce<number | null>((best, entry) => {
        if (entry.aiMatchPercent === null) return best;
        if (best === null) return entry.aiMatchPercent;
        return Math.max(best, entry.aiMatchPercent);
      }, null);
      const lastPlayedAt =
        mine
          .map((entry) => entry.lastPlayedAt)
          .filter((value): value is string => value !== null)
          .sort()
          .at(-1) ?? null;

      return {
        id: game.id,
        title: game.title,
        slug: game.slug,
        coverPath: game.coverPath,
        platforms: game.platformGames
          .slice()
          .sort((a, b) => a.platform.createdAt.getTime() - b.platform.createdAt.getTime())
          .map((row) => row.platform.name),
        rating: ratingByGameId.get(game.id) ?? null,
        playtimeMinutes: mine.reduce((total, entry) => total + (entry.playtimeMinutes ?? 0), 0),
        status: mine.find((entry) => entry.lastPlayedAt === lastPlayedAt)?.status ?? mine[0]?.status ?? null,
        aiMatchPercent: bestMatch,
        genres: [...game.genres],
        multiplayer: game.multiplayer,
        coop: game.coop,
        pve: game.pve,
        pvp: game.pvp,
        lastPlayedAt,
      };
    });

    const reviews: ReviewRecord[] = reviewRows.map((review) => ({
      id: review.id,
      authorEmail: review.user.email,
      authorName: review.user.displayName,
      gameSlug: review.game.slug,
      gameTitle: review.game.title,
      coverPath: review.game.coverPath,
      title: review.title,
      body: review.body,
      createdAt: review.createdAt.toISOString(),
      rating: ratingByUserGame.get(`${review.userId}:${review.gameId}`) ?? 0,
    }));

    const friends: FriendActivity[] = [];
    for (const entry of friendRows) {
      const slug = platformSlug(entry.platform.slug);
      if (!slug) continue;
      friends.push({
        name: entry.user.displayName,
        gameSlug: entry.game.slug,
        platformSlug: slug,
        gameTitle: entry.game.title,
        coverPath: entry.game.coverPath,
        platformName: entry.platform.name,
        note: "Marked Playing in the database.",
      });
    }

    const genres = [...new Set(gameRows.flatMap((game) => game.genres))].sort();

    if (platformRows.length === 0 && gameRows.length === 0 && !alex) {
      return emptyCatalog("empty");
    }

    return {
      state: "ok",
      library,
      recommended: [...library]
        .filter((game) => game.aiMatchPercent !== null)
        .sort((a, b) => (b.aiMatchPercent ?? 0) - (a.aiMatchPercent ?? 0))
        .slice(0, 4),
      continuePlaying: library.filter((game) => game.status === "Playing"),
      popularGames,
      reviews,
      friends,
      platformNames: platformRows.map((platform) => platform.name),
      genres,
      accounts: (alex?.platformAccounts ?? [])
        .slice()
        .sort((a, b) => a.platform.createdAt.getTime() - b.platform.createdAt.getTime())
        .map((account) => ({
          id: account.id,
          platformName: account.platform.name,
          status: ACCOUNT_STATUS[account.status],
          displayName: account.displayName,
        })),
      profile: alex
        ? {
            displayName: alex.displayName,
            email: alex.email,
            favoriteGenres: [...(alex.preference?.favoriteGenres ?? [])],
          }
        : null,
      platforms: platformRows.map((platform) => ({ slug: platform.slug, name: platform.name })),
    };
  } catch {
    return emptyCatalog("unavailable");
  }
}
