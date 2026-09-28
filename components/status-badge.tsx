import type { LibraryStatus, PlatformAccountStatus } from "@/types";
import { cn } from "@/lib/utils";

const libraryTone: Record<LibraryStatus, string> = {
  Playing: "bg-sky-300",
  Completed: "bg-emerald-300",
  Backlog: "bg-zinc-300",
  Dropped: "bg-rose-300",
  "Want to Play": "bg-amber-200",
  Favorite: "bg-amber-100",
};

const accountTone: Record<PlatformAccountStatus, string> = {
  Connected: "bg-emerald-300",
  "Not Connected": "bg-zinc-300",
  "Partial Sync": "bg-amber-200",
  "Manual Library": "bg-sky-300",
};

export function LibraryStatusBadge({ status }: { status: LibraryStatus }) {
  return <Badge label={status} dotClassName={libraryTone[status]} />;
}

export function AccountStatusBadge({ status }: { status: PlatformAccountStatus }) {
  return <Badge label={status} dotClassName={accountTone[status]} />;
}

function Badge({ label, dotClassName }: { label: string; dotClassName: string }) {
  return (
    <span className="inline-flex h-7 items-center gap-2 rounded-full bg-muted px-2.5 text-xs font-medium text-foreground">
      <span className={cn("size-2 rounded-full", dotClassName)} aria-hidden="true" />
      {label}
    </span>
  );
}
