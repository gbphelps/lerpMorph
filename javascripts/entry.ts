import { getCubicRoots } from 'minimatrix-polyroots';
import extractCubics from './utils/cubicCollections/extractCubics';
import centroid from './utils/cubicCollections/centroid';
import { curve } from './utils/sharedFunctions';
import split from './utils/splitBezier';
import { Point } from './types';

function init() {
  const d = 'M 0 0 L 40 0 C 20 40 -20 -50 70 100 Z';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-100 -100 200 200');
  document.body.appendChild(svg);
  demo(d);
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});

function demo(d: string) {
  const cubics = extractCubics(d);
  const c = centroid(cubics);

  const l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  l1.setAttribute('stroke', 'black');
  l1.setAttribute('x1', c.x.toString());
  l1.setAttribute('x2', c.x.toString());
  l1.setAttribute('y1', '-100');
  l1.setAttribute('y2', '100');
  l1.setAttribute('vector-effect', 'non-scaling-stroke');
  l1.setAttribute('stroke-width', '0.5');

  const l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  l2.setAttribute('stroke', 'black');
  l2.setAttribute('x1', '-100');
  l2.setAttribute('x2', '100');
  l2.setAttribute('y1', c.y.toString());
  l2.setAttribute('y2', c.y.toString());
  l2.setAttribute('vector-effect', 'non-scaling-stroke');
  l2.setAttribute('stroke-width', '0.5');

  // A: (c[3] - 3 * c[2] + 3 * c[1] - c[0])
  // B: (3 * c[2] - 6 * c[1] + 3 * c[0])
  // C: (3 * c[1] - 3 * c[0])
  // D: c[0] - X

  interface ComplexNumber {
    real: number,
    imag: number,
  }

  function rotate<T>(arr: T[], turns: number) {
    const newTurns = turns - Math.floor(turns / arr.length) * arr.length;
    return arr.slice(newTurns).concat(arr.slice(0, newTurns));
  }

  let highestIntersection: null | {y: number, t: number, i: number } = null;

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

  newCubics.forEach((points: Point[], i:number) => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('stroke', ['red', 'orange', 'yellow', 'lime', 'blue', 'purple'][i % 6]);
    p.setAttribute('d', `M ${points[0].x} ${points[0].y} C ${points[1].x} ${points[1].y} ${points[2].x} ${points[2].y} ${points[3].x} ${points[3].y}`);
    p.setAttribute('fill', 'transparent');
    document.getElementsByTagName('svg')[0].appendChild(p);
  });

  document.getElementsByTagName('svg')[0].appendChild(l1);
  document.getElementsByTagName('svg')[0].appendChild(l2);
}
