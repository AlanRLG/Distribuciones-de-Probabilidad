import { useState } from 'react';
import type { DistributionPageProps } from '../types/distributions';
import type { DiscreteSimulationResults } from '../types/simulation';
import { computeSampleStats } from '../utils/statistics';
import { useChartExport } from '../hooks/useChartExport';
import DistributionLayout from './shared/DistributionLayout';
import ChartSection from './shared/ChartSection';
import ControlsSection from './shared/ControlsSection';
import ParameterField from './shared/ParameterField';
import SimulateButton from './shared/SimulateButton';
import PmfBarChart from './shared/PmfBarChart';
import SimulationInsights from './shared/SimulationInsights';

function geometricPmf(k: number, p: number): number {
  return (1 - p) ** (k - 1) * p;
}

function simulateGeometric(p: number, sampleSize: number): DiscreteSimulationResults {
  const clampedP = Math.min(1, Math.max(0.01, p));
  const samples = Array.from({ length: sampleSize }, () => {
    let trials = 1;
    while (Math.random() >= clampedP) {
      trials++;
    }
    return trials;
  });

  const stats = computeSampleStats(samples);
  const theoreticalVariance = (1 - clampedP) / clampedP ** 2;
  const maxK = 10;
  const frequencies: Record<number, number> = {};

  samples.forEach((value) => {
    frequencies[value] = (frequencies[value] || 0) + 1;
  });

  return {
    ...stats,
    theoretical_mean: 1 / clampedP,
    theoretical_variance: theoreticalVariance,
    theoretical_std: Math.sqrt(theoreticalVariance),
    pmf: Array.from({ length: maxK }, (_, index) => {
      const k = index + 1;
      return {
        k,
        simulated: (frequencies[k] || 0) / sampleSize,
        theoretical: geometricPmf(k, clampedP),
      };
    }),
  };
}

const initialResults = simulateGeometric(0.5, 1000);

export default function GeometricDistribution({
  activeDistribution,
  onDistributionChange,
}: DistributionPageProps) {
  const [p, setP] = useState(0.5);
  const [sampleSize, setSampleSize] = useState(1000);
  const [results, setResults] = useState(initialResults);
  const { chartRef, exportToCSV, exportToPNG } = useChartExport(
    results,
    `geometric_p${p}_N${sampleSize}`,
  );

  const handleSimulate = () => {
    setResults(simulateGeometric(p, Math.max(1, sampleSize)));
  };

  return (
    <DistributionLayout
      activeDistribution={activeDistribution}
      onDistributionChange={onDistributionChange}
    >
      <ChartSection
        title={`Geométrica(p=${p.toFixed(2)})`}
        subtitle={`Frecuencia relativa simulada vs PMF teórica · N = ${sampleSize.toLocaleString('es-MX')}`}
        chartRef={chartRef}
        onExportCSV={exportToCSV}
        onExportPNG={exportToPNG}
      >
        <PmfBarChart data={results.pmf} />
      </ChartSection>

      <ControlsSection description="Modela el número de ensayos de Bernoulli independientes necesarios para obtener el primer éxito. La PMF teórica es P(X=k) = (1−p)^(k−1) · p.">
        <ParameterField
          id="geometric-p"
          label="Probabilidad de éxito (p)"
          type="number"
          min={0.01}
          max={1}
          step={0.01}
          value={p}
          onChange={(e) => setP(parseFloat(e.target.value) || 0.5)}
        />
        <ParameterField
          id="geometric-n"
          label="Tamaño de muestra (N)"
          type="number"
          min={1}
          step={1}
          value={sampleSize}
          onChange={(e) => setSampleSize(Math.max(1, parseInt(e.target.value, 10) || 1))}
        />
        <SimulateButton onClick={handleSimulate} />
      </ControlsSection>

      <SimulationInsights
        results={results}
        sampleSize={sampleSize}
        convergenceHint="Al aumentar N, la media empírica converge a 1/p y las barras simuladas se acercan a la PMF teórica. Prueba N = 50,000 para verlo con claridad."
      />
    </DistributionLayout>
  );
}
