import clsx from "clsx";

import { HeroTopologyFallback } from "./HeroTopologyFallback";
import styles from "./hero.module.css";

export interface HeroSystemGraphicProps {
  className?: string;
  reducedMotion?: boolean;
}

export function HeroSystemGraphic({
  className,
  reducedMotion = false,
}: HeroSystemGraphicProps) {
  return (
    <div className={clsx(styles.systemGraphic, className)}>
      <div className={styles.fallbackLayer}>
        <HeroTopologyFallback active={!reducedMotion} reducedMotion={reducedMotion} />
      </div>
    </div>
  );
}
