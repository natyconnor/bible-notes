import { describe, it, expect } from "vitest";
import { serializeDevLogArg } from "./serialize";

describe("serializeDevLogArg", () => {
  it("stringifies Errors with stack when present", () => {
    const err = new Error("boom");
    expect(serializeDevLogArg(err)).toContain("boom");
  });

  it("handles circular objects without throwing", () => {
    const a: Record<string, unknown> = { x: 1 };
    a.self = a;
    const s = serializeDevLogArg(a);
    expect(s).toContain("Unserializable");
  });
});
