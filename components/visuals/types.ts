export type ProjectVisualKind =
  | "conclave"
  | "tracepilot"
  | "fraud"
  | "civiclens"
  | "ipo";

export interface ProjectVisualProps {
  active?: boolean;
  className?: string;
  decorative?: boolean;
  reducedMotion?: boolean;
}
