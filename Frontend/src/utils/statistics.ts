export function computeSampleStats(samples: number[]) {
  const n = samples.length;
  const empiricalMean = samples.reduce((acc, value) => acc + value, 0) / n;
  const empiricalVariance =
    samples.reduce((acc, value) => acc + (value - empiricalMean) ** 2, 0) / n;

  return {
    empirical_mean: empiricalMean,
    empirical_variance: empiricalVariance,
    empirical_std: Math.sqrt(empiricalVariance),
  };
}

export function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
