import extractCubics from './utils/cubicCollections/extractCubics';
import { Point } from './types';
import alignRotation from './utils/cubicCollections/alignRotation';
import centroid from './utils/cubicCollections/centroid';

function init() {
  const d = 'M 0 0 C -90 0 -40 -100 50 0 C 20 40 -20 -50 70 100 Z';
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
  const newCubics = alignRotation(cubics);
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

  console.log('oh hi');
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
