import { Matrix } from '../types';

export default function multiply(a: Matrix, b: Matrix) {
  if (a[0].length !== b.length) throw new RangeError('dimensional mismatch');

  const ans: Matrix = [];
  for (let i = 0; i < a.length; i++) ans[i] = [];

  for (let rowA = 0; rowA < a.length; rowA++) {
    for (let colB = 0; colB < b[0].length; colB++) {
      let val = 0;
      for (let i = 0; i < a[0].length; i++) {
        val += a[rowA][i] * b[i][colB];
      }
      ans[rowA][colB] = val;
    }
  }

  return ans;
}
