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

function randomExponential(rate: number): number {
  return -Math.log(1 - Math.random()) / rate;
}

function exponentialPdf(x: number, rate: number): number {
  if (x < 0) return 0;
  return rate * Math.exp(-rate * x);
}

function exponentialCdf(x: number, rate: number): number {
  if (x < 0) return 0;
  return 1 - Math.exp(-rate * x);
}

function simulateExponential(rate: number, sampleSize: number): ContinuousSimulationResults {
  const clampedRate = Math.max(0.1, rate);
  const samples = Array.from({ length: sampleSize }, () => randomExponential(clampedRate));
  const stats = computeSampleStats(samples);
  const pdf: ContinuousSimulationResults['pdf'] = [];
  const maxX = (1 / clampedRate) * 4;

  for (let x = 0; x <= maxX; x += clampedRate / 5) {
    const theoretical = exponentialPdf(x, clampedRate);
    const bandwidth = 1 / clampedRate / 5;
    const simulated =
      x === 0
        ? theoretical
        : samples.filter((sample) => sample >= x - bandwidth && sample < x + bandwidth).length /
          sampleSize /
          (2 * bandwidth);

    pdf.push({
      x: Number(x.toFixed(2)),
      simulated,
      theoretical,
      simulated_cdf: samples.filter((sample) => sample <= x).length / sampleSize,
      theoretical_cdf: exponentialCdf(x, clampedRate),
    });
  }

  return {
    ...stats,
    theoretical_mean: 1 / clampedRate,
    theoretical_variance: 1 / clampedRate ** 2,
    theoretical_std: 1 / clampedRate,
    pdf,
  };
}

const initialResults = simulateExponential(1, 5000);

export default function ExponentialDistribution({
  activeDistribution,
  onDistributionChange,
}: DistributionPageProps) {
  const [rate, setRate] = useState(1);
  const [sampleSize, setSampleSize] = useState(5000);
  const [results, setResults] = useState(initialResults);
  const { chartRef, exportToCSV, exportToPNG } = useChartExport(
    results,
    `exponential_lambda${rate}_N${sampleSize}`,
  );

  const handleSimulate = () => {
    setResults(simulateExponential(rate, Math.max(100, sampleSize)));
  };

  return (
    <DistributionLayout
      activeDistribution={activeDistribution}
      onDistributionChange={onDistributionChange}
    >
      <ChartSection
        title={`Exponencial(λ=${rate.toFixed(2)})`}
        subtitle={`PDF y CDF simuladas vs teóricas · N = ${sampleSize.toLocaleString('es-MX')}`}
        chartRef={chartRef}
        onExportCSV={exportToCSV}
        onExportPNG={exportToPNG}
      >
        <PdfLineChart data={results.pdf} showCdf />
      </ChartSection>

      <ControlsSection description="Modela el tiempo entre eventos en un proceso de Poisson. El parámetro λ es la tasa y la media teórica es 1/λ.">
        <ParameterField
          id="exponential-rate"
          label="Tasa (λ)"
          type="number"
          min={0.1}
          step={0.1}
          value={rate}
          onChange={(e) => setRate(Math.max(0.1, parseFloat(e.target.value) || 1))}
        />
        <ParameterField
          id="exponential-n"
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
        convergenceHint="Al aumentar N, la densidad y la función acumulada simuladas convergen a sus valores teóricos."
      />
    </DistributionLayout>
  );
}
