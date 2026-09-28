"use client";

import { useMemo, useState } from "react";
import { GameCard } from "@/components/game-card";
import { cardGridClassName } from "@/components/section-block";
import { Button } from "@/components/ui/button";
import { genres, myLibrary, platforms } from "@/lib/demo-data";
import { LIBRARY_STATUSES, SORT_OPTIONS, type SortOption } from "@/types";

const selectClassName =
  "h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

export function LibraryBrowser() {
  const [platform, setPlatform] = useState("All");
  const [genre, setGenre] = useState("All");
  const [status, setStatus] = useState("All");
  const [multiplayer, setMultiplayer] = useState(false);
  const [coop, setCoop] = useState(false);
  const [pve, setPve] = useState(false);
  const [pvp, setPvp] = useState(false);
  const [sort, setSort] = useState<SortOption>("Recently Played");

  const games = useMemo(() => {
    const filtered = myLibrary.filter((game) => {
      if (platform !== "All" && !game.platforms.includes(platform)) return false;
      if (genre !== "All" && !game.genres.includes(genre)) return false;
      if (status !== "All" && game.status !== status) return false;
      if (multiplayer && !game.multiplayer) return false;
      if (coop && !game.coop) return false;
      if (pve && !game.pve) return false;
      if (pvp && !game.pvp) return false;
      return true;
    });

    return filtered.sort((a, b) => compareGames(a, b, sort));
  }, [coop, genre, multiplayer, platform, pve, pvp, sort, status]);

  function resetFilters() {
    setPlatform("All");
    setGenre("All");
    setStatus("All");
    setMultiplayer(false);
    setCoop(false);
    setPve(false);
    setPvp(false);
    setSort("Recently Played");
  }

  return (
    <div className="space-y-6">
      <form className="grid gap-4 rounded-xl border border-border bg-card p-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-1 text-sm font-medium" htmlFor="filter-platform">
          Platform
          <select
            id="filter-platform"
            className={selectClassName}
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
          >
            <option>All</option>
            {platforms.map((item) => (
              <option key={item.slug}>{item.name}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium" htmlFor="filter-genre">
          Genre
          <select
            id="filter-genre"
            className={selectClassName}
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
          >
            <option>All</option>
            {genres.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium" htmlFor="filter-status">
          Status
          <select
            id="filter-status"
            className={selectClassName}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All</option>
            {LIBRARY_STATUSES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium" htmlFor="filter-sort">
          Sort
          <select
            id="filter-sort"
            className={selectClassName}
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
          >
            {SORT_OPTIONS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <fieldset className="flex flex-wrap gap-x-4 gap-y-2 md:col-span-2 xl:col-span-4">
          <legend className="sr-only">Play style</legend>
          <FilterCheck label="Multiplayer" checked={multiplayer} onChange={setMultiplayer} />
          <FilterCheck label="Co-op" checked={coop} onChange={setCoop} />
          <FilterCheck label="PvE" checked={pve} onChange={setPve} />
          <FilterCheck label="PvP" checked={pvp} onChange={setPvp} />
        </fieldset>
      </form>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {games.length} of {myLibrary.length} library entries
        </p>
        <Button type="button" variant="outline" className="h-11" onClick={resetFilters}>
          Reset filters
        </Button>
      </div>

      {games.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No games match these filters.
        </p>
      ) : (
        <div className={cardGridClassName}>
          {games.map((game, index) => (
            <GameCard key={game.id} game={game} priority={index === 0} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterCheck({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex h-11 items-center gap-2 text-sm">
      <input
        type="checkbox"
        className="size-4 accent-[var(--primary)]"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

function compareGames(
  a: (typeof myLibrary)[number],
  b: (typeof myLibrary)[number],
  sort: SortOption,
) {
  const title = a.title.localeCompare(b.title) || a.platforms[0].localeCompare(b.platforms[0]);
  switch (sort) {
    case "Recently Played":
      return (b.lastPlayedAt ?? "").localeCompare(a.lastPlayedAt ?? "") || title;
    case "Rating":
      return (b.rating ?? -1) - (a.rating ?? -1) || title;
    case "Playtime":
      return (b.playtimeMinutes ?? 0) - (a.playtimeMinutes ?? 0) || title;
    case "Alphabetical":
      return title;
    case "AI Match":
      return (b.aiMatchPercent ?? -1) - (a.aiMatchPercent ?? -1) || title;
  }
}
