export type SteamOwnedGame = {
  appid: number;
  name: string;
  playtime_forever?: number;
  playtime_2weeks?: number;
};

export type SteamLibrary = {
  games: SteamOwnedGame[];
  personaName: string | null;
};

type SteamFailure = { error: string };

function steamConfig(): { key: string; steamId: string } | SteamFailure {
  const key = process.env.STEAM_API_KEY?.trim() ?? "";
  const steamId = process.env.STEAM_ID?.trim() ?? "";
  if (!key || !steamId) {
    return {
      error: "Add STEAM_API_KEY and STEAM_ID to the .env file on the Pi, then restart the site.",
    };
  }
  if (!/^\d{17}$/.test(steamId)) {
    return { error: "STEAM_ID should be the 17-digit number from your Steam profile address." };
  }
  return { key, steamId };
}

async function steamGet(path: string, params: Record<string, string>, key: string): Promise<unknown | SteamFailure> {
  const url = new URL(`https://api.steampowered.com/${path}`);
  url.searchParams.set("key", key);
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, value);
  }

  try {
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(20000) });
    if (response.status === 401 || response.status === 403) {
      return { error: "Steam rejected the key." };
    }
    if (!response.ok) {
      return { error: "Steam did not answer." };
    }
    return (await response.json()) as unknown;
  } catch {
    return { error: "Steam did not answer." };
  }
}

function isFailure(value: unknown): value is SteamFailure {
  return typeof value === "object" && value !== null && "error" in value && typeof value.error === "string";
}

export async function fetchSteamLibrary(): Promise<SteamLibrary | SteamFailure> {
  const config = steamConfig();
  if ("error" in config) return config;

  const owned = await steamGet(
    "IPlayerService/GetOwnedGames/v0001/",
    {
      steamid: config.steamId,
      include_appinfo: "1",
      include_played_free_games: "1",
      format: "json",
    },
    config.key,
  );
  if (isFailure(owned)) return owned;

  const response = (owned as { response?: { games?: unknown } }).response;
  if (!response || !Array.isArray(response.games)) {
    return {
      error: "Steam returned no games. Set Game details to Public on your Steam profile, then try again.",
    };
  }

  const games: SteamOwnedGame[] = [];
  for (const entry of response.games) {
    if (!entry || typeof entry !== "object") continue;
    const game = entry as { appid?: unknown; name?: unknown; playtime_forever?: unknown; playtime_2weeks?: unknown };
    if (typeof game.appid !== "number" || typeof game.name !== "string" || game.name.trim() === "") continue;
    games.push({
      appid: game.appid,
      name: game.name.trim(),
      playtime_forever: typeof game.playtime_forever === "number" ? game.playtime_forever : 0,
      playtime_2weeks: typeof game.playtime_2weeks === "number" ? game.playtime_2weeks : 0,
    });
  }

  if (games.length === 0) {
    return {
      error: "Steam returned no games. Set Game details to Public on your Steam profile, then try again.",
    };
  }

  let personaName: string | null = null;
  const summary = await steamGet(
    "ISteamUser/GetPlayerSummaries/v0002/",
    { steamids: config.steamId },
    config.key,
  );
  if (!isFailure(summary)) {
    const players = (summary as { response?: { players?: { personaname?: string }[] } }).response?.players;
    const name = players?.[0]?.personaname?.trim();
    if (name) personaName = name;
  }

  return { games, personaName };
}
