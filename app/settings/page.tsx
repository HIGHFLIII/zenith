import type { Metadata } from "next";
import { DatabaseNotice } from "@/components/database-notice";
import { SaveNameForm } from "@/components/save-name-form";
import { SteamImportForm } from "@/components/steam-import-form";
import { AccountStatusBadge } from "@/components/status-badge";
import { PageIntro } from "@/components/section-block";
import { Input } from "@/components/ui/input";
import { loadCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const catalog = await loadCatalog();
  const profile = catalog.profile;

  return (
    <div className="space-y-10">
      <PageIntro title="Settings">
        Your name is saved here. Steam is contacted only when you click Import Steam library. No
        other store is contacted, and nothing here signs you in.
      </PageIntro>

      {catalog.state !== "ok" || !profile ? (
        <DatabaseNotice state={catalog.state === "ok" ? "empty" : catalog.state} />
      ) : (
        <>
          <section className="max-w-lg space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Your name</h2>
            <SaveNameForm displayName={profile.displayName} />
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Library record
              </label>
              <Input id="email" type="email" value={profile.email} readOnly />
            </div>
            <p className="text-sm text-muted-foreground">
              The name above is what the site shows. Sign-in is not available yet.
            </p>
          </section>

          <SteamImportForm />

          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">Connected Gaming Accounts</h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Each row is the connection saved for {profile.displayName}: Connected, Not
                Connected, Partial Sync, or Manual Library.
              </p>
            </div>
            {catalog.accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No platform connections are saved yet.</p>
            ) : (
              <ul className="grid gap-3 md:grid-cols-2">
                {catalog.accounts.map((account) => (
                  <li
                    key={account.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
                  >
                    <div>
                      <p className="font-medium">{account.platformName}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.displayName ?? "No display name"}
                      </p>
                    </div>
                    <AccountStatusBadge status={account.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
