import { Point } from '../../types';
import area from './area';
import { derivativeWithOffset, curveWithOffset } from '../sharedFunctions';
import integral from '../integral';

export default function centroid(controlPointCollections: Point[][]) {
  const A = area(controlPointCollections);
  let xbar = 0;
  let ybar = 0;
  controlPointCollections.forEach((c, i) => {
    const dx = derivativeWithOffset(c.map((p) => p.x), i);
    const dy = derivativeWithOffset(c.map((p) => p.y), i);
    const x = curveWithOffset(c.map((p) => p.x), i);
    const y = curveWithOffset(c.map((p) => p.y), i);
    const fnX = (t: number) => 1 / (2 * A) * x(t) * x(t) * dy(t);
    const fnY = (t: number) => -1 / (2 * A) * y(t) * y(t) * dx(t);
    xbar += integral(i, i + 1, fnX);
    ybar += integral(i, i + 1, fnY);
  });
  return {
    x: xbar,
    y: ybar,
  };
}
