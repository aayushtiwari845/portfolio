import styles from "./visuals.module.css";
import type { ProjectVisualProps } from "./types";
import { VisualSvg } from "./VisualSvg";

const evidenceRows = ["LOGS", "METRICS", "TRACES", "CHANGES"] as const;

export function TracePilotVisual(props: ProjectVisualProps) {
  return (
    <VisualSvg
      {...props}
      compactChildren={<TracePilotCompact />}
      description="A service alert becomes an incident, gathers logs, metrics, traces and change evidence, ranks likely root causes and produces an evidence-cited diagnosis."
      kindClassName={styles.tracepilot}
    >
      <g className={styles.microGrid}>
        <path d="M20 52H620M20 310H620" />
        <path d="M150 38V326M264 38V326M462 38V326" />
      </g>
      <text className={styles.eyebrow} x="24" y="30">TRACEPILOT / INCIDENT 0241</text>
      <g className={styles.liveStatus}>
        <circle cx="604" cy="26" r="3" />
        <text x="594" y="30" textAnchor="end">CORRELATING</text>
      </g>

      <g className={styles.servicePanel}>
        <rect height="196" rx="7" width="116" x="24" y="76" />
        <text className={styles.panelLabel} x="40" y="98">SERVICE GRAPH</text>
        <path d="M45 144L78 116L116 142L104 202L61 219L45 144ZM78 116L104 202M45 144L116 142M61 219L116 142" />
        <circle cx="45" cy="144" r="6" />
        <circle cx="78" cy="116" r="6" />
        <circle className={styles.alertNode} cx="116" cy="142" r="8" />
        <circle cx="104" cy="202" r="6" />
        <circle cx="61" cy="219" r="5" />
        <text className={styles.stageMeta} x="40" y="251">ALERT / API-02</text>
      </g>

      <path className={styles.connector} d="M124 142H162" />
      <path className={styles.traceSignal} d="M124 142H162" />
      <g className={styles.decisionBox}>
        <rect height="70" rx="7" width="88" x="162" y="107" />
        <text className={styles.stageLabel} x="206" y="135" textAnchor="middle">INCIDENT</text>
        <text className={styles.stageMeta} x="206" y="154" textAnchor="middle">WINDOW + SCOPE</text>
      </g>

      <path className={styles.connector} d="M250 142H276" />
      <path className={styles.traceSignal} d="M250 142H276" />
      <g className={styles.evidencePanel}>
        <rect height="224" rx="7" width="174" x="276" y="66" />
        <text className={styles.panelLabel} x="292" y="89">EVIDENCE INPUTS</text>
        {evidenceRows.map((label, index) => {
          const y = 112 + index * 30;
          return (
            <g className={styles.evidenceRow} key={label}>
              <rect height="22" rx="4" width="104" x="292" y={y - 14} />
              <circle cx="304" cy={y - 3} r="3" />
              <text x="316" y={y}>{label}</text>
              <path className={styles.connector} d={`M396 ${y - 3}H430`} />
              <path className={styles.evidenceSweep} d={`M396 ${y - 3}H430`} style={{ animationDelay: `${index * 140}ms` }} />
            </g>
          );
        })}
        <path className={styles.connector} d="M430 109V199M430 199V220H292" />
        <g className={styles.correlationCell}>
          <rect height="42" rx="5" width="142" x="292" y="220" />
          <text className={styles.stageLabel} x="308" y="239">CORRELATE</text>
          <text className={styles.stageMeta} x="308" y="253">TIME + TOPOLOGY</text>
        </g>
      </g>

      <path className={styles.connector} d="M450 241H462V134H474M545 170V214" />
      <path className={styles.traceSignal} d="M450 241H462V134H474M545 170V214" />
      <g className={styles.rankingBox}>
        <rect height="72" rx="7" width="142" x="474" y="98" />
        <text className={styles.panelLabel} x="490" y="119">RCA RANKING</text>
        <text className={styles.stageLabel} x="490" y="142">01 / API-02</text>
        <rect height="5" rx="2.5" width="108" x="490" y="151" />
        <rect className={styles.rankFill} height="5" rx="2.5" width="92" x="490" y="151" />
      </g>
      <g className={styles.outputBox}>
        <rect height="76" rx="7" width="142" x="474" y="214" />
        <text className={styles.stageLabel} x="490" y="239">DIAGNOSIS</text>
        <text className={styles.stageMeta} x="490" y="258">EVIDENCE-CITED</text>
        <text className={styles.evidenceCitation} x="490" y="276">07 SIGNALS LINKED</text>
      </g>

      <g className={styles.metricRail}>
        <text x="24" y="332">TELEMETRY / OTel</text>
        <text x="320" y="332" textAnchor="middle">LOGS · METRICS · TRACES · CHANGES</text>
        <text x="616" y="332" textAnchor="end">OUTPUT / AUDITABLE</text>
      </g>
    </VisualSvg>
  );
}

function TracePilotCompact() {
  return (
    <>
      <text className={styles.compactEyebrow} x="20" y="26">TRACEPILOT / INCIDENT PATH</text>
      <g className={styles.compactServiceGraph}>
        <rect height="54" rx="7" width="300" x="20" y="40" />
        <text x="38" y="63">SERVICE GRAPH</text>
        <text className={styles.compactMeta} x="38" y="80">ALERT / API-02</text>
        <path d="M246 67L272 52L300 68L274 82Z" />
        <circle className={styles.alertNode} cx="300" cy="68" r="6" />
      </g>
      <path className={styles.compactConnector} d="M170 94V108" />
      <g className={styles.compactDecision}>
        <rect height="42" rx="6" width="300" x="20" y="108" />
        <text x="38" y="134">INCIDENT</text>
        <text className={styles.compactMeta} x="302" y="134" textAnchor="end">WINDOW + SCOPE</text>
      </g>

      <g className={styles.compactEvidence}>
        <rect height="142" rx="7" width="300" x="20" y="166" />
        <text className={styles.compactGroupLabel} x="38" y="188">CORRELATE EVIDENCE</text>
        {evidenceRows.map((label, index) => {
          const x = index % 2 === 0 ? 38 : 176;
          const y = index < 2 ? 204 : 244;
          return (
            <g className={styles.compactEvidenceItem} key={label}>
              <rect height="30" rx="5" width="126" x={x} y={y} />
              <circle cx={x + 14} cy={y + 15} r="3" />
              <text x={x + 27} y={y + 20}>{label}</text>
            </g>
          );
        })}
        <path className={styles.compactConnector} d="M101 234V285H239V274M170 285V308" />
      </g>
      <path className={styles.compactSignal} d="M170 94V108M170 150V166M101 234V285H239V274M170 285V322" />

      <g className={styles.compactDecision}>
        <rect height="46" rx="6" width="300" x="20" y="322" />
        <text x="38" y="350">RCA RANKING</text>
        <text className={styles.compactMeta} x="302" y="350" textAnchor="end">01 / API-02</text>
      </g>
      <path className={styles.compactConnector} d="M170 368V382" />
      <g className={styles.compactOutput}>
        <rect height="56" rx="6" width="300" x="20" y="382" />
        <text x="38" y="408">EVIDENCE-CITED DIAGNOSIS</text>
        <text className={styles.compactMeta} x="38" y="425">07 LINKED SIGNALS / AUDITABLE</text>
      </g>
      <text className={styles.compactFooter} x="170" y="468" textAnchor="middle">OTel · TIME WINDOW · SERVICE TOPOLOGY</text>
    </>
  );
}
