import { useCallback, useState } from 'react';
import { distributionApi } from '../api/client';
import { useChartExport } from '../hooks/useChartExport';
import { useSimulation } from '../hooks/useSimulation';
import type { DistributionPageProps } from '../types/distributions';
import { mapGeometricResponse } from '../utils/apiMappers';
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

export default function GeometricDistribution({
  activeDistribution,
  onDistributionChange,
  apiConnected,
}: DistributionPageProps) {
  const [p, setP] = useState(0.5);
  const [sampleSize, setSampleSize] = useState(1000);

  const run = useCallback(async () => {
    const response = await distributionApi.geometrica(p, Math.max(1, sampleSize));
    return mapGeometricResponse(response, p);
  }, [p, sampleSize]);

  const { results, loading, error, execute } = useSimulation({ run });
  const { chartRef, exportToCSV, exportToPNG } = useChartExport(
    results ?? EMPTY_STATS,
    `geometric_p${p}_N${sampleSize}`,
  );

  return (
    <DistributionLayout
      activeDistribution={activeDistribution}
      onDistributionChange={onDistributionChange}
      apiConnected={apiConnected}
    >
      <ChartSection
        title={`Geométrica(p=${p.toFixed(2)})`}
        subtitle={`Frecuencia relativa simulada vs PMF teórica · N = ${sampleSize.toLocaleString('es-MX')}`}
        chartRef={chartRef}
        onExportCSV={results ? exportToCSV : undefined}
        onExportPNG={exportToPNG}
      >
        {loading || !results ? <ChartLoading /> : <PmfBarChart data={results.pmf} />}
      </ChartSection>

      <ControlsSection description="Modela el número de ensayos necesarios para el primer éxito. La PMF teórica es P(X=k) = (1−p)^(k−1) · p.">
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
        <SimulateButton onClick={() => void execute()} loading={loading} />
      </ControlsSection>

      {error && <SimulationError message={error} />}
      {results && (
        <SimulationInsights
          results={results}
          sampleSize={sampleSize}
          convergenceHint="Al aumentar N, la media empírica converge a 1/p y las barras simuladas se acercan a la PMF teórica."
        />
      )}
    </DistributionLayout>
  );
}
