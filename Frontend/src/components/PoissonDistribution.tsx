import { useState } from 'react';
import type { DistributionPageProps } from '../types/distributions';
import type { DiscreteSimulationResults } from '../types/simulation';
import { computeSampleStats, factorial } from '../utils/statistics';
import { useChartExport } from '../hooks/useChartExport';
import DistributionLayout from './shared/DistributionLayout';
import ChartSection from './shared/ChartSection';
import ControlsSection from './shared/ControlsSection';
import ParameterField from './shared/ParameterField';
import SimulateButton from './shared/SimulateButton';
import PmfBarChart from './shared/PmfBarChart';
import SimulationInsights from './shared/SimulationInsights';

function poissonPmf(k: number, lambda: number): number {
  return (Math.exp(-lambda) * lambda ** k) / factorial(k);
}

function poissonRandom(lambda: number): number {
  const limit = Math.exp(-lambda);
  let k = 0;
  let product = 1;

  do {
    k++;
    product *= Math.random();
  } while (product > limit);

  return k - 1;
}

function simulatePoisson(lambda: number, sampleSize: number): DiscreteSimulationResults {
  const clampedLambda = Math.max(0.01, lambda);
  const samples = Array.from({ length: sampleSize }, () => poissonRandom(clampedLambda));
  const stats = computeSampleStats(samples);
  const maxK = Math.min(20, Math.ceil(clampedLambda + 4 * Math.sqrt(clampedLambda)));

  const frequencies = new Array<number>(maxK + 1).fill(0);
  samples.forEach((value) => {
    if (value <= maxK) {
      frequencies[value]++;
    }
  });

  return {
    ...stats,
    theoretical_mean: clampedLambda,
    theoretical_variance: clampedLambda,
    theoretical_std: Math.sqrt(clampedLambda),
    pmf: Array.from({ length: maxK + 1 }, (_, k) => ({
      k,
      simulated: frequencies[k] / sampleSize,
      theoretical: poissonPmf(k, clampedLambda),
    })),
  };
}

const initialResults = simulatePoisson(3, 1000);

export default function PoissonDistribution({
  activeDistribution,
  onDistributionChange,
}: DistributionPageProps) {
  const [lambda, setLambda] = useState(3);
  const [sampleSize, setSampleSize] = useState(1000);
  const [results, setResults] = useState(initialResults);
  const { chartRef, exportToCSV, exportToPNG } = useChartExport(
    results,
    `poisson_lambda${lambda}_N${sampleSize}`,
  );

  const handleSimulate = () => {
    setResults(simulatePoisson(lambda, Math.max(1, sampleSize)));
  };

  return (
    <DistributionLayout
      activeDistribution={activeDistribution}
      onDistributionChange={onDistributionChange}
    >
      <ChartSection
        title={`Poisson(λ=${lambda.toFixed(2)})`}
        subtitle={`Frecuencia relativa simulada vs PMF teórica · N = ${sampleSize.toLocaleString('es-MX')}`}
        chartRef={chartRef}
        onExportCSV={exportToCSV}
        onExportPNG={exportToPNG}
      >
        <PmfBarChart data={results.pmf} />
      </ChartSection>

      <ControlsSection description="Modela el número de eventos en un intervalo fijo cuando los eventos ocurren con tasa λ. La PMF teórica es P(X=k) = e^(−λ) · λ^k / k!.">
        <ParameterField
          id="poisson-lambda"
          label="Tasa media (λ)"
          type="number"
          min={0.01}
          step={0.1}
          value={lambda}
          onChange={(e) => setLambda(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
        />
        <ParameterField
          id="poisson-n"
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
        convergenceHint="Al aumentar N, la media empírica converge a λ y las barras simuladas se acercan a la PMF teórica. Prueba N = 50,000 para verlo con claridad."
      />
    </DistributionLayout>
  );
}
