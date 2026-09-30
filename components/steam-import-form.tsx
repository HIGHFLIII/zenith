"use client";

import { useActionState } from "react";
import { importSteamAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import type { SteamImportResult } from "@/lib/steam-sync";

const initialState: SteamImportResult = { error: null, saved: false, imported: 0, updated: 0 };

export function SteamImportForm() {
  const [state, action, pending] = useActionState(importSteamAction, initialState);

  return (
    <form action={action} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Import from Steam</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          This reads the games on your Steam account and saves them in your library. Games played
          in the last two weeks are marked Playing. The rest are marked Backlog. Playtime comes
          from Steam. A game already in the library keeps its status, and its playtime is updated.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" className="h-11 px-4" disabled={pending}>
          {pending ? "Importing…" : "Import Steam library"}
        </Button>
        {state.saved ? (
          <p className="text-sm text-muted-foreground">
            Added {state.imported} games. Updated playtime on {state.updated}.
          </p>
        ) : null}
        {state.error ? (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
