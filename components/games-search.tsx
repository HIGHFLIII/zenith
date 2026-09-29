"use client";

import { useMemo, useState } from "react";
import { GameCard } from "@/components/game-card";
import { cardGridClassName } from "@/components/section-block";
import { Input } from "@/components/ui/input";
import type { GameCardModel } from "@/types";

export function GamesSearch({ games }: { games: GameCardModel[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return games;
    return games.filter((game) => {
      const haystack = `${game.title} ${game.genres.join(" ")} ${game.platforms.join(" ")}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [games, query]);

  return (
    <div className="space-y-6">
      <div className="max-w-md space-y-1">
        <label htmlFor="game-search" className="text-sm font-medium">
          Search games
        </label>
        <Input
          id="game-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try co-op, RPG, or Steam"
          className="h-11"
        />
      </div>
      {results.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No games match that search.
        </p>
      ) : (
        <div className={cardGridClassName}>
          {results.map((game, index) => (
            <GameCard key={game.id} game={game} priority={index === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
