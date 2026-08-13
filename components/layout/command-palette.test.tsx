import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CommandPalette } from "./command-palette";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("CommandPalette", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    push.mockReset();
  });

  it("opens with Ctrl+K and closes with Escape", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);

    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Navigate, explore, or connect…")).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Command palette" })).not.toBeInTheDocument();
  });

  it("restores focus to its trigger after closing", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);
    const trigger = screen.getByRole("button", { name: /open command palette/i });

    expect(trigger).toHaveAccessibleName("Open command palette");
    expect(trigger).toHaveAttribute("aria-keyshortcuts", "Control+K Meta+K");

    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(trigger).toHaveFocus();
  });

  it("copies the public email address", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    render(<CommandPalette />);

    await user.click(screen.getByRole("button", { name: /open command palette/i }));
    await user.click(screen.getByText("Copy email"));

    expect(writeText).toHaveBeenCalledWith("aayushkumar345@gmail.com");
    expect(await screen.findByText("COPIED")).toBeInTheDocument();
  });
});
