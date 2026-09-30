"use server";

import { addLibraryGame, saveDisplayName, type WriteResult } from "@/lib/library-writes";
import { importSteamLibrary, type SteamImportResult } from "@/lib/steam-sync";

export async function saveDisplayNameAction(
  _previous: WriteResult,
  formData: FormData,
): Promise<WriteResult> {
  return saveDisplayName(String(formData.get("displayName") ?? ""));
}

export async function importSteamAction(): Promise<SteamImportResult> {
  return importSteamLibrary();
}

export async function addGameAction(
  _previous: WriteResult,
  formData: FormData,
): Promise<WriteResult> {
  return addLibraryGame({
    title: String(formData.get("title") ?? ""),
    platformSlug: String(formData.get("platform") ?? ""),
    status: String(formData.get("status") ?? ""),
    genre: String(formData.get("genre") ?? ""),
    hours: String(formData.get("hours") ?? ""),
  });
}
