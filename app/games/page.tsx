import type { Metadata } from "next";
import { DatabaseNotice } from "@/components/database-notice";
import { GamesSearch } from "@/components/games-search";
import { PageIntro } from "@/components/section-block";
import { loadCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Games",
};

export default async function GamesPage() {
  const catalog = await loadCatalog();

  return (
    <div className="space-y-8">
      <PageIntro title="Games">
        Search the games stored in PostgreSQL by title, genre, or platform. This is not a live
        store search, and no gaming service is connected.
      </PageIntro>
      {catalog.state === "ok" ? (
        <GamesSearch games={catalog.popularGames} />
      ) : (
        <DatabaseNotice state={catalog.state} />
      )}
    </div>
  );
}
