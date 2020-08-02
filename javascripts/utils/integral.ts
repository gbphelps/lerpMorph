const X = [
  -(1 / 3) * Math.sqrt(5 + 2 * Math.sqrt(10 / 7)),
  -(1 / 3) * Math.sqrt(5 - 2 * Math.sqrt(10 / 7)),
  0,
  (1 / 3) * Math.sqrt(5 - 2 * Math.sqrt(10 / 7)),
  (1 / 3) * Math.sqrt(5 + 2 * Math.sqrt(10 / 7)),
];

const W = [
  (322 - 13 * Math.sqrt(70)) / 900,
  (322 + 13 * Math.sqrt(70)) / 900,
  128 / 225,
  (322 + 13 * Math.sqrt(70)) / 900,
  (322 - 13 * Math.sqrt(70)) / 900,
];

export default function integral(
  t0: number,
  t1: number,
  fn: (arg: number) => number,
) {
  let sum = 0;
  for (let i = 0; i < W.length; i++) {
    const t = (t1 - t0) / 2 * X[i] + (t0 + t1) / 2;
    sum += (t1 - t0) / 2 * W[i] * fn(t);
  }
  return sum;
}
