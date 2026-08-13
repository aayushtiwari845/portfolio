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
        active
        decorative={!labelled}
        kind={kind}
      />
    </div>
  );
}
