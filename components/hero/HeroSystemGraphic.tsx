"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import clsx from "clsx";

import { HeroTopologyFallback } from "./HeroTopologyFallback";
import type { HeroSceneProps } from "./HeroScene";
import styles from "./hero.module.css";

type ConnectionHints = {
  saveData?: boolean;
};

type NavigatorWithHints = Navigator & {
  connection?: ConnectionHints;
  deviceMemory?: number;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", {
      failIfMajorPerformanceCaveat: true,
    });

    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function canEnhanceWithWebGL() {
  const navigatorWithHints = navigator as NavigatorWithHints;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const hasRoom = window.matchMedia("(min-width: 900px)").matches;
  const wantsLessMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const conservesData = navigatorWithHints.connection?.saveData === true;
  const lowMemory =
    typeof navigatorWithHints.deviceMemory === "number" &&
    navigatorWithHints.deviceMemory < 4;
  const lowConcurrency =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency < 4;

  return (
    hasFinePointer &&
    hasRoom &&
    !wantsLessMotion &&
    !conservesData &&
    !lowMemory &&
    !lowConcurrency &&
    supportsWebGL()
  );
}

export interface HeroSystemGraphicProps {
  className?: string;
  reducedMotion?: boolean;
}

export function HeroSystemGraphic({
  className,
  reducedMotion = false,
}: HeroSystemGraphicProps) {
  const [Scene, setScene] =
    useState<ComponentType<HeroSceneProps> | null>(null);
  const [eligible, setEligible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reducedMotion || failed) return;

    const pointerQuery = window.matchMedia("(pointer: fine)");
    const widthQuery = window.matchMedia("(min-width: 900px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let evaluationFrame = 0;
    const evaluate = () => {
      window.cancelAnimationFrame(evaluationFrame);
      evaluationFrame = window.requestAnimationFrame(() => {
        setEligible(canEnhanceWithWebGL());
      });
    };

    evaluate();
    pointerQuery.addEventListener("change", evaluate);
    widthQuery.addEventListener("change", evaluate);
    motionQuery.addEventListener("change", evaluate);

    return () => {
      window.cancelAnimationFrame(evaluationFrame);
      pointerQuery.removeEventListener("change", evaluate);
      widthQuery.removeEventListener("change", evaluate);
      motionQuery.removeEventListener("change", evaluate);
    };
  }, [failed, reducedMotion]);

  const sceneAllowed = eligible && !reducedMotion && !failed;
  const sceneVisible = sceneAllowed && ready;

  useEffect(() => {
    if (!sceneAllowed || Scene) return;

    let cancelled = false;
    let timeoutHandle = 0;
    let idleHandle = 0;

    const loadScene = () => {
      void import("./HeroScene")
        .then((module) => {
          if (!cancelled) setScene(() => module.HeroScene);
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    };

    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(loadScene, { timeout: 1400 });
    } else {
      timeoutHandle = window.setTimeout(loadScene, 500);
    }

    return () => {
      cancelled = true;
      if (idleHandle && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle) window.clearTimeout(timeoutHandle);
    };
  }, [Scene, sceneAllowed]);

  const handleFailure = () => {
    setReady(false);
    setFailed(true);
  };

  return (
    <div
      className={clsx(
        styles.systemGraphic,
        sceneVisible && styles.hasScene,
        className,
      )}
    >
      <div className={styles.fallbackLayer}>
        <HeroTopologyFallback
          active={!sceneVisible}
          reducedMotion={reducedMotion}
        />
      </div>
      <div className={styles.sceneLayer}>
        {sceneAllowed && Scene ? (
          <Scene
            active
            onContextLost={handleFailure}
            onReady={() => setReady(true)}
            reducedMotion={reducedMotion}
          />
        ) : null}
      </div>
    </div>
  );
}
