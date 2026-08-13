import styles from "./visuals.module.css";
import type { ProjectVisualProps } from "./types";
import { VisualSvg } from "./VisualSvg";

const pipeline = [
  { label: "NSE / BSE", meta: "2019–2024" },
  { label: "ENRICH", meta: "34 COLUMNS" },
  { label: "ANALYSE", meta: "REGRESSION" },
  { label: "CLUSTER", meta: "K = 2" },
  { label: "DASHBOARD", meta: "PLOTLY / DASH" },
] as const;

const clusterOne = [[56, 271], [79, 247], [104, 279], [128, 235], [151, 264], [180, 242]] as const;
const clusterTwo = [[111, 204], [144, 194], [176, 217], [207, 181], [238, 207], [273, 178]] as const;

export function IpoAnalyticsVisual(props: ProjectVisualProps) {
  return (
    <VisualSvg
      {...props}
      compactChildren={<IpoCompact />}
      description="NSE and BSE IPO records are enriched into a 34-column table, analysed with regression and distributions, separated into two project-data risk clusters and presented in a Plotly Dash dashboard."
      kindClassName={styles.ipo}
    >
      <g className={styles.microGrid}>
        <path d="M20 52H620M20 144H620M20 320H620" />
        <path d="M320 144V320" />
      </g>
      <text className={styles.eyebrow} x="24" y="30">IPO ANALYTICS / EVIDENCE PATH</text>
      <text className={styles.statusText} x="616" y="30" textAnchor="end">63 RECORDS / 27 SECTORS</text>

      <path className={styles.pipelineRail} d="M66 96H574" />
      <path className={styles.sparkSignal} d="M66 96H574" />
      {pipeline.map((stage, index) => {
        const x = 24 + index * 122;
        const stageClass = index === pipeline.length - 1 ? styles.outputBox : index === 3 ? styles.decisionBox : styles.pipelineStage;
        return (
          <g className={stageClass} key={stage.label}>
            <rect height="52" rx="6" width="104" x={x} y="70" />
            <text className={styles.stageLabel} x={x + 52} y="92" textAnchor="middle">{stage.label}</text>
            <text className={styles.stageMeta} x={x + 52} y="109" textAnchor="middle">{stage.meta}</text>
          </g>
        );
      })}

      <g className={styles.scatterPlot}>
        <text className={styles.panelLabel} x="24" y="164">RESULT / RISK CLUSTERS</text>
        <path d="M38 298V176M38 298H300" />
        <path className={styles.axisTick} d="M38 256H300M38 214H300M100 176V298M162 176V298M224 176V298" />
        {clusterOne.map(([cx, cy], index) => <circle className={styles.clusterOne} cx={cx} cy={cy} key={`one-${index}`} r="4" />)}
        {clusterTwo.map(([cx, cy], index) => <circle className={styles.clusterTwo} cx={cx} cy={cy} key={`two-${index}`} r="4" />)}
        <path className={styles.trendLine} d="M48 281C104 274 133 239 177 229s71-48 112-58" />
        <text className={styles.axisLabel} x="38" y="313">LOWER RISK</text>
        <text className={styles.axisLabel} x="300" y="313" textAnchor="end">HIGHER RETURN</text>
      </g>

      <g className={styles.distributionPanel}>
        <text className={styles.panelLabel} x="344" y="164">RETURN DISTRIBUTION</text>
        <path className={styles.distributionAxis} d="M344 234H616" />
        <path className={styles.distributionFill} d="M348 233C377 231 393 219 414 210s39-47 69-48 48 37 72 52 37 17 57 19H348Z" />
        <path className={styles.distributionLine} d="M348 233C377 231 393 219 414 210s39-47 69-48 48 37 72 52 37 17 57 19" />
        <path className={styles.medianMarker} d="M483 164V239" />
        <text className={styles.axisLabel} x="483" y="250" textAnchor="middle">MEDIAN</text>
      </g>

      <g className={styles.modelResult}>
        <rect height="48" rx="6" width="272" x="344" y="268" />
        <text className={styles.metricValueSmall} x="360" y="290">0.9808</text>
        <text className={styles.stageMeta} x="360" y="305">5-FOLD CV R²</text>
        <path d="M463 278V306" />
        <text className={styles.metricValueSmall} x="483" y="290">~4.15%</text>
        <text className={styles.stageMeta} x="483" y="305">MAE / PROJECT DATA</text>
      </g>

      <g className={styles.metricRail}>
        <text x="24" y="340">CLUSTER 01 / LOWER-RISK GROUP</text>
        <text x="616" y="340" textAnchor="end">CLUSTER 02 / HIGHER-VARIANCE GROUP</text>
      </g>
    </VisualSvg>
  );
}

function IpoCompact() {
  return (
    <>
      <text className={styles.compactEyebrow} x="20" y="26">IPO ANALYTICS / DATA PATH</text>
      <path className={styles.compactConnector} d="M42 49V274" />
      <path className={styles.compactSignal} d="M42 49V274" />
      {pipeline.map((stage, index) => {
        const y = 40 + index * 50;
        const stageClass = index === pipeline.length - 1 ? styles.compactOutput : index === 3 ? styles.compactDecision : styles.compactStage;
        return (
          <g className={stageClass} key={stage.label}>
            <circle cx="42" cy={y + 18} r="5" />
            <rect height="36" rx="6" width="250" x="60" y={y} />
            <text x="76" y={y + 23}>{stage.label}</text>
            <text className={styles.compactMeta} x="294" y={y + 23} textAnchor="end">{stage.meta}</text>
          </g>
        );
      })}

      <g className={styles.compactAnalyticsPanel}>
        <rect height="120" rx="7" width="300" x="20" y="304" />
        <text className={styles.compactGroupLabel} x="38" y="326">PROJECT-DATA RESULTS</text>
        <path d="M42 396V340M42 396H168" />
        <circle className={styles.clusterOne} cx="65" cy="381" r="5" />
        <circle className={styles.clusterOne} cx="91" cy="367" r="4" />
        <circle className={styles.clusterTwo} cx="116" cy="351" r="5" />
        <circle className={styles.clusterTwo} cx="148" cy="344" r="4" />
        <path className={styles.trendLine} d="M54 387C86 380 105 354 156 338" />
        <text className={styles.compactResultValue} x="190" y="354">0.9808</text>
        <text className={styles.compactMeta} x="190" y="371">5-FOLD CV R²</text>
        <text className={styles.compactResultValue} x="190" y="397">~4.15%</text>
        <text className={styles.compactMeta} x="190" y="414">MAE</text>
      </g>
      <g className={styles.compactFooter}>
        <text x="20" y="454">63 RECORDS · 27 SECTORS</text>
        <text x="320" y="454" textAnchor="end">K-MEANS / 2 CLUSTERS</text>
      </g>
    </>
  );
}
