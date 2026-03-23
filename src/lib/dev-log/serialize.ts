export function serializeDevLogArg(value: unknown): string {
  if (value instanceof Error) {
    return value.stack ?? value.message;
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "bigint") {
    return `${value}n`;
  }
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return `[Unserializable ${Object.prototype.toString.call(value)}]`;
    }
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "symbol") {
    const d = value.description;
    return d !== undefined ? `Symbol(${d})` : "Symbol()";
  }
  if (typeof value === "function") {
    const name = value.name;
    return name ? `function ${name}()` : "function ()";
  }
  return `(${typeof value})`;
}

export function serializeDevLogParts(parts: readonly unknown[]): string {
  return parts.map(serializeDevLogArg).join(" ");
}
