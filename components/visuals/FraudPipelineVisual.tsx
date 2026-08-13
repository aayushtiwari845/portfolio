import styles from "./visuals.module.css";
import type { ProjectVisualProps } from "./types";
import { VisualSvg } from "./VisualSvg";

const stages = [
  { label: "TRANSACTIONS", meta: "284K+ DATASET" },
  { label: "KAFKA", meta: "INGEST" },
  { label: "SPARK", meta: "MICRO-BATCH" },
  { label: "FEATURES", meta: "30 → 3" },
  { label: "MODEL", meta: "INFERENCE" },
  { label: "FRAUD SCORE", meta: "FLAG / PASS" },
] as const;

export function FraudPipelineVisual(props: ProjectVisualProps) {
  return (
    <VisualSvg
      {...props}
      compactChildren={<FraudCompact />}
      description="A transaction stream passes through Kafka, Spark Structured Streaming, compact feature selection and model inference before producing a fraud score."
      kindClassName={styles.fraud}
    >
      <g className={styles.microGrid}>
        <path d="M20 52H620M20 308H620" />
        <path d="M120 38V324M220 38V324M320 38V324M420 38V324M520 38V324" />
      </g>

      <text className={styles.eyebrow} x="24" y="30">STREAM / BENCHMARK PATH</text>
      <text className={styles.statusText} x="616" y="30" textAnchor="end">KAFKA → SPARK → INFERENCE</text>

      <g className={styles.fraudMetrics}>
        <rect height="48" rx="6" width="592" x="24" y="66" />
        <text className={styles.metricValueSmall} x="42" y="88">3,285/s</text>
        <text className={styles.stageMeta} x="42" y="103">THROUGHPUT</text>
        <path d="M212 76V104M408 76V104" />
        <text className={styles.metricValueSmall} x="232" y="88">26.53 ms</text>
        <text className={styles.stageMeta} x="232" y="103">MEDIAN BATCH</text>
        <text className={styles.metricValueSmall} x="428" y="88">99.2%</text>
        <text className={styles.stageMeta} x="428" y="103">AUC RETAINED</text>
      </g>

      <path className={styles.pipelineRail} d="M56 180H584" />
      <path className={styles.streamFlow} d="M56 180H584" />

      {stages.map((stage, index) => {
        const x = 24 + index * 100;
        return (
          <g className={index === stages.length - 1 ? styles.outputBox : styles.pipelineStage} key={stage.label}>
            <rect height="62" rx="6" width="84" x={x} y="149" />
            <text className={styles.stageLabel} x={x + 42} y="174" textAnchor="middle">{stage.label}</text>
            <text className={styles.stageMeta} x={x + 42} y="195" textAnchor="middle">{stage.meta}</text>
            <circle cx={x + 42} cy="211" r="3" />
          </g>
        );
      })}

      <g className={styles.transactions}>
        {[0, 1, 2, 3].map((index) => (
          <circle
            className={styles.transaction}
            cx="34"
            cy="180"
            key={index}
            r="3"
            style={{ animationDelay: `${index * -620}ms` }}
          />
        ))}
        <circle className={styles.flaggedTransaction} cx="34" cy="180" r="4" />
      </g>

      <g className={styles.fraudOutcome}>
        <path d="M566 221V246" />
        <rect height="26" rx="5" width="100" x="516" y="246" />
        <text x="566" y="263" textAnchor="middle">FLAGGED EVENT</text>
      </g>

      <g className={styles.metricRail}>
        <text x="24" y="294">CLASS IMBALANCE / 577:1</text>
        <text x="320" y="294" textAnchor="middle">FEATURES / 30 → 3</text>
        <text x="616" y="294" textAnchor="end">INFERENCE LATENCY / ~30% LOWER</text>
      </g>
      <text className={styles.captionText} x="24" y="330">MEASURED ON THE PROJECT DATASET / COLLABORATIVE REPOSITORY</text>
    </VisualSvg>
  );
}

function FraudCompact() {
  return (
    <>
      <text className={styles.compactEyebrow} x="20" y="26">FRAUD / STREAMING PATH</text>

      <g className={styles.compactMetricStrip}>
        <rect height="48" rx="6" width="300" x="20" y="40" />
        <text x="38" y="61">3,285/s</text>
        <text className={styles.compactMeta} x="38" y="77">THROUGHPUT</text>
        <path d="M170 50V78" />
        <text x="188" y="61">26.53 ms</text>
        <text className={styles.compactMeta} x="188" y="77">MEDIAN BATCH</text>
      </g>

      <path className={styles.compactConnector} d="M42 111V387" />
      <path className={styles.compactSignal} d="M42 111V387" />
      {stages.map((stage, index) => {
        const y = 102 + index * 49;
        const Box = index === stages.length - 1 ? styles.compactOutput : styles.compactStage;
        return (
          <g className={Box} key={stage.label}>
            <circle cx="42" cy={y + 18} r="5" />
            <rect height="36" rx="6" width="250" x="60" y={y} />
            <text x="76" y={y + 23}>{stage.label}</text>
            <text className={styles.compactMeta} x="294" y={y + 23} textAnchor="end">{stage.meta}</text>
          </g>
        );
      })}

      <g className={styles.compactStatRow}>
        <text x="20" y="422">99.2% AUC RETAINED</text>
        <text x="320" y="422" textAnchor="end">~30% LOWER LATENCY</text>
      </g>
      <g className={styles.compactFooter}>
        <text x="20" y="454">284K+ TRANSACTIONS</text>
        <text x="320" y="454" textAnchor="end">IMBALANCE / 577:1</text>
      </g>
    </>
  );
}
