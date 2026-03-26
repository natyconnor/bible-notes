import type { DevLogEntry } from "./types";

export function formatDevLogEntryLine(entry: DevLogEntry): string {
  const iso = new Date(entry.ts).toISOString();
  return `${iso} [${entry.level}] ${entry.channel} ${entry.body}`;
}

export function formatDevLogEntriesForExport(
  entries: readonly DevLogEntry[],
): string {
  return entries.map((e) => formatDevLogEntryLine(e)).join("\n");
}
