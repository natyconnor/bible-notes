export type DevLogLevel = "debug" | "info" | "warn" | "error";

export interface DevLogEntry {
  id: number;
  ts: number;
  level: DevLogLevel;
  channel: string;
  body: string;
}
