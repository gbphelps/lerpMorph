// NOTE: takes an array of n control points and returns an array of n + 1 control points,
// so that the output array describes a bezier one degree higher than the input, but with
// an identical curvature.

import { Point } from '../types';

export default function bumpDegree(points: Point[]) {
  const result = [];
  const n = points.length - 1;

  function interpolate(a: number, b: number, i: number) {
    return i / (n + 1) * a + (n + 1 - i) / (n + 1) * b;
  }

  for (let i = 0; i <= points.length; i++) {
    if (i === 0) { result.push(points[i]); continue; }
    if (i === points.length) { result.push(points[i - 1]); continue; }
    const A = points[i - 1];
    const B = points[i];

    result.push({
      x: interpolate(A.x, B.x, i),
      y: interpolate(A.y, B.y, i),
    });
  }

  return result;
}
