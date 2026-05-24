import { useState, useRef } from 'react';
import {
  LineChart,
  Line,
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

interface ChartData {
  x: number;
  simulated: number;
  theoretical: number;
}

interface SimulationResults {
  empirical_mean: number;
  theoretical_mean: number;
  empirical_variance: number;
  theoretical_variance: number;
  empirical_std: number;
  theoretical_std: number;
  pdf: ChartData[];
}

function randomNormal(mean: number, std: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  return mean + std * z;
}

function normalPDF(x: number, mean: number, std: number): number {
  return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mean) ** 2) / (2 * std ** 2));
}

function simulateNormal(mean: number, std: number, sampleSize: number): SimulationResults {
  const samples: number[] = Array.from({ length: sampleSize }, () => randomNormal(mean, std));
  const empiricalMean = samples.reduce((acc, value) => acc + value, 0) / sampleSize;
  const empiricalVariance = samples.reduce((acc, value) => acc + (value - empiricalMean) ** 2, 0) / sampleSize;
  const empiricalStd = Math.sqrt(empiricalVariance);
  const pdf: ChartData[] = [];
  const minX = mean - 4 * std;
  const maxX = mean + 4 * std;

  for (let x = minX; x <= maxX; x += std / 5) {
    const theoretical = normalPDF(x, mean, std);
    const bandwidth = std / 4;
    const simulated = samples.filter((s) => s >= x - bandwidth && s < x + bandwidth).length / sampleSize / (2 * bandwidth);

    pdf.push({ x: Number(x.toFixed(2)), simulated, theoretical });
  }

  return {
    empirical_mean: empiricalMean,
    theoretical_mean: mean,
    empirical_variance: empiricalVariance,
    theoretical_variance: std ** 2,
    empirical_std: empiricalStd,
    theoretical_std: std,
    pdf
  };
}

const initialResults = simulateNormal(0, 1, 5000);

export default function NormalDistribution({ activeDistribution, onDistributionChange }: DistributionPageProps) {
  const [mean, setMean] = useState(0);
  const [std, setStd] = useState(1);
  const [sampleSize, setSampleSize] = useState(5000);
  const [results, setResults] = useState(initialResults);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleSimulate = () => {
    setResults(simulateNormal(mean, Math.max(0.1, std), sampleSize));
  };

  const exportToPNG = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, { backgroundColor: '#0f1520', scale: 2 });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'normal.png';
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
                <h2>Normal(μ={mean}, σ={std})</h2>
                <p className={styles.chartSubtitle}>
                  Distribución Normal · N = {sampleSize.toLocaleString('es-MX')}
                </p>
              </div>

              <button type="button" className={styles.exportButton} onClick={exportToPNG}>
                Exportar PNG
              </button>
            </div>

            <div ref={chartRef} className={styles.chartHero}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.pdf}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="x" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="simulated" stroke="#3b82f6" strokeWidth={2} dot={false} name="Simulado" />
                  <Line type="monotone" dataKey="theoretical" stroke="#f97316" strokeWidth={2} dot={false} name="Teórico" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className={styles.controlsZone}>
            <div className={styles.controlsRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Media (μ)</label>
                <input
                  type="number"
                  value={mean}
                  onChange={(e) => setMean(parseFloat(e.target.value) || 0)}
                  className={styles.parameterInput}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Desviación estándar (σ)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={std}
                  onChange={(e) => setStd(parseFloat(e.target.value) || 1)}
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
              La distribución normal modela fenómenos continuos y tiene forma de campana.
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