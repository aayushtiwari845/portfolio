"use client";

import { useEffect, useRef, useState } from "react";
import { readMotionEnvironment } from "@/lib/motion";

/** A small CSS sculpture: no textures, canvas, or graphics runtime to download. */
export function CosmicAccent() {
  const container = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const environment = readMotionEnvironment();
    const updateMotion = () => {
      element.dataset.motion = environment.canAnimate() ? "on" : "off";
    };
    updateMotion();
    const unsubscribe = environment.subscribe(updateMotion);
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.visible = String(entry.isIntersecting);
    });
    observer.observe(element);
    const updateVisibility = () => {
      element.dataset.hidden = String(document.hidden);
    };
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      unsubscribe();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  return (
    <div className="cosmic-accent" data-paused={paused} data-visible="false" ref={container}>
      <div aria-hidden="true" className="cosmic-accent__universe">
        <span className="cosmic-accent__orbit cosmic-accent__orbit--outer" />
        <span className="cosmic-accent__orbit cosmic-accent__orbit--inner" />
        <span className="cosmic-accent__sphere" />
        <span className="cosmic-accent__satellite" />
        <span className="cosmic-accent__star cosmic-accent__star--one" />
        <span className="cosmic-accent__star cosmic-accent__star--two" />
        <span className="cosmic-accent__star cosmic-accent__star--three" />
      </div>
      <button
        aria-label={paused ? "Play background animation" : "Pause background animation"}
        aria-pressed={paused}
        className="cosmic-accent__pause"
        onClick={() => setPaused(!paused)}
        type="button"
      >
        {paused ? "Play motion" : "Pause motion"}
      </button>
    </div>
  );
}
