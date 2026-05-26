import type { ReactNode } from 'react';
import styles from '../../styles/MainLayout.module.css';
import { DISTRIBUTIONS, type DistributionId } from '../../types/distributions';

interface DistributionLayoutProps {
  activeDistribution: DistributionId | string;
  onDistributionChange: (id: DistributionId) => void;
  apiConnected?: boolean;
  children: ReactNode;
}

export default function DistributionLayout({
  activeDistribution,
  onDistributionChange,
  apiConnected,
  children,
}: DistributionLayoutProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>Σ</div>
          <div className={styles.headerTitle}>
            <h1>Simulador de Distribuciones</h1>
            <p>
              Probabilidad y Estadística
              {apiConnected !== undefined && (
                <span
                  style={{
                    marginLeft: '0.5rem',
                    color: apiConnected ? '#4ade80' : '#f87171',
                  }}
                >
                  · Backend {apiConnected ? 'conectado' : 'desconectado'}
                </span>
              )}
            </p>
          </div>
        </div>

        <nav className={styles.distributionNav} aria-label="Distribuciones">
          {DISTRIBUTIONS.map((dist) => (
            <button
              key={dist.id}
              type="button"
              className={`${styles.distTab} ${
                activeDistribution === dist.id ? styles.distTabActive : ''
              } ${!dist.available ? styles.distTabDisabled : ''}`}
              onClick={() => dist.available && onDistributionChange(dist.id)}
              disabled={!dist.available}
              aria-current={activeDistribution === dist.id ? 'page' : undefined}
            >
              {dist.label}
            </button>
          ))}
        </nav>
      </header>

      <main className={`${styles.main} ${styles.scrollbar}`}>
        <div className={styles.workspace}>{children}</div>
      </main>
    </div>
  );
}
