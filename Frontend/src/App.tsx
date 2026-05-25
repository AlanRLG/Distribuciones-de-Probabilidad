import { useState, type ComponentType, useEffect } from 'react';
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
  const [mensaje, setMensaje] = useState('')
  const [distribution, setDistribution] = useState<DistributionId>('bernoulli');
  const ActiveDistribution = DISTRIBUTION_COMPONENTS[distribution];

  useEffect(() => {
    fetch('http://127.0.0.1:8000/')
      .then(res => res.json())
      .then(data => {
        setMensaje(data.message)
      })
  }, [])

  return (
    <div>
      <h1>{mensaje}</h1>
      <ActiveDistribution
      activeDistribution={distribution}
        onDistributionChange={setDistribution}
      />
    </div>
  );
}

export default App;
