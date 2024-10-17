export function residualsMedian(
  residuals: Array<{ residual: number; coefficients: number[] }>,
) {
  residuals.sort((a, b) => a.residual - b.residual);

  const l = residuals.length;
  const half = Math.floor(l / 2);
  return l % 2 === 0 ? residuals[half - 1] : residuals[half];
}
