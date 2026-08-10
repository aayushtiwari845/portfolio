import styles from "./visuals.module.css";
import type { ProjectVisualProps } from "./types";
import { VisualSvg } from "./VisualSvg";

const stages = ["KAFKA", "SPARK", "FEATURE", "MODEL", "SCORE"] as const;

export function FraudPipelineVisual(props: ProjectVisualProps) {
  return (
    <VisualSvg
      {...props}
      description="Transactions flow through Kafka, Spark Structured Streaming, feature selection and inference, with one transaction elevated as a fraud signal."
      kindClassName={styles.fraud}
    >
      <g className={styles.microGrid}>
        <path d="M24 72H616M24 287H616" />
        <path d="M106 44V316M222 44V316M338 44V316M454 44V316M570 44V316" />
      </g>

      <text className={styles.eyebrow} x="28" y="35">
        STREAM / LIVE INFERENCE
      </text>
      <text className={styles.statusText} x="612" y="35" textAnchor="end">
        BATCH / 26.53 MS MEDIAN
      </text>

      <g className={styles.streamLane}>
        <path d="M31 179H609" />
        <path className={styles.streamFlow} d="M31 179H609" />
      </g>

      {stages.map((stage, index) => {
        const x = 60 + index * 116;
        return (
          <g className={styles.pipelineStage} key={stage}>
            <rect height="92" rx="7" width="84" x={x} y="133" />
            <text x={x + 42} y="169" textAnchor="middle">
              {stage}
            </text>
            <text className={styles.stageMeta} x={x + 42} y="190" textAnchor="middle">
              {index === 0 && "INGEST"}
              {index === 1 && "MICRO-BATCH"}
              {index === 2 && "30 → 3"}
              {index === 3 && "INFERENCE"}
              {index === 4 && "0—1"}
            </text>
            <circle cx={x + 42} cy="211" r="3" />
          </g>
        );
      })}

      <g className={styles.transactions}>
        {[0, 1, 2, 3, 4].map((index) => (
          <circle
            className={styles.transaction}
            cx="33"
            cy={165 + (index % 3) * 14}
            key={index}
            r="2.5"
            style={{ animationDelay: `${index * -430}ms` }}
          />
        ))}
        <circle className={styles.flaggedTransaction} cx="33" cy="179" r="4" />
      </g>

      <path className={styles.flagStem} d="M589 179v-51" />
      <g className={styles.flagBadge}>
        <rect height="24" rx="4" width="66" x="556" y="103" />
        <text x="589" y="119" textAnchor="middle">
          FLAGGED
        </text>
      </g>

      <g className={styles.metricBlock}>
        <text className={styles.metricValue} x="28" y="270">
          3,285 / S
        </text>
        <text className={styles.stageMeta} x="28" y="284">
          TRANSACTION THROUGHPUT
        </text>
      </g>
      <g className={styles.metricBlock}>
        <text className={styles.metricValue} x="612" y="270" textAnchor="end">
          99.2%
        </text>
        <text className={styles.stageMeta} x="612" y="284" textAnchor="end">
          FULL-FEATURE AUC PRESERVED
        </text>
      </g>

      <g className={styles.metricRail}>
        <text x="28" y="326">
          DATASET / 284K+
        </text>
        <text x="612" y="326" textAnchor="end">
          IMBALANCE / 577:1
        </text>
      </g>
    </VisualSvg>
  );
}
