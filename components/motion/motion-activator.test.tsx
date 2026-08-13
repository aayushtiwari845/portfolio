import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MotionActivator } from "./motion-activator";
import { Reveal } from "./reveal";

let intersectionCallback: IntersectionObserverCallback;

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly scrollMargin = "0px";
  readonly thresholds = [0.12];

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }
}

function emitIntersection(target: Element, isIntersecting: boolean) {
  intersectionCallback([
    {
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: target.getBoundingClientRect(),
      isIntersecting,
      rootBounds: null,
      target,
      time: 0,
    },
  ], {} as IntersectionObserver);
}

describe("portfolio motion activation", () => {
  beforeEach(() => {
    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      value: IntersectionObserverMock,
    });
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
    delete document.documentElement.dataset.motion;
  });

  it("keeps Reveal server-readable while exposing its delay hook", () => {
    const { getByText } = render(<Reveal delay={0.12}>Evidence</Reveal>);
    const reveal = getByText("Evidence");

    expect(reveal).toBeVisible();
    expect(reveal).toHaveAttribute("data-reveal", "true");
    expect(reveal).toHaveAttribute("data-motion-state", "pending");
    expect(reveal).toHaveStyle("--reveal-delay: 0.12s");
  });

  it("reveals content once and only runs an intersecting visual", async () => {
    document.body.innerHTML = `
      <div data-reveal="true" data-motion-state="pending">Section</div>
      <div data-motion-visual="true" data-motion-state="idle">Diagram</div>
    `;
    const reveal = document.querySelector<HTMLElement>("[data-reveal]")!;
    const visual = document.querySelector<HTMLElement>("[data-motion-visual]")!;

    render(<MotionActivator />);

    await waitFor(() => expect(document.documentElement).toHaveAttribute("data-motion", "on"));
    expect(reveal).toHaveAttribute("data-motion-state", "pending");
    expect(visual).toHaveAttribute("data-motion-state", "idle");

    emitIntersection(reveal, true);
    emitIntersection(visual, true);

    expect(reveal).toHaveAttribute("data-motion-state", "visible");
    expect(visual).toHaveAttribute("data-motion-state", "active");

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(visual).toHaveAttribute("data-motion-state", "idle");

    emitIntersection(visual, false);
    expect(visual).toHaveAttribute("data-motion-state", "idle");
  });
});
