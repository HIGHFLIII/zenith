import type { CatalogState } from "@/lib/catalog";

export function DatabaseNotice({ state }: { state: Exclude<CatalogState, "ok"> }) {
  const message =
    state === "empty"
      ? "PostgreSQL is connected, and it does not have any games yet. Load the sample games, then refresh this page."
      : "This page reads games from PostgreSQL, and the database did not answer. The tables may not exist yet, or the database is stopped.";

  return (
    <p className="rounded-xl border border-dashed border-border px-4 py-6 text-sm leading-6 text-muted-foreground">
      {message}
    </p>
  );
}
