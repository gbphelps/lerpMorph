function multiply(mx1, mx2) {
  if (mx1[0].length !== mx2.length) throw new Error();
  const mx = [];
  for (let i = 0; i < mx1.length; i++) {
    mx.push([]);
    for (let j = 0; j < mx2[0].length; j++) {
      mx[i][j] = 0;
    }
  }
  for (let row = 0; row < mx1.length; row++) {
    for (let col = 0; col < mx2[0].length; col++) {
      for (let n = 0; n < mx1[0].length; n++) {
        mx[row][col] += mx1[row][n] * mx2[n][col];
      }
    }
  }
  return mx;
}

function upperTriangle(mx) {
  const lower = [];
  for (let i = 0; i < mx.length; i++) {
    lower.push([]);
    for (let j = 0; j < mx.length; j++) {
      lower[i][j] = i === j ? 1 : 0;
    }
  }

  for (let n = 0; n < mx.length - 1; n++) {
    let tradeIdx = 1;
    while (mx[n][n] === 0) {
      [mx[n], mx[n + tradeIdx]] = [mx[n + tradeIdx], mx[n]];
      tradeIdx++;
    }
    for (let row = n + 1; row < mx.length; row++) {
      const cancel = mx[row][n];
      const coef = cancel / mx[n][n];
      lower[row][n] = coef;
      for (let col = n; col < mx.length; col++) {
        mx[row][col] -= coef * mx[n][col];
      }
    }
  }
  console.log(multiply(lower, mx));
  return { mx, lower };
}

const mx = [[1, 2, 3, 4], [5, 3, -2, -7], [2, 3, -4, 12], [1, 19, 4, 4]];
