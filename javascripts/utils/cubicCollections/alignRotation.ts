import { getCubicRoots } from 'minimatrix-polyroots';
import { Point } from '../../types';
import { curve } from '../sharedFunctions';
import centroid from './centroid';
import split from '../splitBezier';

interface ComplexNumber {
    real: number,
    imag: number,
  }

function rotate<T>(arr: T[], turns: number) {
  const newTurns = turns - Math.floor(turns / arr.length) * arr.length;
  return arr.slice(newTurns).concat(arr.slice(0, newTurns));
}

export default function alignRotation(cubics: Point[][]) {
  let highestIntersection: null | {y: number, t: number, i: number } = null;

  const c = centroid(cubics);
  cubics.forEach((points, i) => {
    const roots = getCubicRoots(
      points[3].x - 3 * points[2].x + 3 * points[1].x - points[0].x,
      3 * points[2].x - 6 * points[1].x + 3 * points[0].x,
      3 * points[1].x - 3 * points[0].x,
      points[0].x - c.x,
    );
    roots.forEach((root: ComplexNumber) => {
      if (root.imag) return;
      if (root.real > 1) return;
      if (root.real < 0) return;
      const y = curve(points.map((p) => p.y))(root.real);
      if (!highestIntersection || y < highestIntersection.y) {
        highestIntersection = {
          y,
          i,
          t: root.real,
        };
      }
    });
  });

  const newCubics = rotate(cubics, highestIntersection!.i);
  const [curve1, curve2] = split(newCubics[0], highestIntersection!.t);
  newCubics[0] = curve2;
  newCubics.push(curve1);

  return newCubics;
}
