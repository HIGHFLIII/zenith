import type { Metadata } from "next";
import { FriendCard } from "@/components/friend-card";
import { PageIntro } from "@/components/section-block";
import { friends } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Friends",
};

export default function FriendsPage() {
  return (
    <div className="space-y-8">
      <PageIntro title="Friends">
        A preview of what friends are playing. There is no friend list, invite, or social login yet.
      </PageIntro>
      <div className="grid gap-4 md:grid-cols-2">
        {friends.map((friend) => (
          <FriendCard key={friend.name} friend={friend} />
        ))}
      </div>
    </div>
  );
}
