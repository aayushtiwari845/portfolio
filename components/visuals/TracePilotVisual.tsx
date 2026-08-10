import styles from "./visuals.module.css";
import type { ProjectVisualProps } from "./types";
import { VisualSvg } from "./VisualSvg";

const evidenceRows = ["LOGS", "METRICS", "TRACES", "CHANGES"] as const;

export function TracePilotVisual(props: ProjectVisualProps) {
  return (
    <VisualSvg
      {...props}
      description="An incident alert is correlated across a service graph, logs, metrics, traces and deployment changes to produce ranked root-cause evidence."
      kindClassName={styles.tracepilot}
    >
      <g className={styles.microGrid}>
        <path d="M24 70H616M24 290H616" />
        <path d="M214 42V318M466 42V318" />
      </g>

      <text className={styles.eyebrow} x="28" y="35">
        INCIDENT / 0241
      </text>
      <g className={styles.liveStatus}>
        <circle cx="603" cy="31" r="3" />
        <text x="594" y="35" textAnchor="end">
          CORRELATING
        </text>
      </g>

      <text className={styles.panelLabel} x="29" y="84">
        SERVICE GRAPH
      </text>
      <g className={styles.serviceGraph}>
        <path d="M68 139L120 111L171 143L142 202L83 207L68 139ZM120 111L142 202M68 139L171 143M83 207L171 143" />
        <circle cx="68" cy="139" r="8" />
        <circle cx="120" cy="111" r="7" />
        <circle className={styles.alertNode} cx="171" cy="143" r="10" />
        <circle cx="142" cy="202" r="7" />
        <circle cx="83" cy="207" r="6" />
        <text x="171" y="169" textAnchor="middle">
          API-02
        </text>
      </g>

      <path className={styles.connector} d="M181 143H240" />
      <path className={styles.traceSignal} d="M181 143H240" />

      <g className={styles.evidencePanel}>
        <rect height="184" rx="8" width="204" x="240" y="90" />
        <text className={styles.panelLabel} x="256" y="114">
          EVIDENCE CORRELATION
        </text>
        {evidenceRows.map((label, index) => {
          const y = 136 + index * 31;
          return (
            <g className={styles.evidenceRow} key={label}>
              <circle cx="258" cy={y} r="3" />
              <text x="269" y={y + 3}>
                {label}
              </text>
              <rect height="4" rx="2" width={104 - index * 9} x="325" y={y - 3} />
              <path
                className={styles.evidenceSweep}
                d={`M325 ${y - 1}H${429 - index * 9}`}
                style={{ animationDelay: `${index * 130}ms` }}
              />
            </g>
          );
        })}
        <text className={styles.stageMeta} x="256" y="258">
          WINDOW / -05:00 → +02:00
        </text>
      </g>

      <path className={styles.connector} d="M444 182H480" />
      <path className={styles.traceSignal} d="M444 182H480" />

      <g className={styles.rankingPanel}>
        <text className={styles.panelLabel} x="480" y="96">
          RCA RANKING
        </text>
        <g>
          <text x="480" y="131">
            01 / API-02
          </text>
          <rect height="5" rx="2.5" width="116" x="480" y="141" />
          <rect className={styles.rankFill} height="5" rx="2.5" width="101" x="480" y="141" />
        </g>
        <g>
          <text x="480" y="177">
            02 / CACHE-01
          </text>
          <rect height="5" rx="2.5" width="116" x="480" y="187" />
          <rect className={styles.rankFillMuted} height="5" rx="2.5" width="58" x="480" y="187" />
        </g>
        <g>
          <text x="480" y="223">
            03 / DB-03
          </text>
          <rect height="5" rx="2.5" width="116" x="480" y="233" />
          <rect className={styles.rankFillMuted} height="5" rx="2.5" width="31" x="480" y="233" />
        </g>
        <text className={styles.evidenceCitation} x="480" y="267">
          07 CITED SIGNALS
        </text>
      </g>

      <g className={styles.metricRail}>
        <text x="28" y="326">
          TELEMETRY / OTel
        </text>
        <text x="612" y="326" textAnchor="end">
          DIAGNOSIS / EVIDENCE-BOUND
        </text>
      </g>
    </VisualSvg>
  );
}
