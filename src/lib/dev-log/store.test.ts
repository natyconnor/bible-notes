import { describe, it, expect, beforeEach } from "vitest";
import {
  clearDevLog,
  DEV_LOG_MAX_ENTRIES,
  getDevLogEntries,
  pushDevLogEntry,
} from "./store";

describe("dev log store", () => {
  beforeEach(() => {
    clearDevLog();
  });

  it("caps entries at DEV_LOG_MAX_ENTRIES", () => {
    const extra = 40;
    for (let i = 0; i < DEV_LOG_MAX_ENTRIES + extra; i++) {
      pushDevLogEntry({
        ts: i,
        level: "debug",
        channel: "test",
        body: String(i),
      });
    }
    expect(getDevLogEntries().length).toBe(DEV_LOG_MAX_ENTRIES);
    expect(getDevLogEntries()[0]?.body).toBe(String(extra));
    expect(getDevLogEntries().at(-1)?.body).toBe(
      String(DEV_LOG_MAX_ENTRIES + extra - 1),
    );
  });
});
