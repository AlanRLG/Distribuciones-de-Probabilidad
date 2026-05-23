import { useState } from 'react';
import BernoulliDistribution from './components/BernoulliDistribution';
import BinomialDistribution from './components/BinomialDistribution';
import type { DistributionId } from './types/distributions';
import PoissonDistribution from './components/PoissonDistribution';

function App() {
  const [distribution, setDistribution] = useState<DistributionId>('bernoulli');

  const handleDistributionChange = (id: DistributionId) => {
    setDistribution(id);
  };

  if (distribution === 'binomial') {
    return (
      <BinomialDistribution
        activeDistribution={distribution}
        onDistributionChange={handleDistributionChange}
      />
    );
  }
  if (distribution === 'poisson'){
    return(
      <PoissonDistribution
      activeDistribution={distribution}
      onDistributionChange={handleDistributionChange}
      />
    );
  }

  return (
    <BernoulliDistribution
      activeDistribution={distribution}
      onDistributionChange={handleDistributionChange}
    />
  );
}

export default App;
