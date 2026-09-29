import Image from "next/image";
import Link from "next/link";
import { DatabaseNotice } from "@/components/database-notice";
import { FriendCard } from "@/components/friend-card";
import { GameCard } from "@/components/game-card";
import { ReviewCard } from "@/components/review-card";
import { cardGridClassName, SectionBlock } from "@/components/section-block";
import { loadCatalog } from "@/lib/catalog";
import type { GameCardModel } from "@/types";

export const dynamic = "force-dynamic";

const primaryLink =
  "inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60";
const secondaryLink =
  "inline-flex h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60";

export default async function HomePage() {
  const catalog = await loadCatalog();
  const ownerName = catalog.profile?.displayName ?? "Your";
  const covers = catalog.popularGames.slice(0, 3);

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-sm font-medium tracking-wide text-primary">{ownerName}&apos;s library</p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            One library for every place you play.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">
            Zenith keeps a game collection together, whether it started on Steam, Xbox, PlayStation,
            or somewhere else. Home reads the games stored in PostgreSQL. External gaming services
            are not connected yet.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/library" className={primaryLink}>
              My Library
            </Link>
            <Link href="/games" className={secondaryLink}>
              Browse games
            </Link>
          </div>
        </div>
        {covers.length > 0 ? (
          <ul className="grid grid-cols-3 gap-3" aria-label="Library covers">
            {covers.map((game, index) => (
              <li key={game.id} className="overflow-hidden rounded-xl border border-border bg-card">
                <Image
                  src={game.coverPath}
                  alt={`${game.title} cover`}
                  width={400}
                  height={533}
                  priority={index === 0}
                  unoptimized
                  className="aspect-[3/4] h-auto w-full object-cover"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {catalog.state !== "ok" ? <DatabaseNotice state={catalog.state} /> : null}

      <SectionBlock
        title="Recommended For You"
        description={`The highest match scores saved on ${ownerName}'s games. Nothing here is calculated live.`}
      >
        <GameGrid games={catalog.recommended} />
      </SectionBlock>

      <SectionBlock title="Continue Playing" description="Games marked Playing in PostgreSQL.">
        <GameGrid games={catalog.continuePlaying} />
      </SectionBlock>

      <SectionBlock title="Recently Reviewed" description="Reviews stored in PostgreSQL.">
        {catalog.reviews.length === 0 ? (
          <EmptyLine />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {catalog.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </SectionBlock>

      <SectionBlock title="Popular Games" description="Every game currently stored in the catalog.">
        <GameGrid games={catalog.popularGames} />
      </SectionBlock>

      <SectionBlock
        title="Friends Are Playing"
        description="Other people in the database who have a game marked Playing."
      >
        {catalog.friends.length === 0 ? (
          <EmptyLine />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {catalog.friends.map((friend) => (
              <FriendCard key={`${friend.name}-${friend.gameSlug}`} friend={friend} />
            ))}
          </div>
        )}
      </SectionBlock>
    </div>
  );
}

function GameGrid({ games }: { games: GameCardModel[] }) {
  if (games.length === 0) return <EmptyLine />;
  return (
    <div className={cardGridClassName}>
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

function EmptyLine() {
  return <p className="text-sm text-muted-foreground">Nothing in this section yet.</p>;
}
