import { useState, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
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
  pmf: Array<{
    k: number;
    simulated: number;
    theoretical: number;
  }>;
}

function geometricPMF(k: number, p: number): number {
  return (1 - p) ** (k - 1) * p;
}

function simulateGeometric(p: number, sampleSize: number): SimulationResults {
  const clampedP = Math.min(1, Math.max(0.01, p));

  const samples: number[] = Array.from({ length: sampleSize }, () => {
    let trials = 1;
    while (Math.random() >= clampedP) {
      trials++;
    }
    return trials;
  });

  const empiricalMean = samples.reduce((acc, value) => acc + value, 0) / sampleSize;
  const empiricalVariance = samples.reduce((acc, value) => acc + (value - empiricalMean) ** 2, 0) / sampleSize;

  const theoreticalMean = 1 / clampedP;
  const theoreticalVariance = (1 - clampedP) / clampedP ** 2;

  const frequencies: Record<number, number> = {};
  samples.forEach((value) => {
    frequencies[value] = (frequencies[value] || 0) + 1;
  });

  const maxK = 10;
  const pmf = Array.from({ length: maxK }, (_, i) => {
    const k = i + 1;
    return {
      k,
      simulated: (frequencies[k] || 0) / sampleSize,
      theoretical: geometricPMF(k, clampedP)
    };
  });

  return {
    empirical_mean: empiricalMean,
    theoretical_mean: theoreticalMean,
    empirical_variance: empiricalVariance,
    theoretical_variance: theoreticalVariance,
    empirical_std: Math.sqrt(empiricalVariance),
    theoretical_std: Math.sqrt(theoreticalVariance),
    pmf
  };
}

const initialResults = simulateGeometric(0.5, 1000);

export default function GeometricaDistribution({ activeDistribution, onDistributionChange }: DistributionPageProps) {
  const [p, setP] = useState(0.5);
  const [sampleSize, setSampleSize] = useState(1000);
  const [results, setResults] = useState<SimulationResults>(initialResults);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleSimulate = () => {
    setResults(simulateGeometric(p, sampleSize));
  };

  const exportToCSV = () => {
    const data = [
      ['Concepto', 'Teórico', 'Simulado'],
      ['Media', results.theoretical_mean.toFixed(4), results.empirical_mean.toFixed(4)],
      ['Varianza', results.theoretical_variance.toFixed(4), results.empirical_variance.toFixed(4)],
      ['Desviación estándar', results.theoretical_std.toFixed(4), results.empirical_std.toFixed(4)]
    ];

    const blob = new Blob([data.map((row) => row.join(',')).join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geometrica.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPNG = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: '#0f1520',
      scale: 2
    });

    const link = document.createElement('a');
    link.download = 'geometrica.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
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
          <section className={styles.chartZone}>
            <div className={styles.chartZoneHeader}>
              <div className={styles.chartTitle}>
                <h2>Geométrica(p={p})</h2>
                <p className={styles.chartSubtitle}>
                  Distribución Geométrica · N = {sampleSize.toLocaleString('es-MX')}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
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
                <BarChart data={results.pmf}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="k" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="simulated" fill="#3b82f6" name="Simulado" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="theoretical" fill="#f97316" name="Teórico" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className={styles.controlsZone}>
            <div className={styles.controlsRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Probabilidad (p)</label>
                <input
                  type="number"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={p}
                  onChange={(e) => setP(parseFloat(e.target.value) || 0.5)}
                  className={styles.parameterInput}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Tamaño de muestra</label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(parseInt(e.target.value, 10) || 1000)}
                  className={styles.parameterInput}
                />
              </div>

              <button type="button" className={styles.simulateButton} onClick={handleSimulate}>
                ▶ Simular
              </button>
            </div>

            <p className={styles.distributionDescription}>
              La distribución geométrica modela el número de ensayos de Bernoulli independientes necesarios para obtener el primer éxito.
            </p>
          </section>

          <div className={styles.insightsGrid}>
            <section className={styles.insightPanel}>
              <h3 className={styles.resultsTitle}>Resultados</h3>

              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableHeader}>Concepto</th>
                    <th className={styles.tableHeader}>Teórico</th>
                    <th className={styles.tableHeader}>Simulado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableCell}>Media</td>
                    <td className={styles.tableCell}>{results.theoretical_mean.toFixed(4)}</td>
                    <td className={styles.tableCell}>{results.empirical_mean.toFixed(4)}</td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableCell}>Varianza</td>
                    <td className={styles.tableCell}>{results.theoretical_variance.toFixed(4)}</td>
                    <td className={styles.tableCell}>{results.empirical_variance.toFixed(4)}</td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableCell}>Desv. estándar</td>
                    <td className={styles.tableCell}>{results.theoretical_std.toFixed(4)}</td>
                    <td className={styles.tableCell}>{results.empirical_std.toFixed(4)}</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}