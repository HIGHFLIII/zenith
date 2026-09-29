import Image from "next/image";
import { gameBySlugOrThrow, platformLabel } from "@/lib/demo-data";
import type { FriendActivity } from "@/types";

export function FriendCard({ friend }: { friend: FriendActivity }) {
  const fallback = friend.gameTitle && friend.coverPath ? null : gameBySlugOrThrow(friend.gameSlug);
  const title = friend.gameTitle ?? fallback?.title ?? friend.gameSlug;
  const coverPath = friend.coverPath ?? fallback?.coverPath ?? "";
  const platform = friend.platformName ?? platformLabel(friend.platformSlug);

  return (
    <article className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <Image
        src={coverPath}
        alt=""
        width={72}
        height={96}
        unoptimized
        className="h-24 w-[4.5rem] shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0">
        <h3 className="text-base font-semibold">{friend.name}</h3>
        <p className="mt-1 text-sm text-foreground">
          Playing {title} on {platform}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{friend.note}</p>
      </div>
    </article>
  );
}
