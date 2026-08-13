import styles from "./visuals.module.css";
import type { ProjectVisualProps } from "./types";
import { VisualSvg } from "./VisualSvg";

const archiveStages = [
  { label: "SUPABASE ROWS", meta: "FILTERED POSTGRESQL" },
  { label: "NODE EXPORTER", meta: "TRANSFORM + METADATA" },
  { label: "STORACHA / IPFS", meta: "JSON ARCHIVE + CID" },
  { label: "STATIC DASHBOARD", meta: "SEARCH + FILTERS" },
] as const;

export function CivicLensVisual(props: ProjectVisualProps) {
  return (
    <VisualSvg
      {...props}
      compactChildren={<CivicLensCompact />}
      description="Filtered civic issue rows move from Supabase through a credentialed Node.js archive exporter into Storacha and IPFS, then a static dashboard fetches the archive for statistics, search and filtering."
      kindClassName={styles.civiclens}
    >
      <g className={styles.microGrid}>
        <path d="M20 52H620M20 308H620" />
        <path d="M164 38V324M320 38V324M476 38V324" />
      </g>
      <text className={styles.eyebrow} x="24" y="30">CIVICLENS / ARCHIVE PATH</text>
      <text className={styles.statusText} x="616" y="30" textAnchor="end">SOURCE → CID → STATIC VIEW</text>

      <path className={styles.connector} d="M148 176H180M304 176H336M460 176H492" />
      <path className={styles.archiveSignal} d="M148 176H180M304 176H336M460 176H492" />

      <g className={styles.archiveSource}>
        <rect height="196" rx="7" width="124" x="24" y="78" />
        <text className={styles.panelLabel} x="40" y="101">SUPABASE</text>
        <text className={styles.stageMeta} x="40" y="117">ISSUE ROWS</text>
        {[0, 1, 2, 3].map((index) => (
          <g className={styles.databaseRow} key={index}>
            <rect height="22" rx="3" width="92" x="40" y={134 + index * 28} />
            <circle cx="51" cy={145 + index * 28} r="2.5" />
            <path d={`M60 ${145 + index * 28}H119`} />
          </g>
        ))}
        <text className={styles.stageMeta} x="40" y="260">FILTERED QUERY</text>
      </g>

      <g className={styles.archiveExporter}>
        <rect height="196" rx="7" width="124" x="180" y="78" />
        <text className={styles.panelLabel} x="196" y="101">NODE EXPORTER</text>
        <text className={styles.stageMeta} x="196" y="117">CREDENTIALED</text>
        <path d="M204 146H280M204 173H264M204 200H274" />
        <circle cx="204" cy="146" r="3" />
        <circle cx="204" cy="173" r="3" />
        <circle cx="204" cy="200" r="3" />
        <path className={styles.transformMark} d="M216 226H268M258 218l10 8-10 8" />
        <text className={styles.stageMeta} x="196" y="260">SCHEMA + SOURCE META</text>
      </g>

      <g className={styles.archiveStorage}>
        <rect height="196" rx="7" width="124" x="336" y="78" />
        <text className={styles.panelLabel} x="352" y="101">STORACHA</text>
        <text className={styles.stageMeta} x="352" y="117">IPFS ARCHIVE</text>
        <path d="M398 140l34 20v40l-34 20-34-20v-40Z" />
        <path d="M364 160l34 20 34-20M398 180v40" />
        <text className={styles.cidLabel} x="398" y="245" textAnchor="middle">CID / bafy…</text>
        <text className={styles.stageMeta} x="398" y="260" textAnchor="middle">CONTENT-ADDRESSED</text>
      </g>

      <g className={styles.archiveDashboard}>
        <rect height="196" rx="7" width="124" x="492" y="78" />
        <text className={styles.panelLabel} x="508" y="101">STATIC VIEW</text>
        <text className={styles.stageMeta} x="508" y="117">GATEWAY FETCH</text>
        <rect height="94" rx="4" width="92" x="508" y="136" />
        <path d="M520 153H574M520 168H598M520 183H584M520 198H592M520 213H565" />
        <circle cx="589" cy="153" r="5" />
        <text className={styles.stageMeta} x="508" y="260">STATS · SEARCH · FILTER</text>
      </g>

      <g className={styles.metricRail}>
        <text x="24" y="332">SOURCE / POSTGRESQL</text>
        <text x="320" y="332" textAnchor="middle">ARCHIVE / PORTABLE JSON</text>
        <text x="616" y="332" textAnchor="end">PRESENTATION / NO SERVER</text>
      </g>
    </VisualSvg>
  );
}

function CivicLensCompact() {
  return (
    <>
      <text className={styles.compactEyebrow} x="20" y="26">CIVICLENS / ARCHIVE PATH</text>
      <path className={styles.compactConnector} d="M42 70V334" />
      <path className={styles.compactSignal} d="M42 70V334" />
      {archiveStages.map((stage, index) => {
        const y = 40 + index * 88;
        const stateClass = index === archiveStages.length - 1 ? styles.compactOutput : index === 2 ? styles.compactDecision : styles.compactStage;
        return (
          <g className={stateClass} key={stage.label}>
            <circle cx="42" cy={y + 30} r="5" />
            <rect height="60" rx="7" width="250" x="60" y={y} />
            <text x="78" y={y + 27}>{stage.label}</text>
            <text className={styles.compactMeta} x="78" y={y + 45}>{stage.meta}</text>
          </g>
        );
      })}
      <g className={styles.compactArchiveResult}>
        <rect height="48" rx="6" width="300" x="20" y="400" />
        <text x="38" y="422">BROWSER RESULT</text>
        <text className={styles.compactMeta} x="38" y="439">COUNTS · SEARCH · STATUS / PRIORITY FILTERS</text>
      </g>
      <text className={styles.compactFooter} x="170" y="472" textAnchor="middle">PUBLIC IPFS GATEWAYS · BUNDLED FALLBACK</text>
    </>
  );
}
