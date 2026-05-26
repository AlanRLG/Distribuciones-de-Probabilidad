import { useCallback, useState } from 'react';
import { distributionApi } from '../api/client';
import { useChartExport } from '../hooks/useChartExport';
import { useSimulation } from '../hooks/useSimulation';
import type { DistributionPageProps } from '../types/distributions';
import { mapPoissonResponse } from '../utils/apiMappers';
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

export default function PoissonDistribution({
  activeDistribution,
  onDistributionChange,
  apiConnected,
}: DistributionPageProps) {
  const [lambda, setLambda] = useState(3);
  const [sampleSize, setSampleSize] = useState(1000);

  const run = useCallback(async () => {
    const response = await distributionApi.poisson(lambda, Math.max(1, sampleSize));
    return mapPoissonResponse(response, lambda);
  }, [lambda, sampleSize]);

  const { results, loading, error, execute } = useSimulation({ run });
  const { chartRef, exportToCSV, exportToPNG } = useChartExport(
    results ?? EMPTY_STATS,
    `poisson_lambda${lambda}_N${sampleSize}`,
  );

  return (
    <DistributionLayout
      activeDistribution={activeDistribution}
      onDistributionChange={onDistributionChange}
      apiConnected={apiConnected}
    >
      <ChartSection
        title={`Poisson(λ=${lambda.toFixed(2)})`}
        subtitle={`Frecuencia relativa simulada vs PMF teórica · N = ${sampleSize.toLocaleString('es-MX')}`}
        chartRef={chartRef}
        onExportCSV={results ? exportToCSV : undefined}
        onExportPNG={exportToPNG}
      >
        {loading || !results ? <ChartLoading /> : <PmfBarChart data={results.pmf} />}
      </ChartSection>

      <ControlsSection description="Modela el número de eventos en un intervalo fijo con tasa λ. La PMF teórica es P(X=k) = e^(−λ) · λ^k / k!.">
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
        <SimulateButton onClick={() => void execute()} loading={loading} />
      </ControlsSection>

      {error && <SimulationError message={error} />}
      {results && (
        <SimulationInsights
          results={results}
          sampleSize={sampleSize}
          convergenceHint="Al aumentar N, la media empírica converge a λ y las barras simuladas se acercan a la PMF teórica."
        />
      )}
    </DistributionLayout>
  );
}
