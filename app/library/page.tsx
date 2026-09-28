import type { Metadata } from "next";
import { LibraryBrowser } from "@/components/library-browser";
import { PageIntro } from "@/components/section-block";

export const metadata: Metadata = {
  title: "My Library",
};

export default function LibraryPage() {
  return (
    <div className="space-y-8">
      <PageIntro title="My Library">
        Alex Rivera&apos;s sample library. The same game can appear more than once when it is
        owned on more than one platform. AI Match is a placeholder percentage, not a live
        recommendation.
      </PageIntro>
      <LibraryBrowser />
    </div>
  );
}
