import html2canvas from 'html2canvas';
import type { SimulationStats } from '../types/simulation';

export function exportStatsToCSV(
  results: SimulationStats,
  filename: string,
): void {
  const data = [
    ['Concepto', 'Teorico', 'Simulado', 'Error'],
    [
      'Media',
      results.theoretical_mean.toFixed(4),
      results.empirical_mean.toFixed(4),
      Math.abs(results.empirical_mean - results.theoretical_mean).toFixed(4),
    ],
    [
      'Varianza',
      results.theoretical_variance.toFixed(4),
      results.empirical_variance.toFixed(4),
      Math.abs(results.empirical_variance - results.theoretical_variance).toFixed(4),
    ],
    [
      'Desviación estándar ',
      results.theoretical_std.toFixed(4),
      results.empirical_std.toFixed(4),
      Math.abs(results.empirical_std - results.theoretical_std).toFixed(4),
    ],
  ];

  const blob = new Blob([data.map((row) => row.join(',')).join('\n')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

export async function exportChartToPNG(
  element: HTMLElement | null,
  filename: string,
): Promise<void> {
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#0f1520',
      scale: 2,
    });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
  } catch (error) {
    console.error('Error al exportar PNG:', error);
  }
}

export function relativeMeanError(results: SimulationStats): number {
  return results.theoretical_mean > 0
    ? (Math.abs(results.empirical_mean - results.theoretical_mean) / results.theoretical_mean) * 100
    : 0;
}
