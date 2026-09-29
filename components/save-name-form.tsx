"use client";

import { useActionState } from "react";
import { saveDisplayNameAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WriteResult } from "@/lib/library-writes";

const initialState: WriteResult = { error: null, saved: false };

export function SaveNameForm({ displayName }: { displayName: string }) {
  const [state, action, pending] = useActionState(saveDisplayNameAction, initialState);

  return (
    <form action={action} className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="display-name" className="text-sm font-medium">
          Your name
        </label>
        <Input
          id="display-name"
          name="displayName"
          defaultValue={displayName}
          maxLength={80}
          required
          className="h-11"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" className="h-11 px-4" disabled={pending}>
          {pending ? "Saving…" : "Save name"}
        </Button>
        {state.saved ? <p className="text-sm text-muted-foreground">Saved.</p> : null}
        {state.error ? (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
