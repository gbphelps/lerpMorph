// This is WAY faster O(1) vs O(log(n)) than approximation via recursive curve splitting.
// You can use a higher order approximation
// (e.g. Six-point or Seven-point quadrature) if you need even more precision.
// Convergence is incredibly fast. https://en.wikipedia.org/wiki/Gaussian_quadrature

import { QuadNums, QuadPoints } from '../types';
import integral from './integral';
import { derivative } from './sharedFunctions';

export default function arcLength(controlPoints: QuadPoints) {
  const dxdt = derivative(controlPoints.map((p) => p.x) as QuadNums);
  const dydt = derivative(controlPoints.map((p) => p.y)as QuadNums);

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
