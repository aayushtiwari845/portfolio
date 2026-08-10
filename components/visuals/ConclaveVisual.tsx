import styles from "./visuals.module.css";
import type { ProjectVisualProps } from "./types";
import { VisualSvg } from "./VisualSvg";

const FLOW_PATH =
  "M95 180H160M244 180H270M370 180H420M506 180H556";

export function ConclaveVisual(props: ProjectVisualProps) {
  return (
    <VisualSvg
      {...props}
      description="Four specialised analysis agents receive engineered fund data and converge on a deterministic consensus."
      kindClassName={styles.conclave}
    >
      <g className={styles.microGrid}>
        <path d="M24 62H616M24 124H616M24 236H616M24 298H616" />
        <path d="M96 34V326M224 34V326M416 34V326M544 34V326" />
      </g>

      <text className={styles.eyebrow} x="28" y="34">
        SYS / MULTI-AGENT CONSENSUS
      </text>
      <text className={styles.statusText} x="612" y="34" textAnchor="end">
        04 AGENTS / ACTIVE
      </text>

      <g className={styles.stage}>
        <rect height="76" rx="7" width="68" x="28" y="142" />
        <text x="62" y="170" textAnchor="middle">
          DATA
        </text>
        <text className={styles.stageMeta} x="62" y="187" textAnchor="middle">
          AMFI / RBI
        </text>
        <text className={styles.stageMeta} x="62" y="201" textAnchor="middle">
          MFAPI
        </text>
      </g>

      <g className={styles.stage}>
        <rect height="76" rx="7" width="84" x="160" y="142" />
        <text x="202" y="170" textAnchor="middle">
          FEATURE
        </text>
        <text x="202" y="184" textAnchor="middle">
          ENGINE
        </text>
        <text className={styles.stageMeta} x="202" y="202" textAnchor="middle">
          20+ METRICS
        </text>
      </g>

      <g className={styles.agentBank}>
        {[0, 1, 2, 3].map((index) => {
          const y = 104 + index * 51;
          return (
            <g className={styles.agent} key={index}>
              <rect height="38" rx="5" width="100" x="270" y={y} />
              <circle cx="285" cy={y + 19} r="3" />
              <text x="298" y={y + 17}>
                AGENT {String(index + 1).padStart(2, "0")}
              </text>
              <text className={styles.stageMeta} x="298" y={y + 29}>
                SPECIALIST
              </text>
            </g>
          );
        })}
      </g>

      <g className={styles.stage}>
        <rect height="76" rx="7" width="86" x="420" y="142" />
        <text x="463" y="171" textAnchor="middle">
          CONSENSUS
        </text>
        <text className={styles.stageMeta} x="463" y="190" textAnchor="middle">
          RANK + FALLBACK
        </text>
        <circle className={styles.consensusCore} cx="463" cy="207" r="4" />
      </g>

      <g className={styles.outputStage}>
        <rect height="76" rx="7" width="58" x="556" y="142" />
        <text x="585" y="170" textAnchor="middle">
          EVAL
        </text>
        <path d="M570 198l8-8 7 5 13-15" />
        <circle cx="598" cy="180" r="2.5" />
      </g>

      <path className={styles.connector} d={FLOW_PATH} />
      <path className={styles.flowLine} d={FLOW_PATH} />
      <path className={styles.connector} d="M270 123H256V237H270M370 123H384V237H370" />
      <path className={styles.flowLineSlow} d="M270 123H256V237H270M370 123H384V237H370" />

      <g className={styles.metricRail}>
        <text x="28" y="325">
          PROVIDERS / GEMINI + OLLAMA
        </text>
        <text x="612" y="325" textAnchor="end">
          OUTPUT / AUDITABLE RANKING
        </text>
      </g>
    </VisualSvg>
  );
}
