import { isAnyArray } from 'is-any-array';
import {
  BaseRegression,
  checkArrayLength,
  maybeToPrecision,
} from 'ml-regression-base';

import { predict } from './utilities/predict';
import { robustPolynomial } from './utilities/robustPolynomial';

/**
 * @class RobustPolynomialRegression
 * @param x
 * @param y
 * @param degree - polynomial degree
 */
export class RobustPolynomialRegression extends BaseRegression {
  public name?: string;
  public degree?: number;
  public powers?: number[];
  public coefficients?: number[];
  public constructor(x: number[] | LoadJSON, y?: number[], degree?: number) {
    super();
    if (isAnyArray(x)) {
      checkArrayLength(x, y as number[]);
      robustPolynomial(this, x, y as number[], degree as number);
    } else {
      const name = 'robustPolynomialRegression';
      const model = x;
      this.degree = model.degree;
      this.powers = model.powers;
      this.coefficients = model.coefficients;
      this.name = name;
    }
  }

  public toJSON() {
    return {
      name: this.name,
      degree: this.degree,
      powers: this.powers,
      coefficients: this.coefficients,
    };
  }

  public _predict(x: number) {
    return predict(x, this.powers as number[], this.coefficients as number[]);
  }

  /**
   * Display the formula
   * @param precision - precision for the numbers
   * @returns
   */
  public toString(precision: number) {
    return this._toFormula(precision, false);
  }

  /**
   * Display the formula in LaTeX format
   * @param precision - precision for the numbers
   * @returns
   */
  public toLaTeX(precision: number) {
    return this._toFormula(precision, true);
  }

  public _toFormula(precision: number, isLaTeX: boolean) {
    let sup = '^';
    let closeSup = '';
    let times = ' * ';
    if (isLaTeX) {
      sup = '^{';
      closeSup = '}';
      times = '';
    }

    let fn = '';
    let str = '';
    const coefficients = this.coefficients as number[];
    const powers = this.powers as number[];
    for (let k = 0; k < coefficients.length; k++) {
      str = '';
      if (coefficients[k] !== 0) {
        if (powers[k] === 0) {
          str = maybeToPrecision(coefficients[k], precision);
        } else if (powers[k] === 1) {
          str = `${maybeToPrecision(coefficients[k], precision) + times}x`;
        } else {
          str = `${
            maybeToPrecision(coefficients[k], precision) + times
          }x${sup}${powers[k]}${closeSup}`;
        }

        if (coefficients[k] > 0 && k !== coefficients.length - 1) {
          str = ` + ${str}`;
        } else if (k !== coefficients.length - 1) {
          str = ` ${str}`;
        }
      }
      fn = str + fn;
    }
    if (fn.startsWith('+')) {
      fn = fn.slice(1);
    }

    return `f(x) = ${fn}`;
  }

  public static load(json: LoadJSON) {
    if (json.name !== 'robustPolynomialRegression') {
      throw new TypeError('not a RobustPolynomialRegression model');
    }
    return new RobustPolynomialRegression(json, undefined, undefined);
  }
}

interface LoadJSON {
  name?: string;
  degree?: number;
  powers?: number[];
  coefficients?: number[];
}
