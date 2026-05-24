import type { ReactNode, RefObject } from 'react';
import styles from '../../styles/MainLayout.module.css';

interface ChartSectionProps {
  title: string;
  subtitle: string;
  chartRef: RefObject<HTMLDivElement | null>;
  onExportCSV?: () => void;
  onExportPNG: () => void;
  children: ReactNode;
}

export default function ChartSection({
  title,
  subtitle,
  chartRef,
  onExportCSV,
  onExportPNG,
  children,
}: ChartSectionProps) {
  return (
    <section className={styles.chartZone}>
      <div className={styles.chartZoneHeader}>
        <div className={styles.chartTitle}>
          <h2>{title}</h2>
          <p className={styles.chartSubtitle}>{subtitle}</p>
        </div>
        <div className={styles.exportButtons}>
          {onExportCSV && (
            <button type="button" className={styles.exportButton} onClick={onExportCSV}>
              Exportar CSV
            </button>
          )}
          <button type="button" className={styles.exportButton} onClick={onExportPNG}>
            Exportar PNG
          </button>
        </div>
      </div>

      <div ref={chartRef} className={styles.chartHero}>
        {children}
      </div>
    </section>
  );
}
