import { useState, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import html2canvas from 'html2canvas';

import styles from '../styles/MainLayout.module.css';
import { DISTRIBUTIONS, type DistributionPageProps } from '../types/distributions';

interface SimulationResults {
  empirical_mean: number;
  theoretical_mean: number;
  empirical_variance: number;
  theoretical_variance: number;
  empirical_std: number;
  theoretical_std: number;
  pmf: Array<{ k: number; simulated: number; theoretical: number }>;
}

function poissonCoeff(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return result;
}

function theoreticalPoissonPmf(n: number, p: number, k: number): number {
  return poissonCoeff(n, k) * p ** k * (1 - p) ** (n - k);
}

function simulatePoisson(n: number, p: number, sampleSize: number): SimulationResults {
  const clampedP = Math.min(1, Math.max(0, p));
  const clampedN = Math.max(1, Math.min(50, Math.floor(n)));
  const nSamples = Math.max(1, sampleSize);

  const counts = new Array<number>(clampedN + 1).fill(0);
  const trialValues: number[] = [];

  for (let i = 0; i < nSamples; i++) {
    let successes = 0;
    for (let j = 0; j < clampedN; j++) {
      if (Math.random() < clampedP) successes++;
    }
    counts[successes]++;
    trialValues.push(successes);
  }

  const empiricalMean = trialValues.reduce((acc, v) => acc + v, 0) / nSamples;
  const empiricalVariance =
    trialValues.reduce((acc, v) => acc + (v - empiricalMean) ** 2, 0) / nSamples;

  const theoreticalMean = clampedN * clampedP;
  const theoreticalVariance = clampedN * clampedP * (1 - clampedP);

  return {
    empirical_mean: empiricalMean,
    theoretical_mean: theoreticalMean,
    empirical_variance: empiricalVariance,
    theoretical_variance: theoreticalVariance,
    empirical_std: Math.sqrt(empiricalVariance),
    theoretical_std: Math.sqrt(theoreticalVariance),
    pmf: Array.from({ length: clampedN + 1 }, (_, k) => ({
      k,
      simulated: counts[k] / nSamples,
      theoretical: theoreticalPoissonPmf(clampedN, clampedP, k),
    })),
  };
}

const initialResults = simulatePoisson(10, 0.5, 1000);

export default function PoissonDistribution({
  activeDistribution,
  onDistributionChange,
}: DistributionPageProps) {
  const [p, setP] = useState(0.5);
  const [n, setN] = useState(10);
  const [sampleSize, setSampleSize] = useState(1000);
  const [results, setResults] = useState<SimulationResults>(initialResults);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleSimulate = () => {
    setResults(simulatePoisson(n, p, Math.max(1, sampleSize)));
  };

  const relativeError =
    results.theoretical_mean > 0
      ? (Math.abs(results.empirical_mean - results.theoretical_mean) / results.theoretical_mean) * 100
      : 0;

  const exportToCSV = () => {
    const data = [
      ['Concepto', 'Teórico', 'Simulado', '|Error|'],
      [
        'Media (μ)',
        results.theoretical_mean.toFixed(4),
        results.empirical_mean.toFixed(4),
        Math.abs(results.empirical_mean - results.theoretical_mean).toFixed(4),
      ],
      [
        'Varianza (σ²)',
        results.theoretical_variance.toFixed(4),
        results.empirical_variance.toFixed(4),
        Math.abs(results.empirical_variance - results.theoretical_variance).toFixed(4),
      ],
      [
        'Desviación estándar (σ)',
        results.theoretical_std.toFixed(4),
        results.empirical_std.toFixed(4),
        Math.abs(results.empirical_std - results.theoretical_std).toFixed(4),
      ],
    ];

    const blob = new Blob([data.map((row) => row.join(',')).join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `binomial_p${p}_N${sampleSize}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPNG = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#0f1520',
        scale: 2,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `Poisson_p${p}_N${sampleSize}.png`;
      link.click();
    } catch (error) {
      console.error('Error al exportar PNG:', error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>Σ</div>
          <div className={styles.headerTitle}>
            <h1>Simulador de Distribuciones</h1>
            <p>Probabilidad y Estadística</p>
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
        <div className={styles.workspace}>
          {/* Gráfico — protagonista */}
          <section className={styles.chartZone}>
            <div className={styles.chartZoneHeader}>
              <div className={styles.chartTitle}>
                <h2>Poisson(n={n}, p={p.toFixed(2)})</h2>
                <p className={styles.chartSubtitle}>
                  Frecuencia relativa simulada vs PMF teórica · N ={' '}
                  {sampleSize.toLocaleString('es-MX')}
                </p>
              </div>
              <div className={styles.exportButtons}>
                <button type="button" className={styles.exportButton} onClick={exportToCSV}>
                  Exportar CSV
                </button>
                <button type="button" className={styles.exportButton} onClick={exportToPNG}>
                  Exportar PNG
                </button>
              </div>
            </div>

            <div ref={chartRef} className={styles.chartHero}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={results.pmf}
                  margin={{ top: 12, right: 20, left: 4, bottom: 4 }}
                  barGap={6}
                  barCategoryGap="32%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                  <XAxis
                    dataKey="k"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 13 }}
                    axisLine={{ stroke: 'rgba(148,163,184,0.15)' }}
                    tickLine={false}
                    label={{ value: 'k', position: 'insideBottomRight', offset: -2, fill: '#64748b' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => v.toFixed(2)}
                    label={{
                      value: 'Probabilidad',
                      angle: -90,
                      position: 'insideLeft',
                      fill: '#64748b',
                      style: { textAnchor: 'middle' },
                    }}
                  />
                  <Tooltip
                    formatter={(value) => (typeof value === 'number' ? value.toFixed(4) : value)}
                    contentStyle={{
                      background: '#151d2b',
                      border: '1px solid rgba(148,163,184,0.15)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                    }}
                    labelFormatter={(label) => `k = ${label}`}
                  />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: '0.75rem', color: '#94a3b8' }}
                    iconType="square"
                  />
                  <Bar dataKey="simulated" fill="#3b82f6" name="Simulado" radius={[4, 4, 0, 0]} maxBarSize={56} />
                  <Bar dataKey="theoretical" fill="#f97316" name="Teórico" radius={[4, 4, 0, 0]} maxBarSize={56} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Parámetros — debajo del gráfico */}
          <section className={styles.controlsZone}>
            <div className={styles.controlsRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="binomial-p">
                  Probabilidad de éxito (p)
                </label>
                <input
                  id="binomial-p"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={p}
                  onChange={(e) => setP(parseFloat(e.target.value) || 0)}
                  className={styles.parameterInput}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="binomial-n">
                  Número de ensayos (n)
                </label>
                <input
                  id="binomial-n"
                  type="number"
                  min="1"
                  max="50"
                  step="1"
                  value={n}
                  onChange={(e) => setN(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className={styles.parameterInput}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="binomial-N">
                  Tamaño de muestra (N)
                </label>
                <input
                  id="binomial-N"
                  type="number"
                  min="1"
                  step="1"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className={styles.parameterInput}
                />
              </div>

              <button type="button" className={styles.simulateButton} onClick={handleSimulate}>
                ▶ Simular
              </button>
            </div>
            <p className={styles.distributionDescription}>
              Número de éxitos en n ensayos independientes con probabilidad p. La PMF teórica es
              P(X=k) = C(n,k) · p^k · (1−p)^(n−k).
            </p>
          </section>

          {/* Resultados e interpretación — misma superficie */}
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
                <p className={styles.interpretationText}>
                  Al aumentar N, la media empírica converge a p y las barras simuladas se acercan a la PMF
                  teórica. Prueba N = 50,000 para verlo con claridad.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
