import type { Metadata } from "next";
import { DatabaseNotice } from "@/components/database-notice";
import { PageIntro } from "@/components/section-block";
import { loadCatalog } from "@/lib/catalog";
import { formatPlaytime } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const catalog = await loadCatalog();
  const profile = catalog.profile;
  const uniqueGames = new Set(catalog.library.map((game) => game.slug)).size;
  const minutes = catalog.library.reduce((total, game) => total + (game.playtimeMinutes ?? 0), 0);
  const written = catalog.reviews.filter((review) => review.authorEmail === profile?.email).length;

  return (
    <div className="space-y-8">
      <PageIntro title={profile?.displayName ?? "Profile"}>
        This profile is loaded from PostgreSQL. It is not a signed-in account, and platform
        services are not connected.
      </PageIntro>
      {catalog.state !== "ok" || !profile ? (
        <DatabaseNotice state={catalog.state === "ok" ? "empty" : catalog.state} />
      ) : (
        <>
          <dl className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Library entries"
              value={String(catalog.library.length)}
              detail={`${uniqueGames} games`}
            />
            <Stat label="Playtime" value={formatPlaytime(minutes)} detail="Across saved copies" />
            <Stat label="Reviews" value={String(written)} detail="Saved in PostgreSQL" />
          </dl>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">Favorite genres</h2>
            {profile.favoriteGenres.length === 0 ? (
              <p className="text-sm text-muted-foreground">No favorite genres are saved yet.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {profile.favoriteGenres.map((genre) => (
                  <li key={genre} className="rounded-full bg-muted px-3 py-1 text-sm">
                    {genre}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
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
