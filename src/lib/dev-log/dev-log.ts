import { serializeDevLogParts } from "./serialize";
import { getMirrorToConsole, pushDevLogEntry } from "./store";
import type { DevLogLevel } from "./types";

function emit(level: DevLogLevel, channel: string, parts: unknown[]): void {
  if (!import.meta.env.DEV) return;
  const body = serializeDevLogParts(parts);
  pushDevLogEntry({ ts: Date.now(), level, channel, body });
  if (!getMirrorToConsole()) return;
  const tag = `[devLog:${channel}]`;
  switch (level) {
    case "debug":
      console.debug(tag, ...parts);
      break;
    case "info":
      console.info(tag, ...parts);
      break;
    case "warn":
      console.warn(tag, ...parts);
      break;
    case "error":
      console.error(tag, ...parts);
      break;
  }
}

export const devLog = {
  debug(channel: string, ...parts: unknown[]): void {
    emit("debug", channel, parts);
  },
  info(channel: string, ...parts: unknown[]): void {
    emit("info", channel, parts);
  },
  warn(channel: string, ...parts: unknown[]): void {
    emit("warn", channel, parts);
  },
  error(channel: string, ...parts: unknown[]): void {
    emit("error", channel, parts);
  },
};
