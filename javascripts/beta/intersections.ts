import { Point } from '../types';
import segment from '../utils/segmentCubic';

const SEGMENT_COUNT = 3;
const PRECISION = 1e-4;

export function lineIntersection(l1points: Point[], l2points: Point[]) {
  const p0 = l1points[0];
  const p1 = l1points[3];
  const p2 = l2points[0];
  const p3 = l2points[3];

  const xL1 = p1.x - p0.x;
  const yL2 = p3.y - p2.y;
  const yL1 = p1.y - p0.y;
  const xL2 = p3.x - p2.x;

  const divisor = (xL1) * (yL2) - (yL1) * (xL2);
  if (divisor === 0) return null;
  const numerator = (xL1) * (yL2) * p2.x - (xL2) * (xL1) * (p2.y - p0.y) - (yL1) * (xL2) * p0.x;

  const x = numerator / divisor;
  const y = (yL1) / (xL1) * (x - p0.x) + p0.y;
  return { x, y };
}

function mag(a: Point) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

function len(a: Point, b: Point) {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return Math.sqrt(x * x + y * y);
}

export function distanceToLine(p: Point, lpoints: Point[]) {
  // if (!isPerpindicularInRange(p, lpoints)) return Infinity;
  const vec1 = { x: p.x - lpoints[0].x, y: p.y - lpoints[0].y };
  const vec2 = { x: lpoints[3].x - lpoints[0].x, y: lpoints[3].y - lpoints[0].y };
  const crossProduct = vec1.x * vec2.y - vec1.y * vec2.x;
  const sin = crossProduct / (mag(vec1) * mag(vec2));
  const distanceToLine = Math.abs(mag(vec1) * sin);
  return distanceToLine;
}

export function isPerpindicularInRange(p: Point, lpoints: Point[]) {
  const m1 = -(lpoints[3].x - lpoints[0].x) / (lpoints[3].y - lpoints[0].y);
  const b1 = p.y - m1 * p.x;
  const m2 = -1 / m1;
  const b2 = lpoints[0].y - m2 * lpoints[0].x;
  const x = (b2 - b1) / (m1 - m2);
  const range = lpoints.map((p) => p.x).sort((a, b) => a - b);
  if (range[0] <= x && range[1] >= x) return true;
  return false;
}

export function goodIntersection(l1points: Point[], l2points: Point[], intersection: Point) {
  const xRange1 = [l1points[0], l1points[3]].map((p) => p.x).sort((a, b) => a - b);
  const xRange2 = [l2points[0], l2points[3]].map((p) => p.x).sort((a, b) => a - b);
  const yRange1 = [l1points[0], l1points[3]].map((p) => p.y).sort((a, b) => a - b);
  const yRange2 = [l2points[0], l2points[3]].map((p) => p.y).sort((a, b) => a - b);

  const del1 = Math.max(
    distanceToLine(l1points[1], l1points),
    distanceToLine(l1points[2], l1points),
  );
  const del2 = Math.max(
    distanceToLine(l2points[1], l2points),
    distanceToLine(l2points[2], l2points),
  );

  if (
    intersection
        && xRange1[0] <= intersection.x
        && xRange1[1] >= intersection.x
        && xRange2[0] <= intersection.x
        && xRange2[1] >= intersection.x
        && yRange1[0] <= intersection.y
        && yRange1[1] >= intersection.y
        && yRange2[0] <= intersection.y
        && yRange2[1] >= intersection.y
  ) return true;

  const oopsFactor = Math.max(
    len(l1points[0], intersection),
    len(l1points[3], intersection),
    len(l2points[0], intersection),
    len(l2points[3], intersection),
  );

  if (oopsFactor < (del1 + del2) * 100) return true;
  return false;
}

function alreadyFound(intersection: Point, intersections: Point[]) {
  for (let i = 0; i < intersections.length; i++) {
    if (
      Math.abs(intersection.x - intersections[i].x) < PRECISION
      && Math.abs(intersection.y - intersections[i].y) < PRECISION
    ) return true;
  }
  return false;
}

export function findIntersections(ctrlPoints1: Point[], ctrlPoints2: Point[]) {
  const tests = [{
    curve1: ctrlPoints1,
    curve2: ctrlPoints2,
    prevIntersectionEstimate: { x: Infinity, y: Infinity },
  }];
  const intersections = [];
  // TODO you need to cache the proceeding segmentation for each curve. There are probably other things you need to cache too.
  let i = 0;
  while (tests.length && i < 10000) {
    i++;
    const { curve1, curve2, prevIntersectionEstimate } = tests.shift()!;
    const cseg1 = segment(curve1, SEGMENT_COUNT);
    const cseg2 = segment(curve2, SEGMENT_COUNT);
    const lines1 = cseg1; // .map((points) => [points[0], points[points.length - 1]]);
    const lines2 = cseg2; // .map((points) => [points[0], points[points.length - 1]]);
    for (let i = 0; i < lines1.length; i++) {
      const one = lines1[i];
      for (let j = 0; j < lines2.length; j++) {
        const two = lines2[j];
        const intersection = lineIntersection(one, two);
        if (!intersection || alreadyFound(intersection, intersections)) {
          continue;
        } else if (
          intersection
                    && Math.abs(prevIntersectionEstimate.x - intersection.x) < PRECISION
                    && Math.abs(prevIntersectionEstimate.y - intersection.y) < PRECISION
                    && !(
                      intersections.filter((ix) => Math.abs(ix.x - intersection.x) < PRECISION
                            && Math.abs(ix.y - intersection.y) < PRECISION)
                    ).length
        ) {
          intersections.push(intersection);
        } else if (goodIntersection(one, two, intersection)) {
          // TODO see if you can remove the intersectionDistance function
          // and just check for actual intersection with `lineIntersection`
          // without missing valid intersections.
          tests.push({
            curve1: cseg1[i],
            curve2: cseg2[j],
            prevIntersectionEstimate: intersection!,
          });
        }
      }
    }
  }
  return intersections;
}

// if errorToLine < 1, let's say there *might* be an intersection, so recurse.
