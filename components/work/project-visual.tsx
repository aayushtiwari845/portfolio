import { ProjectArchitectureVisual } from "@/components/visuals";
import type { VisualKind } from "@/data/portfolio";

export function ProjectVisual({
  kind,
  labelled = false,
}: {
  kind: VisualKind;
  labelled?: boolean;
}) {
  return (
    <div className="project-visual-root">
      <ProjectArchitectureVisual
        active={false}
        decorative={!labelled}
        kind={kind}
        reducedMotion
      />
    </div>
  );
}
