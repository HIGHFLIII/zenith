import type { Metadata } from "next";
import { DatabaseNotice } from "@/components/database-notice";
import { FriendCard } from "@/components/friend-card";
import { PageIntro } from "@/components/section-block";
import { loadCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Friends",
};

export default async function FriendsPage() {
  const catalog = await loadCatalog();

  return (
    <div className="space-y-8">
      <PageIntro title="Friends">
        People stored in PostgreSQL, other than Alex Rivera, who have a game marked Playing. There
        is no friend list, invite, or social login yet.
      </PageIntro>
      {catalog.state !== "ok" ? (
        <DatabaseNotice state={catalog.state} />
      ) : catalog.friends.length === 0 ? (
        <p className="text-sm text-muted-foreground">No one else has a game marked Playing.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {catalog.friends.map((friend) => (
            <FriendCard
              key={`${friend.name}-${friend.gameSlug}-${friend.platformSlug}`}
              friend={friend}
            />
          ))}
        </div>
      )}
    </div>
  );
}
