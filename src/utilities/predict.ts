export function predict(x: number, powers: number[], coefficients: number[]) {
  let y = 0;
  for (let k = 0; k < powers.length; k++) {
    y += coefficients[k] * x ** powers[k];
  }
  return y;
}
