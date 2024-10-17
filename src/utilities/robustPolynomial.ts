import { calcCoefficients } from './calcCoefficients';
import { getRandomTuples } from './getRandomTuples';
import { predict } from './predict';
import { residualsMedian } from './residualsMedian';

export function robustPolynomial(
  regression: {
    name?: string;
    degree?: number;
    powers?: number[];
    coefficients?: number[];
  },
  x: number[],
  y: number[],
  degree: number,
) {
  const powers = new Array(degree).fill(0).map((_, index) => index);

  const tuples = getRandomTuples(x, y, degree);

  let min:
    | {
        residual: number;
        coefficients: number[];
      }
    | undefined;
  for (const tuple of tuples) {
    const coefficients = calcCoefficients(tuple, powers);
    const residuals: Array<{ residual: number; coefficients: number[] }> = [];
    for (let j = 0; j < x.length; j++) {
      const residual = y[j] - predict(x[j], powers, coefficients);
      residuals[j] = {
        residual: residual * residual,
        coefficients,
      };
    }

    const median = residualsMedian(residuals);
    if (!min || median.residual < min.residual) {
      min = median;
    }
  }
  regression.degree = degree;
  regression.powers = powers;
  regression.coefficients = min ? min.coefficients : [];
}
