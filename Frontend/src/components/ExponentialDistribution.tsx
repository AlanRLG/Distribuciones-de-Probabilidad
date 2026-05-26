import { useCallback, useState } from 'react';
import { distributionApi } from '../api/client';
import { useChartExport } from '../hooks/useChartExport';
import { useSimulation } from '../hooks/useSimulation';
import type { DistributionPageProps } from '../types/distributions';
import { mapExponentialResponse } from '../utils/apiMappers';
import ChartLoading from './shared/ChartLoading';
import ChartSection from './shared/ChartSection';
import ControlsSection from './shared/ControlsSection';
import DistributionLayout from './shared/DistributionLayout';
import ParameterField from './shared/ParameterField';
import PdfLineChart from './shared/PdfLineChart';
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

export default function ExponentialDistribution({
  activeDistribution,
  onDistributionChange,
  apiConnected,
}: DistributionPageProps) {
  const [media, setMedia] = useState(1);
  const [sampleSize, setSampleSize] = useState(5000);

  const run = useCallback(async () => {
    const clampedMedia = Math.max(0.1, media);
    const response = await distributionApi.exponencial(clampedMedia, Math.max(100, sampleSize));
    return mapExponentialResponse(response, clampedMedia);
  }, [media, sampleSize]);

  const { results, loading, error, execute } = useSimulation({ run });
  const { chartRef, exportToCSV, exportToPNG } = useChartExport(
    results ?? EMPTY_STATS,
    `exponential_media${media}_N${sampleSize}`,
  );

  return (
    <DistributionLayout
      activeDistribution={activeDistribution}
      onDistributionChange={onDistributionChange}
      apiConnected={apiConnected}
    >
      <ChartSection
        title={`Exponencial(μ=${media.toFixed(2)})`}
        subtitle={`PDF y CDF simuladas vs teóricas · N = ${sampleSize.toLocaleString('es-MX')}`}
        chartRef={chartRef}
        onExportCSV={results ? exportToCSV : undefined}
        onExportPNG={exportToPNG}
      >
        {loading || !results ? (
          <ChartLoading />
        ) : (
          <PdfLineChart data={results.pdf} showCdf />
        )}
      </ChartSection>

      <ControlsSection description="Modela el tiempo entre eventos en un proceso de Poisson. El parámetro μ es la media (escala); la tasa es λ = 1/μ.">
        <ParameterField
          id="exponential-media"
          label="Media (μ)"
          type="number"
          min={0.1}
          step={0.1}
          value={media}
          onChange={(e) => setMedia(Math.max(0.1, parseFloat(e.target.value) || 1))}
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
        <SimulateButton onClick={() => void execute()} loading={loading} />
      </ControlsSection>

      {error && <SimulationError message={error} />}
      {results && (
        <SimulationInsights
          results={results}
          sampleSize={sampleSize}
          convergenceHint="Al aumentar N, la densidad y la función acumulada simuladas convergen a sus valores teóricos."
        />
      )}
    </DistributionLayout>
  );
}
