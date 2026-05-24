import styles from '../../styles/MainLayout.module.css';
import type { SimulationStats } from '../../types/simulation';
import { relativeMeanError } from '../../utils/export';

interface SimulationInsightsProps {
  results: SimulationStats;
  sampleSize: number;
  convergenceHint?: string;
}

export default function SimulationInsights({
  results,
  sampleSize,
  convergenceHint = 'Al aumentar N, la media empírica converge al valor teórico y las barras simuladas se acercan a la distribución teórica. Prueba N = 50,000 para verlo con claridad.',
}: SimulationInsightsProps) {
  const relativeError = relativeMeanError(results);

  return (
    <div className={styles.insightsGrid}>
      <section className={styles.insightPanel}>
        <h3 className={styles.resultsTitle}>Resultados numéricos</h3>
        <p className={styles.resultsSubtitle}>Comparación teórico vs empírico</p>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.tableHeader}>Concepto</th>
              <th className={styles.tableHeader}>Teórico</th>
              <th className={styles.tableHeader}>Simulado</th>
              <th className={styles.tableHeader}>|Error|</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellHighlight}`}>Media (μ)</td>
              <td className={styles.tableCell}>{results.theoretical_mean.toFixed(4)}</td>
              <td className={styles.tableCell}>{results.empirical_mean.toFixed(4)}</td>
              <td className={styles.tableCell}>
                {Math.abs(results.empirical_mean - results.theoretical_mean).toFixed(4)}
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellHighlight}`}>Varianza (σ²)</td>
              <td className={styles.tableCell}>{results.theoretical_variance.toFixed(4)}</td>
              <td className={styles.tableCell}>{results.empirical_variance.toFixed(4)}</td>
              <td className={styles.tableCell}>
                {Math.abs(results.empirical_variance - results.theoretical_variance).toFixed(4)}
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.tableCellHighlight}`}>Desv. estándar (σ)</td>
              <td className={styles.tableCell}>{results.theoretical_std.toFixed(4)}</td>
              <td className={styles.tableCell}>{results.empirical_std.toFixed(4)}</td>
              <td className={styles.tableCell}>
                {Math.abs(results.empirical_std - results.theoretical_std).toFixed(4)}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.insightPanel}>
        <h3 className={styles.interpretationTitle}>Interpretación</h3>
        <p className={styles.interpretationSubtitle}>Análisis del comportamiento</p>

        <div className={styles.interpretationItem}>
          <div className={styles.interpretationLabel}>
            <span className={styles.interpretationIcon}>✦</span>
            Lectura rápida
          </div>
          <p className={styles.interpretationText}>
            Con N = {sampleSize.toLocaleString('es-MX')}, las medias empíricas y teóricas son{' '}
            <strong>muy cercanas</strong> (error relativo ≈ {relativeError.toFixed(2)}%).
          </p>
        </div>

        <div className={styles.interpretationItem}>
          <div className={styles.interpretationLabel}>
            <span className={styles.interpretationIcon}>?</span>
            ¿Por qué hay diferencia?
          </div>
          <p className={styles.interpretationText}>
            Los datos simulados son una muestra aleatoria; sus estadísticos fluctúan en torno a los
            valores teóricos mientras N sea finito.
          </p>
        </div>

        <div className={styles.interpretationItem}>
          <div className={styles.interpretationLabel}>
            <span className={styles.interpretationIcon}>↗</span>
            Ley de los Grandes Números
          </div>
          <p className={styles.interpretationText}>{convergenceHint}</p>
        </div>
      </section>
    </div>
  );
}
