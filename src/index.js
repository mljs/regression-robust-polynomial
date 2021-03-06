import BaseRegression, {
  checkArrayLength,
  maybeToPrecision
} from 'ml-regression-base';
import { solve } from 'ml-matrix';

/**
 * @class RobustPolynomialRegression
 * @param {Array<number>} x
 * @param {Array<number>} y
 * @param {number} degree - polynomial degree
 */
export default class RobustPolynomialRegression extends BaseRegression {
  constructor(x, y, degree) {
    super();
    if (x === true) {
      this.degree = y.degree;
      this.powers = y.powers;
      this.coefficients = y.coefficients;
    } else {
      checkArrayLength(x, y);
      robustPolynomial(this, x, y, degree);
    }
  }

  toJSON() {
    return {
      name: 'robustPolynomialRegression',
      degree: this.degree,
      powers: this.powers,
      coefficients: this.coefficients
    };
  }

  _predict(x) {
    return predict(x, this.powers, this.coefficients);
  }

  /**
   * Display the formula
   * @param {number} precision - precision for the numbers
   * @return {string}
   */
  toString(precision) {
    return this._toFormula(precision, false);
  }

  /**
   * Display the formula in LaTeX format
   * @param {number} precision - precision for the numbers
   * @return {string}
   */
  toLaTeX(precision) {
    return this._toFormula(precision, true);
  }

  _toFormula(precision, isLaTeX) {
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
    for (let k = 0; k < this.coefficients.length; k++) {
      str = '';
      if (this.coefficients[k] !== 0) {
        if (this.powers[k] === 0) {
          str = maybeToPrecision(this.coefficients[k], precision);
        } else {
          if (this.powers[k] === 1) {
            str = `${maybeToPrecision(this.coefficients[k], precision) +
              times}x`;
          } else {
            str = `${maybeToPrecision(this.coefficients[k], precision) +
              times}x${sup}${this.powers[k]}${closeSup}`;
          }
        }

        if (this.coefficients[k] > 0 && k !== this.coefficients.length - 1) {
          str = ` + ${str}`;
        } else if (k !== this.coefficients.length - 1) {
          str = ` ${str}`;
        }
      }
      fn = str + fn;
    }
    if (fn.charAt(0) === '+') {
      fn = fn.slice(1);
    }

    return `f(x) = ${fn}`;
  }

  static load(json) {
    if (json.name !== 'robustPolynomialRegression') {
      throw new TypeError('not a RobustPolynomialRegression model');
    }
    return new RobustPolynomialRegression(true, json);
  }
}

function robustPolynomial(regression, x, y, degree) {
  let powers = Array(degree)
    .fill(0)
    .map((_, index) => index);

  const tuples = getRandomTuples(x, y, degree);

  var min;
  for (var i = 0; i < tuples.length; i++) {
    var tuple = tuples[i];
    var coefficients = calcCoefficients(tuple, powers);

    var residuals = x.slice();
    for (var j = 0; j < x.length; j++) {
      residuals[j] = y[j] - predict(x[j], powers, coefficients);
      residuals[j] = {
        residual: residuals[j] * residuals[j],
        coefficients
      };
    }

    var median = residualsMedian(residuals);
    if (!min || median.residual < min.residual) {
      min = median;
    }
  }

  regression.degree = degree;
  regression.powers = powers;
  regression.coefficients = min.coefficients;
}

/**
 * @ignore
 * @param {Array<number>} x
 * @param {Array<number>} y
 * @param {number} degree
 * @return {Array<{x:number,y:number}>}
 */
function getRandomTuples(x, y, degree) {
  var len = Math.floor(x.length / degree);
  var tuples = new Array(len);

  for (var i = 0; i < x.length; i++) {
    var pos = Math.floor(Math.random() * len);

    var counter = 0;
    while (counter < x.length) {
      if (!tuples[pos]) {
        tuples[pos] = [
          {
            x: x[i],
            y: y[i]
          }
        ];
        break;
      } else if (tuples[pos].length < degree) {
        tuples[pos].push({
          x: x[i],
          y: y[i]
        });
        break;
      } else {
        counter++;
        pos = (pos + 1) % len;
      }
    }

    if (counter === x.length) {
      return tuples;
    }
  }
  return tuples;
}

/**
 * @ignore
 * @param {{x:number,y:number}} tuple
 * @param {Array<number>} powers
 * @return {Array<number>}
 */
function calcCoefficients(tuple, powers) {
  var X = tuple.slice();
  var Y = tuple.slice();
  for (var i = 0; i < X.length; i++) {
    Y[i] = [tuple[i].y];
    X[i] = new Array(powers.length);
    for (var j = 0; j < powers.length; j++) {
      X[i][j] = Math.pow(tuple[i].x, powers[j]);
    }
  }

  return solve(X, Y).to1DArray();
}

function predict(x, powers, coefficients) {
  let y = 0;
  for (let k = 0; k < powers.length; k++) {
    y += coefficients[k] * Math.pow(x, powers[k]);
  }
  return y;
}

function residualsMedian(residuals) {
  residuals.sort((a, b) => a.residual - b.residual);

  var l = residuals.length;
  var half = Math.floor(l / 2);
  return l % 2 === 0 ? residuals[half - 1] : residuals[half];
}
