import { useState } from 'react';
import type { DistributionPageProps } from '../types/distributions';
import type { ContinuousSimulationResults } from '../types/simulation';
import { computeSampleStats } from '../utils/statistics';
import { useChartExport } from '../hooks/useChartExport';
import DistributionLayout from './shared/DistributionLayout';
import ChartSection from './shared/ChartSection';
import ControlsSection from './shared/ControlsSection';
import ParameterField from './shared/ParameterField';
import SimulateButton from './shared/SimulateButton';
import PdfLineChart from './shared/PdfLineChart';
import SimulationInsights from './shared/SimulationInsights';

function randomNormal(mean: number, std: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + std * z;
}

function normalPdf(x: number, mean: number, std: number): number {
  return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mean) ** 2) / (2 * std ** 2));
}

function simulateNormal(mean: number, std: number, sampleSize: number): ContinuousSimulationResults {
  const clampedStd = Math.max(0.1, std);
  const samples = Array.from({ length: sampleSize }, () => randomNormal(mean, clampedStd));
  const stats = computeSampleStats(samples);
  const pdf: ContinuousSimulationResults['pdf'] = [];
  const minX = mean - 4 * clampedStd;
  const maxX = mean + 4 * clampedStd;

  for (let x = minX; x <= maxX; x += clampedStd / 5) {
    const theoretical = normalPdf(x, mean, clampedStd);
    const bandwidth = clampedStd / 4;
    const simulated =
      samples.filter((sample) => sample >= x - bandwidth && sample < x + bandwidth).length /
      sampleSize /
      (2 * bandwidth);

    pdf.push({
      x: Number(x.toFixed(2)),
      simulated,
      theoretical,
    });
  }

  return {
    ...stats,
    theoretical_mean: mean,
    theoretical_variance: clampedStd ** 2,
    theoretical_std: clampedStd,
    pdf,
  };
}

const initialResults = simulateNormal(0, 1, 5000);

export default function NormalDistribution({
  activeDistribution,
  onDistributionChange,
}: DistributionPageProps) {
  const [mean, setMean] = useState(0);
  const [std, setStd] = useState(1);
  const [sampleSize, setSampleSize] = useState(5000);
  const [results, setResults] = useState(initialResults);
  const { chartRef, exportToCSV, exportToPNG } = useChartExport(
    results,
    `normal_mu${mean}_sigma${std}_N${sampleSize}`,
  );

  const handleSimulate = () => {
    setResults(simulateNormal(mean, std, Math.max(100, sampleSize)));
  };

  return (
    <DistributionLayout
      activeDistribution={activeDistribution}
      onDistributionChange={onDistributionChange}
    >
      <ChartSection
        title={`Normal(μ=${mean}, σ=${std})`}
        subtitle={`Densidad simulada vs PDF teórica · N = ${sampleSize.toLocaleString('es-MX')}`}
        chartRef={chartRef}
        onExportCSV={exportToCSV}
        onExportPNG={exportToPNG}
      >
        <PdfLineChart data={results.pdf} />
      </ChartSection>

      <ControlsSection description="Modela fenómenos continuos con forma de campana. La media teórica es μ y la varianza es σ².">
        <ParameterField
          id="normal-mean"
          label="Media (μ)"
          type="number"
          step={0.1}
          value={mean}
          onChange={(e) => setMean(parseFloat(e.target.value) || 0)}
        />
        <ParameterField
          id="normal-std"
          label="Desviación estándar (σ)"
          type="number"
          min={0.1}
          step={0.1}
          value={std}
          onChange={(e) => setStd(parseFloat(e.target.value) || 1)}
        />
        <ParameterField
          id="normal-n"
          label="Tamaño de muestra (N)"
          type="number"
          min={100}
          step={100}
          value={sampleSize}
          onChange={(e) => setSampleSize(Math.max(100, parseInt(e.target.value, 10) || 1000))}
        />
        <SimulateButton onClick={handleSimulate} />
      </ControlsSection>

      <SimulationInsights
        results={results}
        sampleSize={sampleSize}
        convergenceHint="Al aumentar N, la curva simulada se acerca a la PDF teórica y los estadísticos empíricos convergen a μ y σ²."
      />
    </DistributionLayout>
  );
}
