import { useCallback, useState } from 'react';
import { distributionApi } from '../api/client';
import { useChartExport } from '../hooks/useChartExport';
import { useSimulation } from '../hooks/useSimulation';
import type { DistributionPageProps } from '../types/distributions';
import { mapNormalResponse } from '../utils/apiMappers';
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

export default function NormalDistribution({
  activeDistribution,
  onDistributionChange,
  apiConnected,
}: DistributionPageProps) {
  const [mean, setMean] = useState(0);
  const [std, setStd] = useState(1);
  const [sampleSize, setSampleSize] = useState(5000);

  const run = useCallback(async () => {
    const response = await distributionApi.normal(mean, Math.max(0.1, std), Math.max(100, sampleSize));
    return mapNormalResponse(response);
  }, [mean, std, sampleSize]);

  const { results, loading, error, execute } = useSimulation({ run });
  const { chartRef, exportToCSV, exportToPNG } = useChartExport(
    results ?? EMPTY_STATS,
    `normal_mu${mean}_sigma${std}_N${sampleSize}`,
  );

  return (
    <DistributionLayout
      activeDistribution={activeDistribution}
      onDistributionChange={onDistributionChange}
      apiConnected={apiConnected}
    >
      <ChartSection
        title={`Normal(μ=${mean}, σ=${std})`}
        subtitle={`Densidad simulada vs PDF teórica · N = ${sampleSize.toLocaleString('es-MX')}`}
        chartRef={chartRef}
        onExportCSV={results ? exportToCSV : undefined}
        onExportPNG={exportToPNG}
      >
        {loading || !results ? <ChartLoading /> : <PdfLineChart data={results.pdf} />}
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
        <SimulateButton onClick={() => void execute()} loading={loading} />
      </ControlsSection>

      {error && <SimulationError message={error} />}
      {results && (
        <SimulationInsights
          results={results}
          sampleSize={sampleSize}
          convergenceHint="Al aumentar N, la curva simulada se acerca a la PDF teórica y los estadísticos empíricos convergen a μ y σ²."
        />
      )}
    </DistributionLayout>
  );
}
