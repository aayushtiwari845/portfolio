import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MobileMenu } from "./mobile-menu";

const navigation = [
  { label: "Experience", href: "/#experience" },
  { label: "Work", href: "/#work" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
  { label: "Résumé", href: "/resume" },
] as const;

interface HarnessProps {
  readonly activeSection?: string | null;
  readonly pathname?: string;
}

function MobileMenuHarness({
  activeSection = "work",
  pathname = "/",
}: HarnessProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button onClick={() => setOpen(true)} ref={triggerRef} type="button">
        Open navigation menu
      </button>
      <MobileMenu
        activeSection={activeSection}
        githubHref="https://github.com/example"
        linkedinHref="https://www.linkedin.com/in/example"
        navigation={navigation}
        onOpenChange={setOpen}
        open={open}
        pathname={pathname}
        triggerRef={triggerRef}
      />
    </>
  );
}

describe("MobileMenu", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "requestAnimationFrame",
      (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("focuses the first link and restores its external trigger on Escape", async () => {
    const user = userEvent.setup();
    render(<MobileMenuHarness />);
    const trigger = screen.getByRole("button", { name: "Open navigation menu" });

    await user.click(trigger);

    expect(
      screen.getByRole("dialog", { name: "Navigation / Index" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /experience/i })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", { name: "Navigation / Index" }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("preserves navigation state, numbering and external-link semantics", async () => {
    const user = userEvent.setup();
    render(<MobileMenuHarness />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    expect(screen.getByRole("link", { name: /work/i })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getAllByText(/^0[1-6]$/)).toHaveLength(6);
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "rel",
      "noreferrer",
    );
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/example",
    );
  });

  it("moves focus to a same-page section heading after navigation", async () => {
    const user = userEvent.setup();
    render(
      <>
        <MobileMenuHarness />
        <h2 id="work-heading">Selected work</h2>
      </>,
    );
    const heading = screen.getByRole("heading", { name: "Selected work" });

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
    await user.click(screen.getByRole("link", { name: /work/i }));

    await waitFor(() => expect(heading).toHaveFocus());
    expect(heading).toHaveAttribute("tabindex", "-1");

    heading.blur();
    expect(heading).not.toHaveAttribute("tabindex");
  });

  it("marks an exact non-fragment route as the current page", async () => {
    const user = userEvent.setup();
    render(<MobileMenuHarness activeSection={null} pathname="/resume" />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    expect(screen.getByRole("link", { name: /résumé/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
