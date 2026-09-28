import Image from "next/image";
import Link from "next/link";
import { FriendCard } from "@/components/friend-card";
import { GameCard } from "@/components/game-card";
import { ReviewCard } from "@/components/review-card";
import { cardGridClassName, SectionBlock } from "@/components/section-block";
import {
  continuePlaying,
  friends,
  popularGames,
  recentReviews,
  recommended,
} from "@/lib/demo-data";

const primaryLink =
  "inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60";
const secondaryLink =
  "inline-flex h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-sm font-medium tracking-wide text-primary">Sample library</p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            One library for every place you play.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">
            Zenith is where a game collection can live together, whether it started on Steam,
            Xbox, PlayStation, or somewhere else. This preview is filled with sample games so you
            can look around. External gaming services are not connected yet.
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
        <ul className="grid grid-cols-3 gap-3" aria-label="Sample covers">
          {popularGames.slice(0, 3).map((game, index) => (
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
      </section>

      <SectionBlock
        title="Recommended For You"
        description="Sample match scores for Alex Rivera. Nothing here is calculated by AI."
      >
        <div className={cardGridClassName}>
          {recommended.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Continue Playing" description="Games marked Playing in the sample library.">
        <div className={cardGridClassName}>
          {continuePlaying.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Recently Reviewed" description="Sample write-ups from the demo profiles.">
        <div className="grid gap-4 lg:grid-cols-2">
          {recentReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Popular Games" description="The six games included with this project.">
        <div className={cardGridClassName}>
          {popularGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Friends Are Playing" description="Sample activity. Friends are not a live social feed.">
        <div className="grid gap-4 md:grid-cols-2">
          {friends.map((friend) => (
            <FriendCard key={friend.name} friend={friend} />
          ))}
        </div>
      </SectionBlock>
    </div>
  );
}
