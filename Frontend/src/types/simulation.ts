export interface SimulationStats {
  empirical_mean: number;
  theoretical_mean: number;
  empirical_variance: number;
  theoretical_variance: number;
  empirical_std: number;
  theoretical_std: number;
}

export interface PmfPoint {
  k: number;
  simulated: number;
  theoretical: number;
}

export interface PdfPoint {
  x: number;
  simulated: number;
  theoretical: number;
  simulated_cdf?: number;
  theoretical_cdf?: number;
}

export interface DiscreteSimulationResults extends SimulationStats {
  pmf: PmfPoint[];
}

export interface ContinuousSimulationResults extends SimulationStats {
  pdf: PdfPoint[];
}
