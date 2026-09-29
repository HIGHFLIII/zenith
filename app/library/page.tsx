import type { Metadata } from "next";
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

  return (
    <div className="space-y-8">
      <PageIntro title="My Library">
        Alex Rivera&apos;s library, loaded from PostgreSQL. The same game can appear more than once
        when it is owned on more than one platform. AI Match is the percentage saved with that
        entry.
      </PageIntro>
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
