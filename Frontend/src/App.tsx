import { useState } from 'react';
import BernoulliDistribution from './components/BernoulliDistribution';
import BinomialDistribution from './components/BinomialDistribution';
import type { DistributionId } from './types/distributions';
import PoissonDistribution from './components/PoissonDistribution';
import NormalDistribution from './components/NormalDistribution';
import GeometricDistribution from './components/GeometricDistribution';
import ExponentialDistribution from './components/ExponentialDistribution';

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

  if(distribution === 'geometric'){
    return(
      <GeometricDistribution
      activeDistribution={distribution}
      onDistributionChange={handleDistributionChange}
      />
    )
  }
  
  if(distribution === 'normal'){
    return(
      <NormalDistribution
      activeDistribution={distribution}
      onDistributionChange={handleDistributionChange}
      />
    )
  }
  
  if(distribution === 'exponential'){
    return(
      <ExponentialDistribution
      activeDistribution={distribution}
      onDistributionChange={handleDistributionChange}
      />
    )
  }
  
  return (
    <BernoulliDistribution
      activeDistribution={distribution}
      onDistributionChange={handleDistributionChange}
    />
  );
}

export default App;
