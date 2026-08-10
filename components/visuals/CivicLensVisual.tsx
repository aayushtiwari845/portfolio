import styles from "./visuals.module.css";
import type { ProjectVisualProps } from "./types";
import { VisualSvg } from "./VisualSvg";

const states = ["REPORTED", "ROUTED", "ASSIGNED", "RESOLVED"] as const;

export function CivicLensVisual(props: ProjectVisualProps) {
  return (
    <VisualSvg
      {...props}
      description="A geolocated civic report moves through routing, assignment and resolution while remaining synchronized across intermittent connectivity."
      kindClassName={styles.civiclens}
    >
      <g className={styles.mapGrid}>
        <path d="M26 64H356M26 112H356M26 160H356M26 208H356M26 256H356M26 304H356" />
        <path d="M70 42V326M126 42V326M182 42V326M238 42V326M294 42V326M350 42V326" />
        <path d="M27 281C84 248 111 256 154 218S226 171 260 128 319 100 355 74" />
        <path d="M46 49c34 49 63 69 107 85s70 45 87 78 54 61 111 76" />
      </g>

      <text className={styles.eyebrow} x="28" y="34">
        CIVIC GRID / MUMBAI
      </text>
      <g className={styles.syncStatus}>
        <path d="M561 28h12l4 4h35" />
        <text x="553" y="35" textAnchor="end">
          SYNC / READY
        </text>
      </g>

      <path className={styles.routeBase} d="M73 246C117 218 143 223 174 186s68-49 105-28" />
      <path className={styles.routeSignal} d="M73 246C117 218 143 223 174 186s68-49 105-28" />

      <g className={styles.issuePin} transform="translate(73 246)">
        <circle r="17" />
        <circle r="5" />
        <path d="M0 19v12" />
      </g>
      <g className={styles.mapNode} transform="translate(174 186)">
        <circle r="7" />
        <circle r="2" />
      </g>
      <g className={styles.mapNode} transform="translate(279 158)">
        <circle r="8" />
        <circle r="2.5" />
      </g>
      <g className={styles.mapNodeMuted} transform="translate(122 105)">
        <circle r="6" />
      </g>
      <g className={styles.mapNodeMuted} transform="translate(314 92)">
        <circle r="6" />
      </g>

      <g className={styles.locationTag}>
        <rect height="31" rx="5" width="104" x="89" y="254" />
        <text x="101" y="267">
          ISSUE / 0184
        </text>
        <text className={styles.stageMeta} x="101" y="278">
          MEDIA + GPS
        </text>
      </g>

      <g className={styles.workflowPanel}>
        <rect height="226" rx="8" width="224" x="388" y="68" />
        <text className={styles.panelLabel} x="408" y="94">
          STATUS WORKFLOW
        </text>
        <path className={styles.workflowLine} d="M422 122V254" />
        <path className={styles.workflowSignal} d="M422 122V254" />
        {states.map((state, index) => {
          const y = 122 + index * 44;
          return (
            <g className={styles.workflowState} key={state}>
              <circle cx="422" cy={y} r="6" />
              <text x="442" y={y + 4}>
                {state}
              </text>
              <text className={styles.stageMeta} x="590" y={y + 4} textAnchor="end">
                {String(index + 1).padStart(2, "0")}
              </text>
            </g>
          );
        })}
      </g>

      <g className={styles.metricRail}>
        <text x="28" y="326">
          QUEUE / OFFLINE-CAPABLE
        </text>
        <text x="612" y="326" textAnchor="end">
          ROUTING / POSTGIS
        </text>
      </g>
    </VisualSvg>
  );
}
