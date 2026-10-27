import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MotionActivator } from "./motion-activator";
import { Reveal } from "./reveal";

let intersectionCallback: IntersectionObserverCallback;
let observerOptions: IntersectionObserverInit | undefined;
const observerInstances: IntersectionObserverMock[] = [];

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly scrollMargin = "0px";
  readonly thresholds = [0];

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    intersectionCallback = callback;
    observerOptions = options;
    observerInstances.push(this);
  }
}

function emitIntersection(target: Element, isIntersecting: boolean, ratio = 1) {
  intersectionCallback([
    {
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio: isIntersecting ? ratio : 0,
      intersectionRect: target.getBoundingClientRect(),
      isIntersecting,
      rootBounds: null,
      target,
      time: 0,
    },
  ], {} as IntersectionObserver);
}

function documentBounds(element: Element, top: number, height = 300) {
  return vi.spyOn(element, "getBoundingClientRect").mockImplementation(() => ({
    top: top - window.scrollY,
    bottom: top + height - window.scrollY,
    left: 0, right: 400, width: 400, height, x: 0, y: top - window.scrollY,
    toJSON: () => ({}),
  }));
}

describe("portfolio motion activation", () => {
  beforeEach(() => {
    observerInstances.length = 0;
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0, writable: true });
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
    vi.restoreAllMocks();
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

  it("reveals a tall card at its first intersection instead of waiting for a percentage", () => {
    document.body.innerHTML = '<article data-reveal="true">Tall project</article>';
    const card = document.querySelector<HTMLElement>("article")!;
    documentBounds(card, window.innerHeight + 140, 2400);
    render(<MotionActivator />);
    expect(card).toHaveAttribute("data-motion-state", "pending");
    expect(observerOptions).toMatchObject({ rootMargin: "80px 0px 80px 0px", threshold: 0 });
    emitIntersection(card, true, 0.001);
    expect(card).toHaveAttribute("data-motion-state", "visible");
    expect(observerInstances.at(-1)!.unobserve).toHaveBeenCalledWith(card);
    emitIntersection(card, false);
    expect(card).toHaveAttribute("data-motion-state", "visible");
  });

  it("uses cached positions while scrolling and reveals content skipped by a fast scroll", async () => {
    document.body.innerHTML = '<div data-reveal="true" id="first">First</div><div data-reveal="true" id="later">Later</div>';
    const first = document.getElementById("first")!;
    const later = document.getElementById("later")!;
    const firstBounds = documentBounds(first, 2000);
    const laterBounds = documentBounds(later, 6000);
    render(<MotionActivator />);
    const initialReads = firstBounds.mock.calls.length + laterBounds.mock.calls.length;
    expect(first).toHaveAttribute("data-motion-state", "pending");
    Object.defineProperty(window, "scrollY", { value: 1900, writable: true });
    fireEvent.scroll(window);
    await waitFor(() => expect(first).toHaveAttribute("data-motion-state", "visible"));
    expect(later).toHaveAttribute("data-motion-state", "pending");
    expect(firstBounds.mock.calls.length + laterBounds.mock.calls.length).toBe(initialReads);
    Object.defineProperty(window, "scrollY", { value: 8000, writable: true });
    fireEvent.scroll(window);
    await waitFor(() => expect(later).toHaveAttribute("data-motion-state", "visible"));
    expect(firstBounds.mock.calls.length + laterBounds.mock.calls.length).toBe(initialReads);
  });

  it("reveals focused controls and all containing reveal panels immediately", () => {
    document.body.innerHTML = '<div data-reveal="true" id="outer"><div data-reveal="true" id="inner"><button>Open case study</button></div></div>';
    render(<MotionActivator />);
    fireEvent.focusIn(document.querySelector("button")!);
    for (const id of ["outer", "inner"]) {
      expect(document.getElementById(id)).toHaveAttribute("data-motion-state", "visible");
      expect(document.getElementById(id)).toHaveAttribute("data-motion-immediate", "true");
    }
  });

  it("makes newly opened disclosure content readable immediately", () => {
    document.body.innerHTML = '<details data-reveal="true"><summary>Architecture</summary><div data-reveal="true" id="diagram">Diagram explanation</div></details>';
    render(<MotionActivator />);
    const disclosure = document.querySelector("details")!;
    disclosure.open = true;
    fireEvent(disclosure, new Event("toggle"));
    expect(disclosure).toHaveAttribute("data-motion-state", "visible");
    expect(document.getElementById("diagram")).toHaveAttribute("data-motion-state", "visible");
    expect(document.getElementById("diagram")).toHaveAttribute("data-motion-immediate", "true");
  });

  it("rebuilds the position cache after an anchor jump and reveals skipped sections", async () => {
    document.body.innerHTML = '<div data-reveal="true" id="before">Earlier</div><div data-reveal="true" id="destination">Destination</div>';
    const before = document.getElementById("before")!;
    const destination = document.getElementById("destination")!;
    documentBounds(before, 1500);
    documentBounds(destination, 5000);
    render(<MotionActivator />);
    Object.defineProperty(window, "scrollY", { value: 5000, writable: true });
    fireEvent(window, new Event("hashchange"));
    await waitFor(() => expect(destination).toHaveAttribute("data-motion-state", "visible"));
    expect(before).toHaveAttribute("data-motion-state", "visible");
  });

  it("keeps all content readable when reduced motion is requested", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)", media: query,
      onchange: null, addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: () => false,
    }));
    document.body.innerHTML = '<div data-reveal="true">A future section</div>';
    const content = document.querySelector<HTMLElement>("[data-reveal]")!;
    documentBounds(content, 6000);
    render(<MotionActivator />);
    expect(document.documentElement).toHaveAttribute("data-motion", "off");
    expect(content).toHaveAttribute("data-motion-state", "visible");
  });

  it("unregisters targets removed by client navigation", async () => {
    document.body.innerHTML = '<div data-reveal="true" id="old-page">Old page</div>';
    const old = document.getElementById("old-page")!;
    render(<MotionActivator />);
    old.remove();
    await waitFor(() => expect(observerInstances.at(-1)!.unobserve).toHaveBeenCalledWith(old));
  });
});
