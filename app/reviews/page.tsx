import type { Metadata } from "next";
import { DatabaseNotice } from "@/components/database-notice";
import { ReviewCard } from "@/components/review-card";
import { PageIntro } from "@/components/section-block";
import { loadCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews",
};

export default async function ReviewsPage() {
  const catalog = await loadCatalog();

  return (
    <div className="space-y-8">
      <PageIntro title="Reviews">
        Reviews stored in PostgreSQL. Writing and posting reviews is not available yet.
      </PageIntro>
      {catalog.state === "ok" ? (
        catalog.reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews are stored yet.</p>
        ) : (
          <div className="grid gap-4">
            {catalog.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )
      ) : (
        <DatabaseNotice state={catalog.state} />
      )}
    </div>
  );
}
