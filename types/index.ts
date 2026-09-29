export const LIBRARY_STATUSES = [
  "Playing",
  "Completed",
  "Backlog",
  "Dropped",
  "Want to Play",
  "Favorite",
] as const;

export type LibraryStatus = (typeof LIBRARY_STATUSES)[number];

export const PLATFORM_ACCOUNT_STATUSES = [
  "Connected",
  "Not Connected",
  "Partial Sync",
  "Manual Library",
] as const;

export type PlatformAccountStatus = (typeof PLATFORM_ACCOUNT_STATUSES)[number];

export const SORT_OPTIONS = [
  "Recently Played",
  "Rating",
  "Playtime",
  "Alphabetical",
  "AI Match",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export type PlatformSlug =
  | "steam"
  | "xbox"
  | "playstation"
  | "nintendo"
  | "epic"
  | "gog"
  | "google-play"
  | "apple";

export type PlatformRef = {
  slug: PlatformSlug;
  name: string;
};

export type GameRecord = {
  slug: string;
  title: string;
  description: string;
  coverPath: string;
  genres: string[];
  multiplayer: boolean;
  coop: boolean;
  pve: boolean;
  pvp: boolean;
  platforms: PlatformSlug[];
};

export type LibraryEntry = {
  ownerEmail: string;
  gameSlug: string;
  platformSlug: PlatformSlug;
  status: LibraryStatus;
  playtimeMinutes: number;
  lastPlayedAt: string | null;
  aiMatchPercent: number | null;
};

export type GameCardModel = {
  id: string;
  title: string;
  slug: string;
  coverPath: string;
  platforms: string[];
  rating: number | null;
  playtimeMinutes: number | null;
  status: LibraryStatus | null;
  aiMatchPercent: number | null;
  genres: string[];
  multiplayer: boolean;
  coop: boolean;
  pve: boolean;
  pvp: boolean;
  lastPlayedAt: string | null;
};

export type ReviewRecord = {
  id: string;
  authorEmail: string;
  authorName: string;
  gameSlug: string;
  title: string;
  body: string;
  createdAt: string;
  rating: number;
  gameTitle?: string;
  coverPath?: string;
};

export type AccountConnection = {
  platformSlug: PlatformSlug;
  status: PlatformAccountStatus;
  displayName: string | null;
};

export type DemoUser = {
  email: string;
  displayName: string;
  favoriteGenres: string[];
};

export type FriendActivity = {
  name: string;
  gameSlug: string;
  platformSlug: PlatformSlug;
  note: string;
  gameTitle?: string;
  coverPath?: string;
  platformName?: string;
};
