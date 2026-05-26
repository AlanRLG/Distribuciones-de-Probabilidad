import { useCallback, useState } from 'react';
import { distributionApi } from '../api/client';
import { useChartExport } from '../hooks/useChartExport';
import { useSimulation } from '../hooks/useSimulation';
import type { DistributionPageProps } from '../types/distributions';
import { mapUniformResponse } from '../utils/apiMappers';
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

export default function UniformDistribution({
  activeDistribution,
  onDistributionChange,
  apiConnected,
}: DistributionPageProps) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(5);
  const [sampleSize, setSampleSize] = useState(5000);
  const isValidRange = b > a;

  const run = useCallback(async () => {
    if (a >= b) {
      throw new Error('El límite superior (b) debe ser estrictamente mayor que el límite inferior (a).');
    }
    const response = await distributionApi.uniforme(a, b, Math.max(100, sampleSize));
    return mapUniformResponse(response, a, b);
  }, [a, b, sampleSize]);

  const { results, loading, error, execute } = useSimulation({ run });
  const { chartRef, exportToCSV, exportToPNG } = useChartExport(
    results ?? EMPTY_STATS,
    `uniform_a${a}_b${b}_N${sampleSize}`,
  );

  return (
    <DistributionLayout
      activeDistribution={activeDistribution}
      onDistributionChange={onDistributionChange}
      apiConnected={apiConnected}
    >
      <ChartSection
        title={`Uniforme(a=${a}, b=${b})`}
        subtitle={`PDF y CDF simuladas vs teóricas · N = ${sampleSize.toLocaleString('es-MX')}`}
        chartRef={chartRef}
        onExportCSV={results ? exportToCSV : undefined}
        onExportPNG={exportToPNG}
      >
        {loading || !results ? (
          <ChartLoading />
        ) : (
          <PdfLineChart data={results.pdf} showCdf pdfLineType="step" />
        )}
      </ChartSection>

      <ControlsSection description="Todos los valores en [a, b] tienen la misma probabilidad. La media teórica es (a+b)/2 y la varianza es (b−a)²/12.">
        <ParameterField
          id="uniform-a"
          label="Límite inferior (a)"
          type="number"
          step={0.1}
          value={a}
          onChange={(e) => setA(parseFloat(e.target.value) || 0)}
        />
        <ParameterField
          id="uniform-b"
          label="Límite superior (b)"
          type="number"
          step={0.1}
          value={b}
          onChange={(e) => setB(parseFloat(e.target.value) || 1)}
        />
        <ParameterField
          id="uniform-n"
          label="Tamaño de muestra (N)"
          type="number"
          min={100}
          step={100}
          value={sampleSize}
          onChange={(e) => setSampleSize(Math.max(100, parseInt(e.target.value, 10) || 1000))}
        />
        
        <SimulateButton onClick={() => void execute()} loading={loading} disabled={!isValidRange}/>
        {!isValidRange && <p style={{ color: 'red' }}>El límite superior (b) debe ser mayor que el límite inferior (a).</p>}
      </ControlsSection>

      {error && <SimulationError message={error} />}
      {results && (
        <SimulationInsights
          results={results}
          sampleSize={sampleSize}
          convergenceHint="Al aumentar N, la densidad y la CDF simuladas convergen a la forma teórica."
        />
      )}
    </DistributionLayout>
  );
}
