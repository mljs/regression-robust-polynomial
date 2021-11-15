export function residualsMedian(
  residuals: { residual: number; coefficients: number[] }[]
) {
  residuals.sort((a, b) => a.residual - b.residual);

  let l = residuals.length;
  let half = Math.floor(l / 2);
  return l % 2 === 0 ? residuals[half - 1] : residuals[half];
}
