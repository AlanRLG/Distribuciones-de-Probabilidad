import { useState } from 'react';
import type { DistributionPageProps } from '../types/distributions';
import type { ContinuousSimulationResults } from '../types/simulation';
import { computeSampleStats } from '../utils/statistics';
import { useChartExport } from '../hooks/useChartExport';
import DistributionLayout from './shared/DistributionLayout';
import ChartSection from './shared/ChartSection';
import ControlsSection from './shared/ControlsSection';
import ParameterField from './shared/ParameterField';
import SimulateButton from './shared/SimulateButton';
import PdfLineChart from './shared/PdfLineChart';
import SimulationInsights from './shared/SimulationInsights';

function randomUniform(a: number, b: number): number {
  return a + (b - a) * Math.random();
}

function uniformPdf(a: number, b: number, x: number): number {
  if (x < a || x > b) return 0;
  return 1 / (b - a);
}

function uniformCdf(a: number, b: number, x: number): number {
  if (x < a) return 0;
  if (x > b) return 1;
  return (x - a) / (b - a);
}

function simulateUniform(a: number, b: number, sampleSize: number): ContinuousSimulationResults {
  const samples = Array.from({ length: sampleSize }, () => randomUniform(a, b));
  const stats = computeSampleStats(samples);
  const theoreticalVariance = (b - a) ** 2 / 12;
  const pdf: ContinuousSimulationResults['pdf'] = [];
  const minX = a - 1;
  const maxX = b + 1;
  const step = (maxX - minX) / 100;

  for (let x = minX; x <= maxX; x += step) {
    const bandwidth = (b - a) / 20;
    const simulated =
      samples.filter((sample) => sample >= x - bandwidth && sample < x + bandwidth).length /
      sampleSize /
      (2 * bandwidth);

    pdf.push({
      x: Number(x.toFixed(2)),
      simulated,
      theoretical: uniformPdf(a, b, x),
      simulated_cdf: samples.filter((sample) => sample <= x).length / sampleSize,
      theoretical_cdf: uniformCdf(a, b, x),
    });
  }

  return {
    ...stats,
    theoretical_mean: (a + b) / 2,
    theoretical_variance: theoreticalVariance,
    theoretical_std: Math.sqrt(theoreticalVariance),
    pdf,
  };
}

const initialResults = simulateUniform(1, 5, 5000);

export default function UniformDistribution({
  activeDistribution,
  onDistributionChange,
}: DistributionPageProps) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(5);
  const [sampleSize, setSampleSize] = useState(5000);
  const [results, setResults] = useState(initialResults);
  const { chartRef, exportToCSV, exportToPNG } = useChartExport(
    results,
    `uniform_a${a}_b${b}_N${sampleSize}`,
  );

  const handleSimulate = () => {
    if (a >= b) {
      alert('El límite superior (b) debe ser estrictamente mayor que el límite inferior (a).');
      return;
    }
    setResults(simulateUniform(a, b, Math.max(100, sampleSize)));
  };

  return (
    <DistributionLayout
      activeDistribution={activeDistribution}
      onDistributionChange={onDistributionChange}
    >
      <ChartSection
        title={`Uniforme(a=${a}, b=${b})`}
        subtitle={`PDF y CDF simuladas vs teóricas · N = ${sampleSize.toLocaleString('es-MX')}`}
        chartRef={chartRef}
        onExportCSV={exportToCSV}
        onExportPNG={exportToPNG}
      >
        <PdfLineChart data={results.pdf} showCdf pdfLineType="step" />
      </ChartSection>

      <ControlsSection description="Todos los valores en el intervalo [a, b] tienen la misma probabilidad. La media teórica es (a+b)/2 y la varianza es (b−a)²/12.">
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
        <SimulateButton onClick={handleSimulate} />
      </ControlsSection>

      <SimulationInsights
        results={results}
        sampleSize={sampleSize}
        convergenceHint="Al aumentar N, la densidad y la función acumulada simuladas convergen a la forma rectangular y trapezoidal teóricas."
      />
    </DistributionLayout>
  );
}
