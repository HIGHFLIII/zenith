"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const actions = ["View Logs", "Analyze Error with AI", "System Health Check"] as const;

export function AdminActions() {
  const [message, setMessage] = useState("These buttons are not wired up yet.");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {actions.map((label) => (
          <Button
            key={label}
            type="button"
            variant="outline"
            className="h-11"
            onClick={() => setMessage(`${label} is not wired up yet.`)}
          >
            {label}
          </Button>
        ))}
      </div>
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
