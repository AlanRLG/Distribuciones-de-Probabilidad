import { useCallback, useState } from 'react';
import { distributionApi } from '../api/client';
import { useChartExport } from '../hooks/useChartExport';
import { useSimulation } from '../hooks/useSimulation';
import type { DistributionPageProps } from '../types/distributions';
import { mapBinomialResponse } from '../utils/apiMappers';
import ChartLoading from './shared/ChartLoading';
import ChartSection from './shared/ChartSection';
import ControlsSection from './shared/ControlsSection';
import DistributionLayout from './shared/DistributionLayout';
import ParameterField from './shared/ParameterField';
import PmfBarChart from './shared/PmfBarChart';
import SimulateButton from './shared/SimulateButton';
import SimulationError from './shared/SimulationError';
import SimulationInsights from './shared/SimulationInsights';

const EMPTY_STATS = {
  empirical_mean: 0,
  theoretical_mean: 0,
  empirical_variance: 0,
  theoretical_variance: 0,
  empirical_std: 0,
  theoretical_std: 0,
};

export default function BinomialDistribution({
  activeDistribution,
  onDistributionChange,
  apiConnected,
}: DistributionPageProps) {
  const [p, setP] = useState(0.5);
  const [n, setN] = useState(10);
  const [sampleSize, setSampleSize] = useState(1000);

  const run = useCallback(async () => {
    const response = await distributionApi.binomial(n, p, Math.max(1, sampleSize));
    return mapBinomialResponse(response, n, p);
  }, [n, p, sampleSize]);

  const { results, loading, error, execute } = useSimulation({ run });
  const { chartRef, exportToCSV, exportToPNG } = useChartExport(
    results ?? EMPTY_STATS,
    `binomial_n${n}_p${p}_N${sampleSize}`,
  );

  return (
    <DistributionLayout
      activeDistribution={activeDistribution}
      onDistributionChange={onDistributionChange}
      apiConnected={apiConnected}
    >
      <ChartSection
        title={`Binomial(n=${n}, p=${p.toFixed(2)})`}
        subtitle={`Frecuencia relativa simulada vs PMF teórica · N = ${sampleSize.toLocaleString('es-MX')}`}
        chartRef={chartRef}
        onExportCSV={results ? exportToCSV : undefined}
        onExportPNG={exportToPNG}
      >
        {loading || !results ? <ChartLoading /> : <PmfBarChart data={results.pmf} />}
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
        <SimulateButton onClick={() => void execute()} loading={loading} />
      </ControlsSection>

      {error && <SimulationError message={error} />}
      {results && (
        <SimulationInsights
          results={results}
          sampleSize={sampleSize}
          convergenceHint="Al aumentar N, la media empírica converge a n·p y las barras simuladas se acercan a la PMF teórica."
        />
      )}
    </DistributionLayout>
  );
}
