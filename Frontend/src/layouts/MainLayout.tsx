import { type ReactNode } from 'react';
import styles from '../styles/MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
  selectedDistribution: string;
  onDistributionChange: (distribution: string) => void;
}

export default function MainLayout({ 
  children, 
  selectedDistribution, 
  onDistributionChange 
}: MainLayoutProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>Σ</div>
          <div className={styles.headerTitle}>
            <h1>Simulador de Distribuciones</h1>
            <p>Probabilidad y Estadística</p>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <label className={styles.sidebarLabel}>Distribución</label>
          <select 
            className={styles.distributionSelect}
            value={selectedDistribution}
            onChange={(e) => onDistributionChange(e.target.value)}
          >
            <option value="bernoulli">Bernoulli</option>
            <option value="binomial">Binomial</option>
            <option value="poisson">Poisson</option>
            <option value="geometric">Geométrica</option>
            <option value="normal">Normal</option>
            <option value="exponential">Exponencial</option>
            <option value="uniform">Uniforme</option>
          </select>
          <p className={styles.distributionDescription}>
            Distribución de probabilidad discreta o continua.
          </p>
        </div>

        {/* Los parámetros irán aquí (renderizados por el componente hijo) */}
        {children}
      </aside>

      {/* Main Content */}
      <main className={`${styles.main} ${styles.scrollbar}`}>
        {/* El contenido principal irá aquí */}
      </main>
    </div>
  );
}