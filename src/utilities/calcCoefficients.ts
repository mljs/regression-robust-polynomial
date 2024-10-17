import { solve } from 'ml-matrix';

/**
 * @ignore
 * @param tuple
 * @param powers
 * @returns
 */
export function calcCoefficients(
  tuple: Array<{ x: number; y: number }>,
  powers: number[],
) {
  const X: number[][] = [];
  const Y: number[][] = [];
  for (let i = 0; i < tuple.length; i++) {
    Y[i] = [tuple[i].y];
    X[i] = new Array(powers.length);
    for (let j = 0; j < powers.length; j++) {
      X[i][j] = tuple[i].x ** powers[j];
    }
  }
  return solve(X, Y).to1DArray();
}
