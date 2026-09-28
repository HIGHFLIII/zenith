import Image from "next/image";
import { formatPlaytime, formatRating } from "@/lib/format";
import type { GameCardModel } from "@/types";
import { LibraryStatusBadge } from "@/components/status-badge";

export function GameCard({
  game,
  priority = false,
}: {
  game: GameCardModel;
  priority?: boolean;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[3/4] bg-muted">
        <Image
          src={game.coverPath}
          alt={`${game.title} cover`}
          fill
          sizes="(max-width: 768px) 50vw, 240px"
          className="object-cover"
          priority={priority}
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-semibold leading-6">{game.title}</h3>
        <ul className="flex flex-wrap gap-1.5" aria-label="Platforms">
          {game.platforms.map((platform) => (
            <li
              key={platform}
              className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground"
            >
              {platform}
            </li>
          ))}
        </ul>
        <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Rating</dt>
            <dd>{formatRating(game.rating)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Playtime</dt>
            <dd>{formatPlaytime(game.playtimeMinutes)}</dd>
          </div>
          {game.aiMatchPercent !== null ? (
            <div className="col-span-2">
              <dt className="text-muted-foreground">AI Match</dt>
              <dd>{game.aiMatchPercent}%</dd>
            </div>
          ) : null}
        </dl>
        {game.status ? <LibraryStatusBadge status={game.status} /> : null}
      </div>
    </article>
  );
}
