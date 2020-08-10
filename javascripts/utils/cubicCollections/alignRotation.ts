import { getCubicRoots } from 'minimatrix-polyroots';
import { Point } from '../../types';
import { curve } from '../sharedFunctions';
import centroid from './centroid';
import split from '../splitBezier';
import area from './area';

interface ComplexNumber {
    real: number,
    imag: number,
  }

function rotate<T>(arr: T[], turns: number) {
  const newTurns = turns - Math.floor(turns / arr.length) * arr.length;
  return arr.slice(newTurns).concat(arr.slice(0, newTurns));
}

function reverseAll(cubics:Point[][]) {
  const newCubics = [];
  for (let i = 0; i < cubics.length; i++) {
    const newCubic = [];
    const iPrime = cubics.length - 1 - i;
    for (let j = 0; j < cubics[iPrime].length; j++) {
      newCubic.push(cubics[iPrime][cubics[iPrime].length - 1 - j]);
    }
    newCubics.push(newCubic);
  }
  return newCubics;
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

  return area(newCubics) > 0 ? newCubics : reverseAll(newCubics);
}
