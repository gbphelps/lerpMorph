import parsePath from './utils/parsePath';
import absoluteCommands from './utils/absoluteCommands';
import cubicCommands from './utils/cubicCommands';
import { AnyCommand, QuadNums, QuadPoints } from './types';
import arclength from './utils/bezierLength';
import integral from './utils/integral';

function init() {
  const d = 'M 0 0 A 10 10 0 0 0 20 0';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-100 -100 200 200');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  path.setAttribute('stroke', 'black');
  path.setAttribute('fill', 'transparent');
  svg.appendChild(path);
  document.body.appendChild(svg);

  const cmds = cubicCommands(absoluteCommands(parsePath(d)));
  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  let d2 = '';
  cmds.forEach((cmd) => {
    d2 = `${d2 + cmd.type} ${cmd.params.join(' ')}`;
  });
  path2.setAttribute('stroke', 'red');
  path2.setAttribute('fill', 'transparent');
  path2.setAttribute('d', d2);
  svg.appendChild(path2);

  c(cmds);
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});

function c(cmds: AnyCommand[]) {
  const controlPointCollections = [];
  for (let i = 1; i < cmds.length; i++) {
    const controlPoints = [];
    const prevParams = cmds[i - 1].params;
    controlPoints.push({
      x: prevParams[prevParams.length - 2],
      y: prevParams[prevParams.length - 1],
    });
    for (let j = 0; j < 3; j++) {
      controlPoints.push({
        x: cmds[i].params[j * 2],
        y: cmds[i].params[j * 2 + 1],
      });
    }
    controlPointCollections.push(controlPoints);
  }
  animate(controlPointCollections as QuadPoints[]);
  // centroid(controlPointCollections as QuadPoints[]);
  console.log(area(controlPointCollections as QuadPoints[]));
  console.log(controlPointCollections.reduce(
    (acc, cps) => arclength(cps as QuadPoints)(0, 1) + acc, 0,
  ));
}

function curve(c: QuadNums, tStart: number) {
  return function curveFunc(t: number) {
    const tMod = t - tStart;
    return c[0] * (1 - tMod) * (1 - tMod) * (1 - tMod)
      + c[1] * 3 * (1 - tMod) * (1 - tMod) * tMod
      + c[2] * 3 * (1 - tMod) * tMod * tMod
      + c[3] * tMod * tMod * tMod;
  };
}

function deriv(c: QuadNums, tStart: number) {
  return function curveDerivFunc(t: number) {
    const tMod = t - tStart;
    return 3 * (1 - tMod) * (1 - tMod) * (c[1] - c[0])
    - 6 * (1 - tMod) * tMod * (c[2] - c[1])
    + 3 * tMod * tMod * (c[3] - c[2]);
  };
}

function animate(controlPointCollections: QuadPoints[]) {
  const fns = controlPointCollections.map((controlPoints, i) => {
    const cX = curve(controlPoints.map((p) => p.x) as QuadNums, i);
    const cY = curve(controlPoints.map((p) => p.y) as QuadNums, i);
    return {
      x: cX,
      y: cY,
    };
  });

  let i = 0;

  const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  point.setAttribute('r', '2');
  document.getElementsByTagName('svg')[0].appendChild(point);

  function _a() {
    if (i >= 500) return;
    const k = i / 500 * fns.length;
    const idx = Math.floor(k);

    const x = fns[idx].x(k);
    const y = fns[idx].y(k);
    point.setAttribute('cx', x.toString());
    point.setAttribute('cy', y.toString());
    requestAnimationFrame(_a);
    i++;
  }

  _a();
}

function area(collections: QuadPoints[]) {
  const fns = collections.map((controlPoints, i) => {
    const x = curve(controlPoints.map((p) => p.x) as QuadNums, i);
    const y = curve(controlPoints.map((p) => p.y) as QuadNums, i);
    const dx = deriv(controlPoints.map((p) => p.x) as QuadNums, i);
    const dy = deriv(controlPoints.map((p) => p.y) as QuadNums, i);
    const func = (t: number) => 0.5 * (x(t) * dy(t) - y(t) * dx(t)); // ???????
    return func;
  });
  let sum = 0;
  for (let i = 0; i < fns.length; i++) {
    sum += integral(i, i + 1, fns[i]);
  }
  return sum;
}
