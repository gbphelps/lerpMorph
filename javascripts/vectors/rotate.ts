import multiply from './crossProduct';
import { Point } from '../types';

const rotationMx = (theta: number) => [
  [Math.cos(theta), Math.sin(theta)],
  [-Math.sin(theta), Math.cos(theta)],
];

export default function rotate(p: Point, theta: number) {
  const vec = [[p.x, p.y]];
  const r = rotationMx(theta);
  const result = multiply(vec, r)[0];

  return ({
    x: result[0],
    y: result[1],
  });
}
