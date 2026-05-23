export const DISTRIBUTIONS = [
  { id: 'bernoulli', label: 'Bernoulli', available: true },
  { id: 'binomial', label: 'Binomial', available: true },
  { id: 'poisson', label: 'Poisson', available: true },
  { id: 'geometric', label: 'Geométrica', available: false },
  { id: 'normal', label: 'Normal', available: false },
  { id: 'exponential', label: 'Exponencial', available: false },
  { id: 'uniform', label: 'Uniforme', available: false },
] as const;

export type DistributionId = (typeof DISTRIBUTIONS)[number]['id'];

export interface DistributionPageProps {
  activeDistribution: DistributionId | string;
  onDistributionChange: (id: DistributionId) => void;
}
