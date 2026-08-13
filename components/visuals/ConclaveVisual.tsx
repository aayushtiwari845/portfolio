import styles from "./visuals.module.css";
import type { ProjectVisualProps } from "./types";
import { VisualSvg } from "./VisualSvg";

const agents = ["AGENT 01", "AGENT 02", "AGENT 03", "AGENT 04"] as const;

export function ConclaveVisual(props: ProjectVisualProps) {
  return (
    <VisualSvg
      {...props}
      compactChildren={<ConclaveCompact />}
      description="Public fund data passes through ingestion and feature engineering, fans out to four specialised agents, then rejoins for deterministic consensus, evaluation and a dashboard."
      kindClassName={styles.conclave}
    >
      <g className={styles.microGrid}>
        <path d="M20 54H620M20 306H620" />
        <path d="M104 38V322M190 38V322M286 38V322M458 38V322" />
      </g>

      <text className={styles.eyebrow} x="24" y="30">
        CONCLAVE / DECISION PATH
      </text>
      <text className={styles.statusText} x="616" y="30" textAnchor="end">
        04 AGENTS / DETERMINISTIC JOIN
      </text>

      <g className={styles.stageBox}>
        <rect height="76" rx="6" width="72" x="24" y="142" />
        <text className={styles.stageLabel} x="60" y="164" textAnchor="middle">
          SOURCES
        </text>
        <text className={styles.stageMeta} x="60" y="182" textAnchor="middle">
          AMFI / MFAPI
        </text>
        <text className={styles.stageMeta} x="60" y="197" textAnchor="middle">
          RBI / MARKET
        </text>
      </g>

      <g className={styles.stageBox}>
        <rect height="60" rx="6" width="70" x="112" y="150" />
        <text className={styles.stageLabel} x="147" y="176" textAnchor="middle">
          INGESTION
        </text>
        <text className={styles.stageMeta} x="147" y="194" textAnchor="middle">
          NORMALISE
        </text>
      </g>

      <g className={styles.stageBox}>
        <rect height="60" rx="6" width="78" x="198" y="150" />
        <text className={styles.stageLabel} x="237" y="174" textAnchor="middle">
          FEATURES
        </text>
        <text className={styles.stageMeta} x="237" y="194" textAnchor="middle">
          20+ METRICS
        </text>
      </g>

      <path className={styles.connector} d="M96 180H112M182 180H198M276 180H298M298 90V270" />
      <path className={styles.signalPath} d="M96 180H112M182 180H198M276 180H298M298 90V270" />

      <g className={styles.agentBank}>
        {agents.map((agent, index) => {
          const centerY = 90 + index * 60;
          return (
            <g className={styles.agent} key={agent}>
              <path className={styles.connector} d={`M298 ${centerY}H316M428 ${centerY}H448`} />
              <path className={styles.branchSignal} d={`M298 ${centerY}H316M428 ${centerY}H448`} />
              <rect height="42" rx="5" width="112" x="316" y={centerY - 21} />
              <circle cx="331" cy={centerY} r="3" />
              <text className={styles.stageLabel} x="342" y={centerY + 3}>
                {agent}
              </text>
            </g>
          );
        })}
      </g>

      <path className={styles.connector} d="M448 90V270M448 180H458V102H470M543 128V154M543 206V232" />
      <path className={styles.signalPathSlow} d="M448 90V270M448 180H458V102H470M543 128V154M543 206V232" />

      <g className={styles.decisionBox}>
        <rect height="52" rx="6" width="146" x="470" y="76" />
        <text className={styles.stageLabel} x="486" y="99">
          CONSENSUS
        </text>
        <text className={styles.stageMeta} x="486" y="116">
          RANK + FALLBACK
        </text>
        <circle className={styles.consensusCore} cx="599" cy="102" r="4" />
      </g>
      <g className={styles.stageBox}>
        <rect height="52" rx="6" width="146" x="470" y="154" />
        <text className={styles.stageLabel} x="486" y="177">
          EVALUATION
        </text>
        <text className={styles.stageMeta} x="486" y="194">
          BACKTEST / ANALYSE
        </text>
      </g>
      <g className={styles.outputBox}>
        <rect height="52" rx="6" width="146" x="470" y="232" />
        <text className={styles.stageLabel} x="486" y="255">
          DASHBOARD
        </text>
        <text className={styles.stageMeta} x="486" y="272">
          SIX-TAB EXPLORATION
        </text>
      </g>

      <g className={styles.metricRail}>
        <text x="24" y="330">PROVIDERS / GEMINI + OLLAMA</text>
        <text x="616" y="330" textAnchor="end">OUTPUT / EVALUATED RANKING</text>
      </g>
    </VisualSvg>
  );
}

function ConclaveCompact() {
  return (
    <>
      <text className={styles.compactEyebrow} x="20" y="26">CONCLAVE / FULL FLOW</text>

      <g className={styles.compactStage}>
        <rect height="36" rx="6" width="280" x="30" y="40" />
        <text x="48" y="63">SOURCES</text>
        <text className={styles.compactMeta} x="292" y="63" textAnchor="end">AMFI · MFAPI · RBI</text>
      </g>
      <path className={styles.compactConnector} d="M170 76V88" />

      <g className={styles.compactStage}>
        <rect height="36" rx="6" width="280" x="30" y="88" />
        <text x="48" y="111">INGESTION</text>
        <text className={styles.compactMeta} x="292" y="111" textAnchor="end">COLLECT + NORMALISE</text>
      </g>
      <path className={styles.compactConnector} d="M170 124V136" />

      <g className={styles.compactStage}>
        <rect height="36" rx="6" width="280" x="30" y="136" />
        <text x="48" y="159">FEATURE ENGINE</text>
        <text className={styles.compactMeta} x="292" y="159" textAnchor="end">20+ METRICS</text>
      </g>

      <g className={styles.compactAgentGroup}>
        <rect height="128" rx="8" width="280" x="30" y="184" />
        <text className={styles.compactGroupLabel} x="48" y="201">FOUR-WAY FAN-OUT / FAN-IN</text>
        <path className={styles.compactConnector} d="M170 172V194H48V294M48 216H70M48 242H70M48 268H70M48 294H70M270 216H292M270 242H292M270 268H292M270 294H292M292 216V312H170V326" />
        {agents.map((agent, index) => {
          const y = 206 + index * 26;
          return (
            <g className={styles.compactAgent} key={agent}>
              <rect height="20" rx="4" width="200" x="70" y={y} />
              <text x="170" y={y + 14} textAnchor="middle">{agent}</text>
            </g>
          );
        })}
      </g>

      <path className={styles.compactSignal} d="M170 76V88M170 124V136M170 172V194H48V294M48 216H70M48 242H70M48 268H70M48 294H70M270 216H292M270 242H292M270 268H292M270 294H292M292 216V312H170V326" />

      <g className={styles.compactDecision}>
        <rect height="36" rx="6" width="280" x="30" y="326" />
        <text x="48" y="349">CONSENSUS</text>
        <text className={styles.compactMeta} x="292" y="349" textAnchor="end">RANK + FALLBACK</text>
      </g>
      <path className={styles.compactConnector} d="M170 362V374" />
      <g className={styles.compactStage}>
        <rect height="36" rx="6" width="280" x="30" y="374" />
        <text x="48" y="397">EVALUATION</text>
        <text className={styles.compactMeta} x="292" y="397" textAnchor="end">BACKTEST</text>
      </g>
      <path className={styles.compactConnector} d="M170 410V422" />
      <g className={styles.compactOutput}>
        <rect height="36" rx="6" width="280" x="30" y="422" />
        <text x="48" y="445">DASHBOARD</text>
        <text className={styles.compactMeta} x="292" y="445" textAnchor="end">SIX TABS</text>
      </g>
      <text className={styles.compactFooter} x="170" y="474" textAnchor="middle">GEMINI / OLLAMA · DETERMINISTIC JOIN</text>
    </>
  );
}
