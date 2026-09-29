import Image from "next/image";
import { formatDate, formatRating } from "@/lib/format";
import { gameBySlugOrThrow } from "@/lib/demo-data";
import type { ReviewRecord } from "@/types";

export function ReviewCard({ review }: { review: ReviewRecord }) {
  const game =
    review.gameTitle && review.coverPath
      ? { title: review.gameTitle, coverPath: review.coverPath }
      : gameBySlugOrThrow(review.gameSlug);

  return (
    <article className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <Image
        src={game.coverPath}
        alt=""
        width={72}
        height={96}
        unoptimized
        className="h-24 w-[4.5rem] shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0 space-y-1">
        <p className="text-sm text-muted-foreground">
          {game.title} · {review.authorName}
        </p>
        <h3 className="text-base font-semibold leading-6">{review.title}</h3>
        <p className="text-sm leading-6 text-foreground">{review.body}</p>
        <p className="text-sm text-muted-foreground">
          {formatRating(review.rating)} · {formatDate(review.createdAt)}
        </p>
      </div>
    </article>
  );
}
