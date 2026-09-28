import type { Metadata } from "next";
import { ReviewCard } from "@/components/review-card";
import { PageIntro } from "@/components/section-block";
import { recentReviews } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Reviews",
};

export default function ReviewsPage() {
  return (
    <div className="space-y-8">
      <PageIntro title="Reviews">
        Sample reviews from the demo library. Writing and posting reviews is not available yet.
      </PageIntro>
      <div className="grid gap-4">
        {recentReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
