import type {
  AccountConnection,
  DemoUser,
  FriendActivity,
  GameCardModel,
  GameRecord,
  LibraryEntry,
  PlatformRef,
  PlatformSlug,
  ReviewRecord,
} from "@/types";

export const platforms: PlatformRef[] = [
  { slug: "steam", name: "Steam" },
  { slug: "xbox", name: "Xbox" },
  { slug: "playstation", name: "PlayStation" },
  { slug: "nintendo", name: "Nintendo" },
  { slug: "epic", name: "Epic Games" },
  { slug: "gog", name: "GOG" },
  { slug: "google-play", name: "Google Play" },
  { slug: "apple", name: "Apple" },
];

const platformName = new Map(platforms.map((platform) => [platform.slug, platform.name]));

export function platformLabel(slug: PlatformSlug): string {
  return platformName.get(slug) ?? slug;
}

export const demoUsers: DemoUser[] = [
  {
    email: "alex@example.com",
    displayName: "Alex Rivera",
    favoriteGenres: ["RPG", "Shooter", "Co-op"],
  },
  {
    email: "sam@example.com",
    displayName: "Sam Chen",
    favoriteGenres: ["Shooter"],
  },
  {
    email: "jordan@example.com",
    displayName: "Jordan Blake",
    favoriteGenres: ["Action"],
  },
];

export const currentUser = demoUsers[0];

export const games: GameRecord[] = [
  {
    slug: "minecraft",
    title: "Minecraft",
    description:
      "A blocky sandbox where you dig, build, and survive. Play alone or with friends.",
    coverPath: "/covers/minecraft.svg",
    genres: ["Sandbox", "Survival"],
    multiplayer: true,
    coop: true,
    pve: true,
    pvp: true,
    platforms: ["steam", "xbox", "playstation", "nintendo"],
  },
  {
    slug: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    description:
      "An open-world action RPG in Night City. The sample library keeps the Steam and Xbox copies separate.",
    coverPath: "/covers/cyberpunk-2077.svg",
    genres: ["Action", "RPG"],
    multiplayer: false,
    coop: false,
    pve: true,
    pvp: false,
    platforms: ["steam", "xbox", "playstation", "gog"],
  },
  {
    slug: "warframe",
    title: "Warframe",
    description: "Squad-based missions as a space ninja, with co-op and a few competitive modes.",
    coverPath: "/covers/warframe.svg",
    genres: ["Action", "Looter"],
    multiplayer: true,
    coop: true,
    pve: true,
    pvp: true,
    platforms: ["steam", "xbox", "playstation", "nintendo", "epic"],
  },
  {
    slug: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    description: "A party RPG with dice rolls, branching stories, and optional co-op.",
    coverPath: "/covers/baldurs-gate-3.svg",
    genres: ["RPG", "Adventure"],
    multiplayer: true,
    coop: true,
    pve: true,
    pvp: false,
    platforms: ["steam", "xbox", "playstation", "gog"],
  },
  {
    slug: "helldivers-2",
    title: "Helldivers 2",
    description: "A co-op shooter about dropping onto hostile planets with a squad.",
    coverPath: "/covers/helldivers-2.svg",
    genres: ["Shooter", "Co-op"],
    multiplayer: true,
    coop: true,
    pve: true,
    pvp: false,
    platforms: ["steam", "playstation"],
  },
  {
    slug: "deep-rock-galactic",
    title: "Deep Rock Galactic",
    description: "Dwarves, caves, and bugs. A co-op mining shooter built for short sessions.",
    coverPath: "/covers/deep-rock-galactic.svg",
    genres: ["Shooter", "Co-op"],
    multiplayer: true,
    coop: true,
    pve: true,
    pvp: false,
    platforms: ["steam", "xbox", "playstation"],
  },
];

const gameBySlug = new Map(games.map((game) => [game.slug, game]));

export const libraryEntries: LibraryEntry[] = [
  {
    ownerEmail: currentUser.email,
    gameSlug: "minecraft",
    platformSlug: "steam",
    status: "Playing",
    playtimeMinutes: 8420,
    lastPlayedAt: "2026-09-26T21:10:00.000Z",
    aiMatchPercent: 86,
  },
  {
    ownerEmail: currentUser.email,
    gameSlug: "cyberpunk-2077",
    platformSlug: "steam",
    status: "Playing",
    playtimeMinutes: 2140,
    lastPlayedAt: "2026-09-25T18:40:00.000Z",
    aiMatchPercent: 91,
  },
  {
    ownerEmail: currentUser.email,
    gameSlug: "cyberpunk-2077",
    platformSlug: "xbox",
    status: "Want to Play",
    playtimeMinutes: 0,
    lastPlayedAt: null,
    aiMatchPercent: 74,
  },
  {
    ownerEmail: currentUser.email,
    gameSlug: "warframe",
    platformSlug: "steam",
    status: "Playing",
    playtimeMinutes: 12600,
    lastPlayedAt: "2026-09-20T16:05:00.000Z",
    aiMatchPercent: 70,
  },
  {
    ownerEmail: currentUser.email,
    gameSlug: "baldurs-gate-3",
    platformSlug: "steam",
    status: "Completed",
    playtimeMinutes: 6120,
    lastPlayedAt: "2026-08-02T22:15:00.000Z",
    aiMatchPercent: 97,
  },
  {
    ownerEmail: currentUser.email,
    gameSlug: "helldivers-2",
    platformSlug: "playstation",
    status: "Backlog",
    playtimeMinutes: 95,
    lastPlayedAt: "2026-07-14T19:30:00.000Z",
    aiMatchPercent: 88,
  },
  {
    ownerEmail: currentUser.email,
    gameSlug: "deep-rock-galactic",
    platformSlug: "steam",
    status: "Favorite",
    playtimeMinutes: 3480,
    lastPlayedAt: "2026-09-18T23:00:00.000Z",
    aiMatchPercent: 94,
  },
  {
    ownerEmail: currentUser.email,
    gameSlug: "minecraft",
    platformSlug: "nintendo",
    status: "Dropped",
    playtimeMinutes: 40,
    lastPlayedAt: "2026-01-03T15:00:00.000Z",
    aiMatchPercent: 40,
  },
  {
    ownerEmail: "sam@example.com",
    gameSlug: "helldivers-2",
    platformSlug: "playstation",
    status: "Playing",
    playtimeMinutes: 1860,
    lastPlayedAt: "2026-09-27T20:00:00.000Z",
    aiMatchPercent: 81,
  },
  {
    ownerEmail: "jordan@example.com",
    gameSlug: "warframe",
    platformSlug: "xbox",
    status: "Playing",
    playtimeMinutes: 5400,
    lastPlayedAt: "2026-09-22T17:45:00.000Z",
    aiMatchPercent: 77,
  },
];

export const ratings: { userEmail: string; gameSlug: string; score: number }[] = [
  { userEmail: currentUser.email, gameSlug: "minecraft", score: 9 },
  { userEmail: currentUser.email, gameSlug: "cyberpunk-2077", score: 8 },
  { userEmail: currentUser.email, gameSlug: "warframe", score: 8 },
  { userEmail: currentUser.email, gameSlug: "baldurs-gate-3", score: 10 },
  { userEmail: currentUser.email, gameSlug: "helldivers-2", score: 8 },
  { userEmail: currentUser.email, gameSlug: "deep-rock-galactic", score: 9 },
  { userEmail: "sam@example.com", gameSlug: "helldivers-2", score: 7 },
  { userEmail: "jordan@example.com", gameSlug: "warframe", score: 8 },
];

export const reviews: ReviewRecord[] = [
  {
    id: "review-bg3",
    authorEmail: currentUser.email,
    authorName: "Alex Rivera",
    gameSlug: "baldurs-gate-3",
    title: "Still thinking about the ending",
    body: "Finished the campaign with a friend. The story choices still surprise me, and the co-op sessions are why it stayed in my library.",
    createdAt: "2026-08-04T12:00:00.000Z",
    rating: 10,
  },
  {
    id: "review-drg",
    authorEmail: currentUser.email,
    authorName: "Alex Rivera",
    gameSlug: "deep-rock-galactic",
    title: "Weekly deep dive",
    body: "Short sessions, easy to pick up, and the caves never look the same. This is the game I open when the whole squad is free.",
    createdAt: "2026-09-19T09:30:00.000Z",
    rating: 9,
  },
  {
    id: "review-helldivers",
    authorEmail: "sam@example.com",
    authorName: "Sam Chen",
    gameSlug: "helldivers-2",
    title: "Better with a full squad",
    body: "Dropped in for a few missions. It is loud, chaotic, and much more fun when four people are calling targets.",
    createdAt: "2026-09-27T21:15:00.000Z",
    rating: 7,
  },
  {
    id: "review-warframe",
    authorEmail: "jordan@example.com",
    authorName: "Jordan Blake",
    gameSlug: "warframe",
    title: "Easy to come back to",
    body: "I come back whenever a new frame ships. The missions are quick, which fits a weeknight.",
    createdAt: "2026-09-22T18:20:00.000Z",
    rating: 8,
  },
];

export const accountConnections: AccountConnection[] = [
  { platformSlug: "steam", status: "Connected", displayName: "AlexRivera" },
  { platformSlug: "xbox", status: "Partial Sync", displayName: "Alex R" },
  { platformSlug: "playstation", status: "Connected", displayName: "Alex-Rivera" },
  { platformSlug: "nintendo", status: "Manual Library", displayName: "Alex" },
  { platformSlug: "epic", status: "Not Connected", displayName: null },
  { platformSlug: "gog", status: "Not Connected", displayName: null },
  { platformSlug: "google-play", status: "Not Connected", displayName: null },
  { platformSlug: "apple", status: "Not Connected", displayName: null },
];

export const friends: FriendActivity[] = [
  {
    name: "Sam Chen",
    gameSlug: "helldivers-2",
    platformSlug: "playstation",
    note: "In a mission right now",
  },
  {
    name: "Jordan Blake",
    gameSlug: "warframe",
    platformSlug: "xbox",
    note: "Running night missions",
  },
  {
    name: "Riley Nguyen",
    gameSlug: "minecraft",
    platformSlug: "nintendo",
    note: "Building a new base",
  },
  {
    name: "Morgan Lee",
    gameSlug: "baldurs-gate-3",
    platformSlug: "steam",
    note: "Act 2, co-op",
  },
];

const userRatings = new Map(
  ratings
    .filter((rating) => rating.userEmail === currentUser.email)
    .map((rating) => [rating.gameSlug, rating.score]),
);

export function toLibraryCard(entry: LibraryEntry): GameCardModel {
  const game = gameBySlug.get(entry.gameSlug);
  if (!game) {
    throw new Error(`Unknown sample game: ${entry.gameSlug}`);
  }

  return {
    id: `${entry.ownerEmail}:${entry.gameSlug}:${entry.platformSlug}`,
    title: game.title,
    slug: game.slug,
    coverPath: game.coverPath,
    platforms: [platformLabel(entry.platformSlug)],
    rating: userRatings.get(game.slug) ?? null,
    playtimeMinutes: entry.playtimeMinutes,
    status: entry.status,
    aiMatchPercent: entry.aiMatchPercent,
    genres: game.genres,
    multiplayer: game.multiplayer,
    coop: game.coop,
    pve: game.pve,
    pvp: game.pvp,
    lastPlayedAt: entry.lastPlayedAt,
  };
}

export const myLibrary: GameCardModel[] = libraryEntries
  .filter((entry) => entry.ownerEmail === currentUser.email)
  .map(toLibraryCard);

export const discoveryGames: GameCardModel[] = games.map((game) => {
  const mine = myLibrary.filter((entry) => entry.slug === game.slug);
  const bestMatch = mine.reduce<number | null>((best, entry) => {
    if (entry.aiMatchPercent === null) return best;
    if (best === null) return entry.aiMatchPercent;
    return Math.max(best, entry.aiMatchPercent);
  }, null);

  return {
    id: game.slug,
    title: game.title,
    slug: game.slug,
    coverPath: game.coverPath,
    platforms: game.platforms.map((slug) => platformLabel(slug)),
    rating: userRatings.get(game.slug) ?? null,
    playtimeMinutes: mine.reduce((total, entry) => total + (entry.playtimeMinutes ?? 0), 0),
    status: mine[0]?.status ?? null,
    aiMatchPercent: bestMatch,
    genres: game.genres,
    multiplayer: game.multiplayer,
    coop: game.coop,
    pve: game.pve,
    pvp: game.pvp,
    lastPlayedAt: mine
      .map((entry) => entry.lastPlayedAt)
      .filter((value): value is string => value !== null)
      .sort()
      .at(-1) ?? null,
  };
});

export const continuePlaying = myLibrary.filter((game) => game.status === "Playing");

export const recommended = [...myLibrary]
  .filter((game) => game.aiMatchPercent !== null)
  .sort((a, b) => (b.aiMatchPercent ?? 0) - (a.aiMatchPercent ?? 0))
  .slice(0, 4);

export const popularGames = discoveryGames;

export const recentReviews = [...reviews].sort((a, b) =>
  a.createdAt < b.createdAt ? 1 : -1,
);

export const genres = [...new Set(games.flatMap((game) => game.genres))].sort();

export function gameBySlugOrThrow(slug: string): GameRecord {
  const game = gameBySlug.get(slug);
  if (!game) {
    throw new Error(`Unknown sample game: ${slug}`);
  }
  return game;
}
