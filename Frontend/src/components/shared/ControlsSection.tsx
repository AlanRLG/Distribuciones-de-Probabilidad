import type { ReactNode } from 'react';
import styles from '../../styles/MainLayout.module.css';

interface ControlsSectionProps {
  children: ReactNode;
  description: string;
}

export default function ControlsSection({ children, description }: ControlsSectionProps) {
  return (
    <section className={styles.controlsZone}>
      <div className={styles.controlsRow}>{children}</div>
      <p className={styles.distributionDescription}>{description}</p>
    </section>
  );
}
