// Takes in an array of point tetrads that correspond to a closed shape
// and returns the area of that shape.

import { Point } from '../../types';
import { curveWithOffset, derivativeWithOffset } from '../sharedFunctions';
import integral from '../integral';

export default function area(cubics: Point[][]) {
  const fns = cubics.map((controlPoints, i) => {
    const x = curveWithOffset(controlPoints.map((p) => p.x), i);
    const y = curveWithOffset(controlPoints.map((p) => p.y), i);
    const dx = derivativeWithOffset(controlPoints.map((p) => p.x), i);
    const dy = derivativeWithOffset(controlPoints.map((p) => p.y), i);
    const func = (t: number) => 0.5 * (x(t) * dy(t) - y(t) * dx(t)); // ???????
    return func;
  });
  let sum = 0;
  for (let i = 0; i < fns.length; i++) {
    sum += integral(i, i + 1, fns[i]);
  }
  return sum;
}
