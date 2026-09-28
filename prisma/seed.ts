import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import {
  accountConnections,
  currentUser,
  demoUsers,
  games,
  libraryEntries,
  platforms,
  ratings,
  reviews,
} from "../lib/demo-data";
import type { LibraryStatus, PlatformAccountStatus } from "../types";

const libraryStatus: Record<LibraryStatus, "PLAYING" | "COMPLETED" | "BACKLOG" | "DROPPED" | "WANT_TO_PLAY" | "FAVORITE"> = {
  Playing: "PLAYING",
  Completed: "COMPLETED",
  Backlog: "BACKLOG",
  Dropped: "DROPPED",
  "Want to Play": "WANT_TO_PLAY",
  Favorite: "FAVORITE",
};

const accountStatus: Record<
  PlatformAccountStatus,
  "CONNECTED" | "NOT_CONNECTED" | "PARTIAL_SYNC" | "MANUAL_LIBRARY"
> = {
  Connected: "CONNECTED",
  "Not Connected": "NOT_CONNECTED",
  "Partial Sync": "PARTIAL_SYNC",
  "Manual Library": "MANUAL_LIBRARY",
};

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is missing. Copy .env.example to .env and start PostgreSQL first.",
    );
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    await prisma.rating.deleteMany();
    await prisma.review.deleteMany();
    await prisma.userLibraryGame.deleteMany();
    await prisma.userPreference.deleteMany();
    await prisma.platformAccount.deleteMany();
    await prisma.platformGame.deleteMany();
    await prisma.game.deleteMany();
    await prisma.platform.deleteMany();
    await prisma.user.deleteMany();

    const platformIds = new Map<string, string>();
    for (const platform of platforms) {
      const created = await prisma.platform.create({
        data: { slug: platform.slug, name: platform.name },
      });
      platformIds.set(platform.slug, created.id);
    }

    const gameIds = new Map<string, string>();
    for (const game of games) {
      const created = await prisma.game.create({
        data: {
          slug: game.slug,
          title: game.title,
          description: game.description,
          coverPath: game.coverPath,
          genres: [...game.genres],
          multiplayer: game.multiplayer,
          coop: game.coop,
          pve: game.pve,
          pvp: game.pvp,
        },
      });
      gameIds.set(game.slug, created.id);

      for (const platformSlug of game.platforms) {
        const platformId = platformIds.get(platformSlug);
        if (!platformId) {
          throw new Error(`Missing platform ${platformSlug}`);
        }
        await prisma.platformGame.create({
          data: { gameId: created.id, platformId },
        });
      }
    }

    const userIds = new Map<string, string>();
    for (const user of demoUsers) {
      const created = await prisma.user.create({
        data: {
          email: user.email,
          displayName: user.displayName,
          preference: {
            create: {
              favoriteGenres: [...user.favoriteGenres],
              theme: "dark",
            },
          },
        },
      });
      userIds.set(user.email, created.id);
    }

    const alexId = userIds.get(currentUser.email);
    if (!alexId) {
      throw new Error("Sample user was not created");
    }

    const accountIds = new Map<string, string>();
    for (const account of accountConnections) {
      const platformId = platformIds.get(account.platformSlug);
      if (!platformId) {
        throw new Error(`Missing platform ${account.platformSlug}`);
      }
      const created = await prisma.platformAccount.create({
        data: {
          userId: alexId,
          platformId,
          displayName: account.displayName,
          status: accountStatus[account.status],
        },
      });
      accountIds.set(account.platformSlug, created.id);
    }

    for (const entry of libraryEntries) {
      const userId = userIds.get(entry.ownerEmail);
      const gameId = gameIds.get(entry.gameSlug);
      const platformId = platformIds.get(entry.platformSlug);
      if (!userId || !gameId || !platformId) {
        throw new Error(`Incomplete library row for ${entry.gameSlug}`);
      }
      await prisma.userLibraryGame.create({
        data: {
          userId,
          gameId,
          platformId,
          platformAccountId:
            entry.ownerEmail === currentUser.email
              ? accountIds.get(entry.platformSlug)
              : undefined,
          status: libraryStatus[entry.status],
          playtimeMinutes: entry.playtimeMinutes,
          lastPlayedAt: entry.lastPlayedAt ? new Date(entry.lastPlayedAt) : null,
          aiMatchPercent: entry.aiMatchPercent,
        },
      });
    }

    for (const review of reviews) {
      const userId = userIds.get(review.authorEmail);
      const gameId = gameIds.get(review.gameSlug);
      if (!userId || !gameId) {
        throw new Error(`Incomplete review ${review.id}`);
      }
      await prisma.review.create({
        data: {
          userId,
          gameId,
          title: review.title,
          body: review.body,
          createdAt: new Date(review.createdAt),
        },
      });
    }

    for (const rating of ratings) {
      const userId = userIds.get(rating.userEmail);
      const gameId = gameIds.get(rating.gameSlug);
      if (!userId || !gameId) {
        throw new Error(`Incomplete rating for ${rating.gameSlug}`);
      }
      if (rating.score < 1 || rating.score > 10) {
        throw new Error(`Rating for ${rating.gameSlug} must be from 1 to 10`);
      }
      await prisma.rating.create({
        data: { userId, gameId, score: rating.score },
      });
    }

    console.log("Seeded sample games, platforms, and a demo library.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Seed failed";
  console.error(message);
  process.exit(1);
});
