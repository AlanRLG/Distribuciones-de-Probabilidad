export const DISTRIBUTIONS = [
  { id: 'bernoulli', label: 'Bernoulli', available: true },
  { id: 'binomial', label: 'Binomial', available: true },
  { id: 'poisson', label: 'Poisson', available: true },
  { id: 'geometric', label: 'Geométrica', available: true },
  { id: 'normal', label: 'Normal', available: true },
  { id: 'exponential', label: 'Exponencial', available: true },
  { id: 'uniform', label: 'Uniforme', available: true },
] as const;

export type DistributionId = (typeof DISTRIBUTIONS)[number]['id'];

export interface DistributionPageProps {
  activeDistribution: DistributionId | string;
  onDistributionChange: (id: DistributionId) => void;
  apiConnected?: boolean;
}
