import { Point } from '../../types';
import extractCubics from './extractCubics';
import alignRotation from './alignRotation';
import arcLength from '../bezierLength';
import splitAtLength from '../splitAtLength';
import {
  add, sub, mult, cubicsToPath,
} from '../sharedFunctions';

interface CubicData {
    breakPercents: number[],
    cubics: Point[][],
    totalLength: number,
    lengths: number[],
  }

export function getCubicData(d: string) {
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
}

export function slice(a: CubicData, b: CubicData) {
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
      if (upperBound === 1 && lowerBound === 1) {
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
  //   const a_ = newCubics.map((c) => arcLength(c)(0, 1));
  //   const aa = a_.reduce((ac:number, n: number) => ac + n, 0);
  //   console.log(a_.map((be) => be / aa));
  return newCubics;
}

export default function lerpMorph(a: string, b: string) {
  const bp0 = getCubicData(a);
  const bp1 = getCubicData(b);

  const aNew = slice(bp0, bp1);
  const bNew = slice(bp1, bp0);

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
    return cubicsToPath(curve);
  }

  return getCurve;
}
