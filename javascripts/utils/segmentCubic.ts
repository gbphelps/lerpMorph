import { Point } from '../types';
import split from './splitBezier';

export default function segment(ctrlPoints: Point[], n: number) {
  const segments = [];
  let current = ctrlPoints;
  for (let i = 0; i < n - 1; i++) {
    const [seg, rest] = split(current, 1 / (n - i));
    segments.push(seg);
    current = rest;
  }
  segments.push(current);
  return segments;
}
