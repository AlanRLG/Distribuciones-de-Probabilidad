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

function simulateBernoulli(p: number, sampleSize: number): DiscreteSimulationResults {
  const clampedP = Math.min(1, Math.max(0, p));
  const samples: number[] = Array.from({ length: sampleSize }, () =>
    Math.random() < clampedP ? 1 : 0,
  );
  const count1 = samples.reduce((acc, value) => acc + value, 0);
  const count0 = sampleSize - count1;
  const stats = computeSampleStats(samples);

  return {
    ...stats,
    theoretical_mean: clampedP,
    theoretical_variance: clampedP * (1 - clampedP),
    theoretical_std: Math.sqrt(clampedP * (1 - clampedP)),
    pmf: [
      { k: 0, simulated: count0 / sampleSize, theoretical: 1 - clampedP },
      { k: 1, simulated: count1 / sampleSize, theoretical: clampedP },
    ],
  };
}

const initialResults = simulateBernoulli(0.5, 1000);

export default function BernoulliDistribution({
  activeDistribution,
  onDistributionChange,
}: DistributionPageProps) {
  const [p, setP] = useState(0.5);
  const [sampleSize, setSampleSize] = useState(1000);
  const [results, setResults] = useState(initialResults);
  const { chartRef, exportToCSV, exportToPNG } = useChartExport(
    results,
    `bernoulli_p${p}_N${sampleSize}`,
  );

  const handleSimulate = () => {
    setResults(simulateBernoulli(p, Math.max(1, sampleSize)));
  };

  return (
    <DistributionLayout
      activeDistribution={activeDistribution}
      onDistributionChange={onDistributionChange}
    >
      <ChartSection
        title={`Bernoulli(p=${p.toFixed(2)})`}
        subtitle={`Frecuencia relativa simulada vs PMF teórica · N = ${sampleSize.toLocaleString('es-MX')}`}
        chartRef={chartRef}
        onExportCSV={exportToCSV}
        onExportPNG={exportToPNG}
      >
        <PmfBarChart data={results.pmf} />
      </ChartSection>

      <ControlsSection description="Un ensayo con dos resultados (0 = fracaso, 1 = éxito). La PMF teórica es P(X=1)=p y P(X=0)=1−p.">
        <ParameterField
          id="bernoulli-p"
          label="Probabilidad de éxito (p)"
          type="number"
          min={0}
          max={1}
          step={0.01}
          value={p}
          onChange={(e) => setP(parseFloat(e.target.value) || 0)}
        />
        <ParameterField
          id="bernoulli-n"
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
        convergenceHint="Al aumentar N, la media empírica converge a p y las barras simuladas se acercan a la PMF teórica. Prueba N = 50,000 para verlo con claridad."
      />
    </DistributionLayout>
  );
}
