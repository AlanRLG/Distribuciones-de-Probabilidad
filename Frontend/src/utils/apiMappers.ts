import type { BackendSimulationResponse } from '../api/types';
import type {
  ContinuousSimulationResults,
  DiscreteSimulationResults,
  PdfPoint,
  PmfPoint,
  SimulationStats,
} from '../types/simulation';
import { factorial } from './statistics';

export function mapStatsFromBackend(response: BackendSimulationResponse): SimulationStats {
  return {
    empirical_mean: response.simulado.media,
    empirical_variance: response.simulado.varianza,
    empirical_std: response.simulado.desviacion_estandar,
    theoretical_mean: response.teorico.media,
    theoretical_variance: response.teorico.varianza,
    theoretical_std: response.teorico.desviacion_estandar,
  };
}

export function buildPmf(
  datos: number[],
  kMin: number,
  kMax: number,
  theoretical: (k: number) => number,
): PmfPoint[] {
  const frequencies = new Map<number, number>();
  datos.forEach((value) => {
    frequencies.set(value, (frequencies.get(value) ?? 0) + 1);
  });

  const sampleSize = datos.length || 1;

  return Array.from({ length: kMax - kMin + 1 }, (_, index) => {
    const k = kMin + index;
    return {
      k,
      simulated: (frequencies.get(k) ?? 0) / sampleSize,
      theoretical: theoretical(k),
    };
  });
}

function estimateBandwidth(samples: number[]): number {
  if (samples.length === 0) return 1;
  const mean = samples.reduce((acc, value) => acc + value, 0) / samples.length;
  const variance =
    samples.reduce((acc, value) => acc + (value - mean) ** 2, 0) / samples.length;
  const std = Math.sqrt(variance);
  return Math.max(std / 4, 0.01);
}

export function buildPdfFromBackend(
  response: BackendSimulationResponse,
  options?: {
    includeCdf?: boolean;
    theoreticalCdf?: (x: number) => number;
  },
): PdfPoint[] {
  const datos = response.simulado.datos ?? [];
  const xVals = response.teorico.x_vals ?? [];
  const yVals = response.teorico.y_vals ?? [];
  const sampleSize = datos.length || 1;
  const bandwidth = estimateBandwidth(datos);

  return xVals.map((x, index) => {
    const theoretical = yVals[index] ?? 0;
    const simulated =
      sampleSize > 0
        ? datos.filter((sample) => sample >= x - bandwidth && sample < x + bandwidth).length /
          sampleSize /
          (2 * bandwidth)
        : 0;

    const point: PdfPoint = {
      x: Number(x.toFixed(2)),
      simulated,
      theoretical,
    };

    if (options?.includeCdf && options.theoreticalCdf) {
      point.simulated_cdf = datos.filter((sample) => sample <= x).length / sampleSize;
      point.theoretical_cdf = options.theoreticalCdf(x);
    }

    return point;
  });
}

function binomialCoeff(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return result;
}

export function mapBernoulliResponse(
  response: BackendSimulationResponse,
  p: number,
): DiscreteSimulationResults {
  const datos = response.simulado.datos ?? [];
  return {
    ...mapStatsFromBackend(response),
    pmf: buildPmf(datos, 0, 1, (k) => (k === 1 ? p : 1 - p)),
  };
}

export function mapBinomialResponse(
  response: BackendSimulationResponse,
  n: number,
  p: number,
): DiscreteSimulationResults {
  const datos = response.simulado.datos ?? [];
  return {
    ...mapStatsFromBackend(response),
    pmf: buildPmf(datos, 0, n, (k) => binomialCoeff(n, k) * p ** k * (1 - p) ** (n - k)),
  };
}

export function mapPoissonResponse(
  response: BackendSimulationResponse,
  lambda: number,
): DiscreteSimulationResults {
  const datos = response.simulado.datos ?? [];
  const maxK = Math.min(20, Math.max(5, Math.ceil(lambda + 4 * Math.sqrt(lambda))));
  return {
    ...mapStatsFromBackend(response),
    pmf: buildPmf(datos, 0, maxK, (k) => (Math.exp(-lambda) * lambda ** k) / factorial(k)),
  };
}

export function mapGeometricResponse(
  response: BackendSimulationResponse,
  p: number,
): DiscreteSimulationResults {
  const datos = response.simulado.datos ?? [];
  const maxK = 10;
  return {
    ...mapStatsFromBackend(response),
    pmf: buildPmf(datos, 1, maxK, (k) => (1 - p) ** (k - 1) * p),
  };
}

export function mapNormalResponse(response: BackendSimulationResponse): ContinuousSimulationResults {
  return {
    ...mapStatsFromBackend(response),
    pdf: buildPdfFromBackend(response),
  };
}

export function mapExponentialResponse(
  response: BackendSimulationResponse,
  media: number,
): ContinuousSimulationResults {
  const rate = 1 / media;
  return {
    ...mapStatsFromBackend(response),
    pdf: buildPdfFromBackend(response, {
      includeCdf: true,
      theoreticalCdf: (x) => (x < 0 ? 0 : 1 - Math.exp(-rate * x)),
    }),
  };
}

export function mapUniformResponse(
  response: BackendSimulationResponse,
  a: number,
  b: number,
): ContinuousSimulationResults {
  return {
    ...mapStatsFromBackend(response),
    pdf: buildPdfFromBackend(response, {
      includeCdf: true,
      theoreticalCdf: (x) => {
        if (x < a) return 0;
        if (x > b) return 1;
        return (x - a) / (b - a);
      },
    }),
  };
}
