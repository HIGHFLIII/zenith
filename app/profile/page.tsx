import type { Metadata } from "next";
import { PageIntro } from "@/components/section-block";
import { formatPlaytime } from "@/lib/format";
import { currentUser, myLibrary, reviews } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  const uniqueGames = new Set(myLibrary.map((game) => game.slug)).size;
  const minutes = myLibrary.reduce((total, game) => total + (game.playtimeMinutes ?? 0), 0);
  const written = reviews.filter((review) => review.authorEmail === currentUser.email).length;

  return (
    <div className="space-y-8">
      <PageIntro title={currentUser.displayName}>
        Sample gaming profile. This is not a signed-in account, and platform services are not
        connected.
      </PageIntro>
      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat label="Library entries" value={String(myLibrary.length)} detail={`${uniqueGames} games`} />
        <Stat label="Playtime" value={formatPlaytime(minutes)} detail="Across sample copies" />
        <Stat label="Reviews" value={String(written)} detail="Written in the sample data" />
      </dl>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Favorite genres</h2>
        <ul className="flex flex-wrap gap-2">
          {currentUser.favoriteGenres.map((genre) => (
            <li key={genre} className="rounded-full bg-muted px-3 py-1 text-sm">
              {genre}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold">{value}</dd>
      <dd className="mt-1 text-sm text-muted-foreground">{detail}</dd>
    </div>
  );
}
