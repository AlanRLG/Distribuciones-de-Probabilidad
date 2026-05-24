import { useState, type ComponentType } from 'react';
import BernoulliDistribution from './components/BernoulliDistribution';
import BinomialDistribution from './components/BinomialDistribution';
import PoissonDistribution from './components/PoissonDistribution';
import GeometricDistribution from './components/GeometricDistribution';
import NormalDistribution from './components/NormalDistribution';
import ExponentialDistribution from './components/ExponentialDistribution';
import UniformDistribution from './components/UniformDistribution';
import type { DistributionId, DistributionPageProps } from './types/distributions';

const DISTRIBUTION_COMPONENTS: Record<
  DistributionId,
  ComponentType<DistributionPageProps>
> = {
  bernoulli: BernoulliDistribution,
  binomial: BinomialDistribution,
  poisson: PoissonDistribution,
  geometric: GeometricDistribution,
  normal: NormalDistribution,
  exponential: ExponentialDistribution,
  uniform: UniformDistribution,
};

function App() {
  const [distribution, setDistribution] = useState<DistributionId>('bernoulli');
  const ActiveDistribution = DISTRIBUTION_COMPONENTS[distribution];

  return (
    <ActiveDistribution
      activeDistribution={distribution}
      onDistributionChange={setDistribution}
    />
  );
}

export default App;
