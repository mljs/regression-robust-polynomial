import { solve } from "ml-matrix";

/**
 * @ignore
 * @param tuple
 * @param powers
 * @return
 */
export function calcCoefficients(
  tuple: { x: number; y: number }[],
  powers: number[]
) {
  let X: number[][] = [];
  let Y: number[][] = [];
  for (let i = 0; i < tuple.length; i++) {
    Y[i] = [tuple[i].y];
    X[i] = new Array(powers.length);
    for (let j = 0; j < powers.length; j++) {
      X[i][j] = Math.pow(tuple[i].x, powers[j]);
    }
  }
  return solve(X, Y).to1DArray();
}
