import { getPrisma } from "@/lib/prisma";
import type {
  FriendActivity,
  GameCardModel,
  LibraryStatus,
  PlatformSlug,
  ReviewRecord,
} from "@/types";

const ALEX_EMAIL = "alex@example.com";

const STATUS_LABEL = {
  PLAYING: "Playing",
  COMPLETED: "Completed",
  BACKLOG: "Backlog",
  DROPPED: "Dropped",
  WANT_TO_PLAY: "Want to Play",
  FAVORITE: "Favorite",
} as const satisfies Record<string, LibraryStatus>;

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
        where: { email: ALEX_EMAIL },
        include: {
          libraryGames: {
            include: {
              game: true,
              platform: true,
            },
          },
          ratings: true,
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
          user: { email: { not: ALEX_EMAIL } },
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
        note: "Marked Playing in the database.",
      });
    }

    const genres = [...new Set(gameRows.flatMap((game) => game.genres))].sort();

    if (gameRows.length === 0) {
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
    };
  } catch {
    return emptyCatalog("unavailable");
  }
}
