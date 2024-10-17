import { describe, it, expect } from 'vitest';

import { RobustPolynomialRegression } from '..';

describe('Robust Polynomial Regression', () => {
  it('Simple squared function', () => {
    const size = 31;
    const x: number[] = new Array(size);
    const y: number[] = new Array(size);
    for (let i = 0; i < size; i++) {
      x[i] = i;
      y[i] = 2 * i * i + 4 * i + 5;
    }

    const regression = new RobustPolynomialRegression(x, y, 3);
    expect(regression.predict(3)).toBe(35);
    expect(regression.toString(3)).toBe('f(x) = 2.00 * x^2 + 4.00 * x + 5.00');
    expect(regression.toLaTeX(3)).toBe('f(x) = 2.00x^{2} + 4.00x + 5.00');
  });

  it('Squared function with outliers', () => {
    const size = 30;
    const x: number[] = new Array(size);
    const y: number[] = new Array(size);
    for (let i = 0; i < size; i++) {
      x[i] = i;
      y[i] = 2 * i * i + 4 * i + 5;
    }
    y[4] = y[4] * 100;
    y[10] = y[10] * -100;

    const regression = new RobustPolynomialRegression(x, y, 3);
    expect(regression.predict(3)).toBe(35);
  });

  it('toJSON and load', () => {
    expect(() => RobustPolynomialRegression.load({})).toThrow(
      'not a RobustPolynomialRegression model',
    );

    const regression = RobustPolynomialRegression.load({
      name: 'robustPolynomialRegression',
      degree: 1,
      powers: [1],
      coefficients: [-1],
    });

    expect(regression.predict(1)).toStrictEqual(-1);
    expect(regression.toString(3)).toBe('f(x) = - 1.00 * x');

    const model = regression.toJSON();
    expect(model).toStrictEqual({
      name: 'robustPolynomialRegression',
      degree: 1,
      powers: [1],
      coefficients: [-1],
    });
  });
});
