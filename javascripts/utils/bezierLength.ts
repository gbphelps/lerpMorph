// This is WAY faster O(1) vs O(log(n)) than approximation via recursive curve splitting.
// You can use a higher order approximation
// (e.g. Six-point or Seven-point quadrature) if you need even more precision.
// Convergence is incredibly fast. https://en.wikipedia.org/wiki/Gaussian_quadrature

import { QuadNums, QuadPoints } from '../types';
import integral from './integral';

export default function arcLength(controlPoints: QuadPoints) {
  function deriv(c: QuadNums) {
    return function curve(t: number) {
      return -3 * c[0] * (1 - t) * (1 - t)
          + 3 * c[1] * (1 - t) * (1 - 3 * t)
          + 3 * c[2] * t * (2 - 3 * t)
          + 3 * c[3] * t * t;
    };
  }

  const dxdt = deriv(controlPoints.map((p) => p.x) as QuadNums);
  const dydt = deriv(controlPoints.map((p) => p.y)as QuadNums);

  // derivative of arclength; the thing to be integrated
  function dArcLength(t: number) {
    const x = dxdt(t);
    const y = dydt(t);
    return Math.sqrt(x * x + y * y);
  }

  // Gaussian quadrature to implement integration

  // arcLength returns a function that takes in a start t and an end t,
  // and then spits out the length from start to end.
  return function arcLengthFunc(start: number, end: number) {
    return integral(start, end, dArcLength);
  };
}
