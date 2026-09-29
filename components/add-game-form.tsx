"use client";

import { useActionState, useEffect, useRef } from "react";
import { addGameAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WriteResult } from "@/lib/library-writes";
import { LIBRARY_STATUSES } from "@/types";

const initialState: WriteResult = { error: null, saved: false };

const selectClassName =
  "h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

export function AddGameForm({
  platforms,
}: {
  platforms: { slug: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(addGameAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.saved) {
      formRef.current?.reset();
    }
  }, [state.saved]);

  return (
    <form ref={formRef} action={action} className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Add a game</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          This saves a game you own into your library. It does not contact Steam or any other store.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1 md:col-span-2">
          <label htmlFor="game-title" className="text-sm font-medium">
            Title
          </label>
          <Input id="game-title" name="title" required maxLength={120} className="h-11" placeholder="Game title" />
        </div>
        <div className="space-y-1">
          <label htmlFor="game-platform" className="text-sm font-medium">
            Platform
          </label>
          <select id="game-platform" name="platform" required className={selectClassName} defaultValue="">
            <option value="" disabled>
              Choose a platform
            </option>
            {platforms.map((platform) => (
              <option key={platform.slug} value={platform.slug}>
                {platform.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="game-status" className="text-sm font-medium">
            Status
          </label>
          <select id="game-status" name="status" className={selectClassName} defaultValue="Playing">
            {LIBRARY_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="game-genre" className="text-sm font-medium">
            Genre
          </label>
          <Input id="game-genre" name="genre" maxLength={40} className="h-11" placeholder="Optional" />
        </div>
        <div className="space-y-1">
          <label htmlFor="game-hours" className="text-sm font-medium">
            Hours played
          </label>
          <Input id="game-hours" name="hours" inputMode="decimal" className="h-11" placeholder="Optional" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" className="h-11 px-4" disabled={pending}>
          {pending ? "Saving…" : "Add to my library"}
        </Button>
        {state.saved ? <p className="text-sm text-muted-foreground">Added to your library.</p> : null}
        {state.error ? (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
