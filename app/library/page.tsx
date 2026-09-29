import type { Metadata } from "next";
import { AddGameForm } from "@/components/add-game-form";
import { DatabaseNotice } from "@/components/database-notice";
import { LibraryBrowser } from "@/components/library-browser";
import { PageIntro } from "@/components/section-block";
import { loadCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Library",
};

export default async function LibraryPage() {
  const catalog = await loadCatalog();
  const ownerName = catalog.profile?.displayName ?? "Your";

  return (
    <div className="space-y-8">
      <PageIntro title="My Library">
        {ownerName}&apos;s library, saved in PostgreSQL. Add a game you own below. The same game can
        appear more than once when it is owned on more than one platform.
      </PageIntro>
      {catalog.state === "ok" && catalog.platforms.length > 0 ? (
        <AddGameForm platforms={catalog.platforms} />
      ) : null}
      {catalog.state === "ok" ? (
        <LibraryBrowser
          library={catalog.library}
          platformNames={catalog.platformNames}
          genres={catalog.genres}
        />
      ) : (
        <DatabaseNotice state={catalog.state} />
      )}
    </div>
  );
}
