"use client";

import { useEffect, useRef } from "react";
import { getDocumentView, VIEW_CHANGE_EVENT } from "@/components/orrery/mode";
import { readMotionEnvironment } from "@/lib/motion";

const chapters = ["main-content", "experience", "work", "capabilities", "background", "contact"];

/** Decorative vector field, driven by reading position rather than a timer. */
export function DocumentBackdrop() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const environment = readMotionEnvironment();
    let frame = 0;
    let disposed = false;
    let stops: { id: string; top: number }[] = [];
    let range = 1;

    const enabled = () => getDocumentView() === "document"
      && !document.hidden && environment.canAnimate();

    const update = () => {
      frame = 0;
      if (disposed || !enabled()) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / range));
      const readingLine = window.scrollY + window.innerHeight * 0.4;
      const chapter = stops.filter((stop) => stop.top <= readingLine).at(-1)?.id ?? chapters[0];
      field.style.setProperty("--document-progress", progress.toFixed(4));
      field.dataset.progress = progress.toFixed(4);
      field.dataset.scene = chapter;
    };

    const schedule = () => {
      if (!frame && enabled()) frame = window.requestAnimationFrame(update);
    };

    const measure = () => {
      if (disposed) return;
      stops = chapters.flatMap((id) => {
        const node = document.getElementById(id);
        return node ? [{ id, top: node.getBoundingClientRect().top + window.scrollY }] : [];
      });
      range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      schedule();
    };

    const preferencesChanged = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      field.dataset.animated = environment.canAnimate() ? "true" : "false";
      if (!environment.canAnimate()) {
        field.style.setProperty("--document-progress", "0");
        field.dataset.progress = "0";
        field.dataset.scene = chapters[0];
      } else measure();
    };
    const unsubscribe = environment.subscribe(preferencesChanged);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener(VIEW_CHANGE_EVENT, preferencesChanged);
    document.addEventListener("visibilitychange", preferencesChanged);
    void document.fonts?.ready.then(() => { if (!disposed) measure(); });
    preferencesChanged();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      unsubscribe();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.removeEventListener(VIEW_CHANGE_EVENT, preferencesChanged);
      document.removeEventListener("visibilitychange", preferencesChanged);
    };
  }, []);

  return (
    <div aria-hidden="true" className="document-backdrop" data-progress="0" data-scene="main-content" ref={fieldRef}>
      <svg className="document-backdrop__drawing" viewBox="0 0 1440 1000" fill="none" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="document-field-ink" x1="760" y1="100" x2="1400" y2="900" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--field-color)" />
            <stop offset="1" stopColor="var(--field-color-secondary)" />
          </linearGradient>
        </defs>
        <g className="document-backdrop__terrain" stroke="url(#document-field-ink)" strokeWidth="1">
          {Array.from({ length: 13 }, (_, index) => (
            <path key={index} d={`M ${690 + index * 32} 780 L ${1000 + index * 42} 230 L ${1450 + index * 30} 500`} />
          ))}
          {Array.from({ length: 10 }, (_, index) => (
            <path key={index} d={`M ${700 + index * 25} ${775 - index * 43} L ${1400 + index * 12} ${935 - index * 57}`} />
          ))}
        </g>
        <g className="document-backdrop__prism" stroke="url(#document-field-ink)" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M 1030 120 1290 265 1290 565 1030 720 770 565 770 265 Z" />
          <path d="M 770 265 1030 415 1290 265 M 1030 415 V 720 M 1030 120 V 415" />
          <path d="M 835 303 1030 191 1225 303 1225 528 1030 641 835 528 Z" />
          <path d="M 835 303 1030 416 1225 303 M 1030 416 V 641" />
          <path d="M 900 340 1030 265 1160 340 1160 490 1030 565 900 490 Z" />
          <path d="M 900 340 1030 415 1160 340 M 1030 415 V 565" />
          <path d="M 770 565 1030 415 1290 565" strokeDasharray="4 10" />
        </g>
        <g className="document-backdrop__planes" stroke="url(#document-field-ink)" strokeWidth="1.2" strokeLinejoin="round">
          {[0, 1, 2, 3, 4].map((index) => (
            <path key={index} d="m 820 400 260-150 260 150-260 150Z" transform={`translate(0 ${index * 62})`} />
          ))}
          <path d="M 820 400 V 648 M 1080 250 V 498 M 1340 400 V 648 M 1080 550 V 798" strokeDasharray="3 9" />
        </g>
        <g className="document-backdrop__connections" stroke="url(#document-field-ink)" strokeWidth="1.4" strokeLinecap="round">
          <path d="M 780 220 H 930 L 1060 350 H 1230 L 1350 470 V 720" />
          <path d="M 780 420 H 900 L 1030 550 H 1200 L 1340 690" />
          <path d="M 850 760 V 650 L 980 520 V 270 L 1110 140" />
          <path d="M 1020 790 V 700 L 1160 560 V 370 L 1280 250" />
          {[[780, 220], [1060, 350], [1230, 350], [1350, 720], [900, 420], [1030, 550], [850, 760], [980, 270], [1160, 560], [1280, 250]].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x - 4} y={y - 4} width="8" height="8" rx="2" />
          ))}
        </g>
      </svg>
    </div>
  );
}
