import { functionIn2D, Point } from '../types';

// Note: the t0 offsets allow you to parametrize a set of curves with a
// single piecewise function. (First curve is 0 <= t < 1, second is 1 <= t < 2, etc.)
// then we can integrate over 0 <= t <= n, where n is the number of curves.

// For all other applications set t0 to 0.
export function curveWithOffset(c: number[], t0: number) {
  return function curveFunc(t: number) {
    const tMod = t - t0;
    return c[0] * (1 - tMod) * (1 - tMod) * (1 - tMod)
        + c[1] * 3 * (1 - tMod) * (1 - tMod) * tMod
        + c[2] * 3 * (1 - tMod) * tMod * tMod
        + c[3] * tMod * tMod * tMod;
  };
}

export function derivativeWithOffset(c: number[], t0: number) {
  return function curve(t: number) {
    const tMod = t - t0;
    return -3 * c[0] * (1 - tMod) * (1 - tMod)
          + 3 * c[1] * (1 - tMod) * (1 - 3 * tMod)
          + 3 * c[2] * tMod * (2 - 3 * tMod)
          + 3 * c[3] * tMod * tMod;
  };
}

// (t:number) => c[0]
//     + (3 * c[1] - 3 * c[0]) * t
//     + (3 * c[2] - 6 * c[1] + 3 * c[0]) * t * t
//     + (c[3] - 3 * c[2] + 3 * c[1] - c[0]) * t * t * t;

// A: (c[3] - 3 * c[2] + 3 * c[1] - c[0])
// B: (3 * c[2] - 6 * c[1] + 3 * c[0])
// C: (3 * c[1] - 3 * c[0])
// D: c[0] - X
export function curve(c: number[]): functionIn2D {
  return curveWithOffset(c, 0);
}

export function derivative(c: number[]): functionIn2D {
  return derivativeWithOffset(c, 0);
}

export function mult(a: Point, b: number) {
  return { x: a.x * b, y: a.y * b };
}

export function add(...args: Point[]) {
  return {
    x: args.reduce((a, l) => a + l.x, 0),
    y: args.reduce((a, l) => a + l.y, 0),
  };
}

export function sub(a: Point, b: Point) {
  return { x: a.x - b.x, y: a.y - b.y };
}
