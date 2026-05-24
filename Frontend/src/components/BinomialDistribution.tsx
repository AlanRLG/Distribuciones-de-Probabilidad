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

function binomialCoeff(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return result;
}

function theoreticalBinomialPmf(n: number, p: number, k: number): number {
  return binomialCoeff(n, k) * p ** k * (1 - p) ** (n - k);
}

function simulateBinomial(n: number, p: number, sampleSize: number): DiscreteSimulationResults {
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

  const stats = computeSampleStats(trialValues);
  const theoreticalVariance = clampedN * clampedP * (1 - clampedP);

  return {
    ...stats,
    theoretical_mean: clampedN * clampedP,
    theoretical_variance: theoreticalVariance,
    theoretical_std: Math.sqrt(theoreticalVariance),
    pmf: Array.from({ length: clampedN + 1 }, (_, k) => ({
      k,
      simulated: counts[k] / nSamples,
      theoretical: theoreticalBinomialPmf(clampedN, clampedP, k),
    })),
  };
}

const initialResults = simulateBinomial(10, 0.5, 1000);

export default function BinomialDistribution({
  activeDistribution,
  onDistributionChange,
}: DistributionPageProps) {
  const [p, setP] = useState(0.5);
  const [n, setN] = useState(10);
  const [sampleSize, setSampleSize] = useState(1000);
  const [results, setResults] = useState(initialResults);
  const { chartRef, exportToCSV, exportToPNG } = useChartExport(
    results,
    `binomial_n${n}_p${p}_N${sampleSize}`,
  );

  const handleSimulate = () => {
    setResults(simulateBinomial(n, p, Math.max(1, sampleSize)));
  };

  return (
    <DistributionLayout
      activeDistribution={activeDistribution}
      onDistributionChange={onDistributionChange}
    >
      <ChartSection
        title={`Binomial(n=${n}, p=${p.toFixed(2)})`}
        subtitle={`Frecuencia relativa simulada vs PMF teórica · N = ${sampleSize.toLocaleString('es-MX')}`}
        chartRef={chartRef}
        onExportCSV={exportToCSV}
        onExportPNG={exportToPNG}
      >
        <PmfBarChart data={results.pmf} />
      </ChartSection>

      <ControlsSection description="Número de éxitos en n ensayos independientes con probabilidad p. La PMF teórica es P(X=k) = C(n,k) · p^k · (1−p)^(n−k).">
        <ParameterField
          id="binomial-p"
          label="Probabilidad de éxito (p)"
          type="number"
          min={0}
          max={1}
          step={0.01}
          value={p}
          onChange={(e) => setP(parseFloat(e.target.value) || 0)}
        />
        <ParameterField
          id="binomial-n"
          label="Número de ensayos (n)"
          type="number"
          min={1}
          max={50}
          step={1}
          value={n}
          onChange={(e) => setN(Math.max(1, parseInt(e.target.value, 10) || 1))}
        />
        <ParameterField
          id="binomial-N"
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
        convergenceHint="Al aumentar N, la media empírica converge a n·p y las barras simuladas se acercan a la PMF teórica. Prueba N = 50,000 para verlo con claridad."
      />
    </DistributionLayout>
  );
}
