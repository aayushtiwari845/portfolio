import clsx from "clsx";

import styles from "./hero.module.css";

export interface HeroTopologyFallbackProps {
  active?: boolean;
  className?: string;
  decorative?: boolean;
  reducedMotion?: boolean;
}

const nodes = [
  [93, 350, 5], [152, 303, 7], [175, 390, 4], [229, 332, 5],
  [279, 414, 3.5], [254, 245, 4], [291, 160, 6], [350, 98, 4],
  [397, 165, 7], [337, 229, 4], [444, 245, 4], [485, 302, 5],
  [536, 242, 7], [592, 306, 4], [559, 377, 5], [470, 399, 3.5],
  [376, 355, 4], [329, 471, 4], [210, 474, 3],
] as const;

const edges = [
  [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5],
  [5, 6], [5, 9], [6, 7], [6, 8], [7, 8], [8, 9], [8, 10],
  [9, 10], [9, 16], [10, 11], [10, 12], [11, 12], [11, 15],
  [12, 13], [12, 14], [13, 14], [14, 15], [15, 16], [16, 17],
  [17, 18], [4, 18],
] as const;

export function HeroTopologyFallback({
  active = true,
  className,
  decorative = true,
  reducedMotion = false,
}: HeroTopologyFallbackProps) {
  return (
    <div
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "A connected topology joining systems, data and intelligence."}
      className={clsx(
        styles.fallback,
        reducedMotion && styles.isReduced,
        className,
      )}
      data-motion-state="idle"
      data-motion-visual={active && !reducedMotion ? "true" : undefined}
      role={decorative ? undefined : "img"}
    >
      <svg aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet" viewBox="0 0 700 560" xmlns="http://www.w3.org/2000/svg">
        <g className={styles.coordinateGrid}>
          <path d="M39 81H661M39 179H661M39 277H661M39 375H661M39 473H661" />
          <path d="M82 42V518M216 42V518M350 42V518M484 42V518M618 42V518" />
        </g>
        <g className={styles.orbitLines}>
          <path d="M74 382C119 246 247 110 359 87s238 55 278 197-63 226-221 226S96 479 74 382Z" />
          <path d="M142 404C208 334 221 185 341 146s236 50 225 174-119 158-219 139-145-31-205-55Z" />
        </g>
        <g className={styles.topologyEdges}>
          {edges.map(([from, to]) => (
            <line key={`${from}-${to}`} x1={nodes[from][0]} x2={nodes[to][0]} y1={nodes[from][1]} y2={nodes[to][1]} />
          ))}
        </g>
        <g className={styles.signalEdges}>
          <path d="M93 350L152 303L229 332L254 245L291 160L397 165L444 245L536 242L592 306" />
          <path d="M175 390L279 414L210 474L329 471L376 355L470 399L559 377" />
          <path d="M350 98L397 165L337 229L376 355L485 302L536 242" />
        </g>
        <g className={styles.topologyNodes}>
          {nodes.map(([cx, cy, radius], index) => (
            <g className={index === 1 || index === 8 || index === 12 ? styles.hubNode : undefined} key={`${cx}-${cy}`}>
              <circle className={styles.nodeHalo} cx={cx} cy={cy} r={radius + 8} />
              <circle className={styles.nodeCore} cx={cx} cy={cy} r={radius} />
            </g>
          ))}
        </g>
        <g className={styles.regionLabel} transform="translate(54 455)">
          <text>REGION / 01</text><text className={styles.regionName} y="20">SYSTEMS</text><path d="M0 30H77" />
        </g>
        <g className={styles.regionLabel} transform="translate(295 48)">
          <text>REGION / 02</text><text className={styles.regionName} y="20">DATA</text><path d="M0 30H62" />
        </g>
        <g className={styles.regionLabel} transform="translate(541 449)">
          <text>REGION / 03</text><text className={styles.regionName} y="20">INTELLIGENCE</text><path d="M0 30H105" />
        </g>
        <g className={styles.telemetryLabel} transform="translate(479 77)">
          <rect height="27" rx="4" width="145" /><circle cx="13" cy="13.5" r="3" /><text x="24" y="17">SIGNAL / NOMINAL</text>
        </g>
        <text className={styles.coordinateLabel} x="42" y="35">TOPOLOGY / 00-A</text>
        <text className={styles.coordinateLabel} x="658" y="528" textAnchor="end">19 NODES / 28 LINKS</text>
      </svg>
    </div>
  );
}
