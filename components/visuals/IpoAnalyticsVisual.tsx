import styles from "./visuals.module.css";
import type { ProjectVisualProps } from "./types";
import { VisualSvg } from "./VisualSvg";

const clusterOne = [
  [74, 213],
  [94, 187],
  [112, 224],
  [134, 170],
  [148, 204],
  [169, 181],
  [186, 215],
] as const;

const clusterTwo = [
  [139, 127],
  [173, 115],
  [198, 143],
  [218, 103],
  [239, 132],
  [259, 89],
  [281, 119],
] as const;

export function IpoAnalyticsVisual(props: ProjectVisualProps) {
  return (
    <VisualSvg
      {...props}
      description="IPO observations are explored as two data-derived risk clusters alongside a return distribution and analytical trend."
      kindClassName={styles.ipo}
    >
      <g className={styles.microGrid}>
        <path d="M24 66H616M24 294H616" />
        <path d="M348 42V320" />
      </g>

      <text className={styles.eyebrow} x="28" y="35">
        IPO ANALYTICS / 2019—2024
      </text>
      <text className={styles.statusText} x="612" y="35" textAnchor="end">
        63 RECORDS / 27 SECTORS
      </text>

      <g className={styles.scatterPlot}>
        <text className={styles.panelLabel} x="29" y="84">
          RISK CLUSTERS / K=2
        </text>
        <path d="M48 258V98M48 258H318" />
        <path className={styles.axisTick} d="M48 218H318M48 178H318M48 138H318M102 98V258M156 98V258M210 98V258M264 98V258" />
        {clusterOne.map(([cx, cy], index) => (
          <circle
            className={styles.clusterOne}
            cx={cx}
            cy={cy}
            key={`one-${index}`}
            r={index % 3 === 0 ? 4.5 : 3.5}
          />
        ))}
        {clusterTwo.map(([cx, cy], index) => (
          <circle
            className={styles.clusterTwo}
            cx={cx}
            cy={cy}
            key={`two-${index}`}
            r={index % 3 === 0 ? 4.5 : 3.5}
          />
        ))}
        <path className={styles.trendLine} d="M61 230C117 218 132 181 179 170S238 116 300 106" />
        <text className={styles.axisLabel} x="48" y="276">
          LOWER RISK
        </text>
        <text className={styles.axisLabel} x="318" y="276" textAnchor="end">
          HIGHER RETURN
        </text>
      </g>

      <g className={styles.distributionPanel}>
        <text className={styles.panelLabel} x="380" y="84">
          RETURN DISTRIBUTION
        </text>
        <path className={styles.distributionAxis} d="M380 173H609" />
        <path className={styles.distributionFill} d="M384 172C411 170 421 155 442 147s36-59 67-60 45 46 65 62 23 21 32 23H384Z" />
        <path className={styles.distributionLine} d="M384 172C411 170 421 155 442 147s36-59 67-60 45 46 65 62 23 21 32 23" />
        <path className={styles.medianMarker} d="M509 89V177" />
        <text className={styles.axisLabel} x="509" y="188" textAnchor="middle">
          MEDIAN
        </text>
      </g>

      <g className={styles.modelMetric}>
        <text className={styles.metricValue} x="380" y="230">
          0.9808
        </text>
        <text className={styles.stageMeta} x="380" y="246">
          5-FOLD CV R² / PROJECT DATASET
        </text>
        <path d="M380 269C411 260 426 276 454 262s46-26 73-17 46-8 78-21" />
        <path className={styles.sparkSignal} d="M380 269C411 260 426 276 454 262s46-26 73-17 46-8 78-21" />
      </g>

      <g className={styles.legend}>
        <circle className={styles.clusterOne} cx="29" cy="307" r="3" />
        <text x="39" y="311">
          CLUSTER 01
        </text>
        <circle className={styles.clusterTwo} cx="119" cy="307" r="3" />
        <text x="129" y="311">
          CLUSTER 02
        </text>
      </g>
      <text className={styles.metricRail} x="612" y="311" textAnchor="end">
        TABLE / 34 COLUMNS
      </text>
    </VisualSvg>
  );
}
