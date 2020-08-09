import extractCubics from './utils/cubicCollections/extractCubics';
import centroid from './utils/cubicCollections/centroid';
import { Point } from './types';
import alignRotation from './utils/cubicCollections/alignRotation';
import arcLength from './utils/bezierLength';

function init() {
  const d1 = 'M 3.58694 -42.7321 A 4 4 0 0 0 -3.58694 -42.7321 L -13.7639 -22.1112 A 4 4 0 0 1 -16.7757 -19.923 L -39.5322 -16.6163 A 4 4 0 0 0 -41.749 -9.79354 L -25.2823 6.25756 A 4 4 0 0 1 -24.1319 9.79808 L -28.0192 32.4626 A 4 4 0 0 0 -22.2154 36.6793 L -1.86136 25.9786 A 4 4 0 0 1 1.86136 25.9786 L 22.2154 36.6793 A 4 4 0 0 0 28.0192 32.4626 L 24.1319 9.79808 A 4 4 0 0 1 25.2823 6.25756 L 41.749 -9.79354 A 4 4 0 0 0 39.5322 -16.6163 L 16.7757 -19.923 A 4 4 0 0 1 13.7639 -22.1112 Z';
  const d2 = 'M 20 0 C 0 0 0 -10 0 0 C -20 -40 0 -50 70 0 Z';
  demo(d1, d2);
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});

function makePath(p: Point[], color: string) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M ${p[0].x} ${p[0].y} C ${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`);
  path.setAttribute('stroke', color);
  path.setAttribute('fill', 'transparent');
  document.getElementsByTagName('svg')[0].appendChild(path);
}

function findSegment(breakPercents: number[], target: number) {
  let floor = 0;
  let ceil = breakPercents.length;

  while (ceil - floor > 0) {
    const idx = Math.floor((ceil + floor) / 2);
    if (target > breakPercents[idx]) {
      floor = idx + 1;
    } else {
      ceil = idx - 1;
    }
  }

  return target < breakPercents[floor] ? floor - 1 : floor;
}

function demo(d1: string, d2: string) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-100 -100 200 200');
  document.body.appendChild(svg);
  const bps = [d1, d2].map((d) => {
    const cubics = extractCubics(d);
    const c = centroid(cubics);
    const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    center.setAttribute('cx', c.x.toString());
    center.setAttribute('cy', c.y.toString());
    center.setAttribute('r', '2');
    svg.appendChild(center);

    const newCubics = alignRotation(cubics);

    const lengths: number[] = [0];
    let lengthSum = 0;
    newCubics.forEach((cubic, i) => {
      makePath(cubic, ['red', 'orange', 'yellow', 'green', 'blue', 'purple'][i % 6]);
      const length = arcLength(cubic)(0, 1);
      lengthSum += length;
      lengths.push(lengthSum);
    });
    const breakPercents = lengths.map((l) => l / lengthSum);
    return {
      breakPercents,
      cubics,
      length: lengthSum,
    };
  });

  console.log(bps);
  bps[1].breakPercents.slice(1, -1).forEach((bp) => {
    console.log(bp);
    const floor = findSegment(bps[0].breakPercents, bp);
    console.log(floor);
  });
}
