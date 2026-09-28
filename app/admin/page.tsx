import type { Metadata } from "next";
import Link from "next/link";
import { AdminActions } from "@/components/admin-actions";
import { PageIntro } from "@/components/section-block";

export const metadata: Metadata = {
  title: "Admin",
};

const metrics = [
  { label: "Website Status", value: "Online", detail: "Sample. The page itself is the check." },
  { label: "Database Status", value: "Unknown", detail: "Sample. Open the health check for a live result." },
  { label: "API Status", value: "Not connected", detail: "Sample. No external gaming APIs are linked." },
  { label: "Active Users", value: "1", detail: "Sample profile: Alex Rivera." },
  { label: "Synchronization Jobs", value: "0", detail: "Sample. Nothing is syncing." },
  { label: "Recent Errors", value: "None", detail: "Sample. This page does not read logs." },
  { label: "Server CPU", value: "12%", detail: "Sample figure, not this computer." },
  { label: "Server Memory", value: "38%", detail: "Sample figure, not this computer." },
  { label: "Disk Usage", value: "41%", detail: "Sample figure, not this computer." },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <PageIntro title="Admin">
        A private administrator preview. There is no login yet, so anyone who can open this
        computer can see the page. The numbers are samples. The buttons do not read logs, run
        commands, or call an AI.
      </PageIntro>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-sm font-medium text-muted-foreground">{metric.label}</h2>
            <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{metric.detail}</p>
          </article>
        ))}
      </div>
      <AdminActions />
      <p className="text-sm text-muted-foreground">
        Live app and database status:{" "}
        <Link
          href="/api/health"
          className="text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
        >
          Open health check
        </Link>
      </p>
    </div>
  );
}
