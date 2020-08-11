import { Point } from '../types';
import { add, mult, sub } from './sharedFunctions';

// get the deCastlejau net @ t
function intermediates(arr: Point[]) {
  return function intermediateReturnFn(t: number) {
    const sets = [];
    let set = arr;
    while (set.length >= 1) {
      sets.push(set);
      const nextSet = [];
      for (let i = 0; i < set.length - 1; i++) {
        const diff = sub(set[i + 1], set[i]);
        nextSet.push(
          add(set[i], mult(diff, t)),
        );
      }
      set = nextSet;
    }
    return sets;
  };
}

// takes an array of control points and splits the curve at a given value of t
export default function splitBez(arr: Point[], t: number) {
  const sets = intermediates(arr)(t);
  const p1 = [];
  const p2 = [];

  for (let i = 0; i < arr.length; i++) {
    p1.push(sets[i][0]);
    p2.unshift(sets[i][sets[i].length - 1]);
  }

  return [
    p1, p2,
  ];
}
