import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HighlightMarkPopover } from "./highlight-mark-popover";

const anchorRect = {
  top: 120,
  left: 160,
  bottom: 140,
  right: 220,
  width: 60,
  height: 20,
  x: 160,
  y: 120,
  toJSON: () => ({}),
} satisfies DOMRect;

describe("HighlightMarkPopover", () => {
  it("recolors a highlight on mouse down", () => {
    const onRecolor = vi.fn();

    render(
      <HighlightMarkPopover
        anchorRect={anchorRect}
        highlightId="hl_123"
        currentColor="yellow"
        onDelete={() => {}}
        onRecolor={onRecolor}
        onClose={() => {}}
      />,
    );

    fireEvent.mouseDown(screen.getByTitle("Change to Green"));

    expect(onRecolor).toHaveBeenCalledWith("green");
  });

  it("still supports keyboard activation", async () => {
    const user = userEvent.setup();
    const onRecolor = vi.fn();

    render(
      <HighlightMarkPopover
        anchorRect={anchorRect}
        highlightId="hl_123"
        currentColor="yellow"
        onDelete={() => {}}
        onRecolor={onRecolor}
        onClose={() => {}}
      />,
    );

    await user.tab();
    await user.keyboard("{Enter}");

    expect(onRecolor).toHaveBeenCalledWith("yellow");
  });
});
