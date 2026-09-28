import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Zenith keeps a sample game library in one place. Store accounts are not connected.</p>
        <nav aria-label="Footer" className="flex gap-4">
          <Link
            href="/settings"
            className="rounded-md text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
          >
            Settings
          </Link>
          <Link
            href="/admin"
            className="rounded-md text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
          >
            Admin
          </Link>
        </nav>
      </div>
    </footer>
  );
}
