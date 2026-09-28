import type { Metadata } from "next";
import { AccountStatusBadge } from "@/components/status-badge";
import { PageIntro } from "@/components/section-block";
import { Input } from "@/components/ui/input";
import { accountConnections, currentUser, platformLabel } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-10">
      <PageIntro title="Settings">
        Account details and gaming platform connections for the sample profile. Nothing here signs
        you in, and no store is contacted.
      </PageIntro>

      <section className="max-w-lg space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Account</h2>
        <div className="space-y-1">
          <label htmlFor="display-name" className="text-sm font-medium">
            Display name
          </label>
          <Input id="display-name" value={currentUser.displayName} readOnly />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" type="email" value={currentUser.email} readOnly />
        </div>
        <p className="text-sm text-muted-foreground">Editing your account is not available yet.</p>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Connected Gaming Accounts</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Each row shows a fake state: Connected, Not Connected, Partial Sync, or Manual Library.
          </p>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {accountConnections.map((account) => (
            <li
              key={account.platformSlug}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div>
                <p className="font-medium">{platformLabel(account.platformSlug)}</p>
                <p className="text-sm text-muted-foreground">
                  {account.displayName ?? "No display name"}
                </p>
              </div>
              <AccountStatusBadge status={account.status} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
