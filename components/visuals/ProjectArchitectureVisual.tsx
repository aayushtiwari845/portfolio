import type { ComponentType } from "react";

import { CivicLensVisual } from "./CivicLensVisual";
import { ConclaveVisual } from "./ConclaveVisual";
import { FraudPipelineVisual } from "./FraudPipelineVisual";
import { IpoAnalyticsVisual } from "./IpoAnalyticsVisual";
import { TracePilotVisual } from "./TracePilotVisual";
import type { ProjectVisualKind, ProjectVisualProps } from "./types";

export const projectArchitectureVisuals = {
  conclave: ConclaveVisual,
  tracepilot: TracePilotVisual,
  fraud: FraudPipelineVisual,
  civiclens: CivicLensVisual,
  ipo: IpoAnalyticsVisual,
} satisfies Record<ProjectVisualKind, ComponentType<ProjectVisualProps>>;

export interface ProjectArchitectureVisualProps extends ProjectVisualProps {
  kind: ProjectVisualKind;
}
export function ProjectArchitectureVisual({
  kind,
  ...props
}: ProjectArchitectureVisualProps) {
  const Visual = projectArchitectureVisuals[kind];

  return <Visual {...props} />;
}
