import extractCubics from './utils/cubicCollections/extractCubics';
import { Point } from './types';
import alignRotation from './utils/cubicCollections/alignRotation';
import arcLength from './utils/bezierLength';
import splitAtLength from './utils/splitAtLength';
import { add, sub, mult } from './utils/sharedFunctions';

function init() {
  const d1 = 'M 3.58694 -42.7321 A 4 4 0 0 0 -3.58694 -42.7321 L -13.7639 -22.1112 A 4 4 0 0 1 -16.7757 -19.923 L -39.5322 -16.6163 A 4 4 0 0 0 -41.749 -9.79354 L -25.2823 6.25756 A 4 4 0 0 1 -24.1319 9.79808 L -28.0192 32.4626 A 4 4 0 0 0 -22.2154 36.6793 L -1.86136 25.9786 A 4 4 0 0 1 1.86136 25.9786 L 22.2154 36.6793 A 4 4 0 0 0 28.0192 32.4626 L 24.1319 9.79808 A 4 4 0 0 1 25.2823 6.25756 L 41.749 -9.79354 A 4 4 0 0 0 39.5322 -16.6163 L 16.7757 -19.923 A 4 4 0 0 1 13.7639 -22.1112 Z';
  const d2 = 'M 20 0 C -30 20 0 10 0 0 C -20 -40 0 -50 80 0 L 20 -20 Z';
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

function cubicsToD(cubics: Point[][]) {
  let d = `M ${cubics[0][0].x} ${cubics[0][0].y}`;
  for (let i = 0; i < cubics.length; i++) {
    d += `C ${cubics[i][1].x} ${cubics[i][1].y} ${cubics[i][2].x} ${cubics[i][2].y} ${cubics[i][3].x} ${cubics[i][3].y}`;
  }
  return d;
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
    const newCubics = alignRotation(cubics);

    const summedLengths: number[] = [0];
    const lengths: number[] = [];
    let lengthSum = 0;
    newCubics.forEach((cubic) => {
      const length = arcLength(cubic)(0, 1);
      lengths.push(length);
      lengthSum += length;
      summedLengths.push(lengthSum);
    });
    const breakPercents = summedLengths.map((l) => l / lengthSum);
    return {
      breakPercents,
      cubics: newCubics,
      totalLength: lengthSum,
      lengths,
    };
  });

  interface CubicData {
    breakPercents: number[],
    cubics: Point[][],
    totalLength: number,
    lengths: number[],
  }

  function slice(a: CubicData, b: CubicData) {
    const newCubics = [];
    let i = 1;
    let j = 0;
    while (j < a.breakPercents.length - 1 && i < b.breakPercents.length - 1) {
      while (j < a.breakPercents.length - 1) {
        let spliceBP = b.breakPercents[i];
        let cubic = a.cubics[j];
        let lowerBound = a.breakPercents[j];
        const upperBound = a.breakPercents[j + 1];
        let length = a.lengths[j];
        if (upperBound === lowerBound) {
          j++;
          continue;
        }
        if (i === b.breakPercents.length - 1) {
          newCubics.push(cubic);
        } else if (lowerBound < spliceBP && spliceBP <= upperBound) {
          while (spliceBP <= upperBound && spliceBP !== 1) {
            const span = upperBound - lowerBound;
            const percentLength = (spliceBP - lowerBound) / span;
            const splitLength = length * percentLength;
            const [curve1, curve2] = splitAtLength(cubic, splitLength);
            newCubics.push(curve1);
            cubic = curve2;
            length -= splitLength;
            lowerBound = spliceBP;
            spliceBP = b.breakPercents[i + 1];
            i++;
            // console.log({ spliceBP, lowerBound, upperBound });
          }
          newCubics.push(cubic);
        } else {
          newCubics.push(cubic);
        }
        j++;
      }
    }
    return newCubics;
  }

  const aNew = slice(bps[0], bps[1]);
  const bNew = slice(bps[1], bps[0]);

  function getCurve(t: number) {
    const curve: Point[][] = [];
    for (let i = 0; i < aNew.length; i++) {
      const cubic: Point[] = [];
      for (let j = 0; j < aNew[0].length; j++) {
        const diffVector = sub(bNew[i][j], aNew[i][j]);
        cubic[j] = add(aNew[i][j], mult(diffVector, t));
      }
      curve.push(cubic);
    }
    return cubicsToD(curve);
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', getCurve(0));
  svg.appendChild(path);

  animate(1000, easeInOutQuint, (progress) => {
    path.setAttribute('d', getCurve(progress));
  });
}

function animate(millis:number, ease: (i: number) => number, task: (progress: number) => void) {
  const t0 = Date.now();
  function step() {
    const t = Date.now();
    if (t - t0 > millis) return;
    const i = (t - t0) / millis;
    const p = ease(i);
    task(p);
    requestAnimationFrame(step);
  }
  step();
}

function easeInOutQuint(x: number): number {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}
