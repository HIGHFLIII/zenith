import type { Metadata } from "next";
import { GamesSearch } from "@/components/games-search";
import { PageIntro } from "@/components/section-block";

export const metadata: Metadata = {
  title: "Games",
};

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <PageIntro title="Games">
        Search the sample catalog by title, genre, or platform. This is not a live store search,
        and no gaming service is connected.
      </PageIntro>
      <GamesSearch />
    </div>
  );
}
