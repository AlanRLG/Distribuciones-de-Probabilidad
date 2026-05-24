import { useRef } from 'react';
import { exportChartToPNG, exportStatsToCSV } from '../utils/export';
import type { SimulationStats } from '../types/simulation';

export function useChartExport(results: SimulationStats, baseFilename: string) {
  const chartRef = useRef<HTMLDivElement>(null);

  const exportToCSV = () => {
    exportStatsToCSV(results, `${baseFilename}.csv`);
  };

  const exportToPNG = () => {
    void exportChartToPNG(chartRef.current, `${baseFilename}.png`);
  };

  return { chartRef, exportToCSV, exportToPNG };
}
