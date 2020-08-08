import './demos/intersections';

// import { getCubicRoots } from 'minimatrix-polyroots';
// import parsePath from './utils/parsePath';
// import absoluteCommands from './utils/absoluteCommands';
// import cubicCommands from './utils/cubicCommands';
// import arclength from './utils/bezierLength';
// import area from './utils/cubicCollections/area';
// import extractCubics from './utils/cubicCollections/extractCubics';
// import centroid from './utils/cubicCollections/centroid';

// function init() {
//   const d = 'M 0 0 L 40 0 A 20 20 0 0 0 0 0';
//   const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//   svg.setAttribute('viewBox', '-100 -100 200 200');
//   const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//   path.setAttribute('d', d);
//   path.setAttribute('stroke', 'black');
//   path.setAttribute('fill', 'transparent');
//   svg.appendChild(path);
//   document.body.appendChild(svg);

//   const cmds = cubicCommands(absoluteCommands(parsePath(d)));
//   const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//   let d2 = '';
//   cmds.forEach((cmd) => {
//     d2 = `${d2 + cmd.type} ${cmd.params.join(' ')}`;
//   });
//   path2.setAttribute('stroke', 'red');
//   path2.setAttribute('fill', 'transparent');
//   path2.setAttribute('d', d2);
//   svg.appendChild(path2);

//   demo(d);
// }

// document.addEventListener('DOMContentLoaded', () => {
//   init();
// });

// function demo(d: string) {
//   const cubics = extractCubics(d);
//   const c = centroid(cubics);

//   // A: (c[3] - 3 * c[2] + 3 * c[1] - c[0])
//   // B: (3 * c[2] - 6 * c[1] + 3 * c[0])
//   // C: (3 * c[1] - 3 * c[0])
//   // D: c[0] - X

//   interface ComplexNumber {
//     real: number,
//     imag: number,
//   }

//   cubics.forEach((points) => {
//     const roots = getCubicRoots(
//       points[3].x - 3 * points[2].x + 3 * points[1].x - points[0].x,
//       3 * points[2].x - 6 * points[1].x + 3 * points[0].x,
//       3 * points[1].x - 3 * points[0].x,
//       points[0].x - c.x,
//     ).filter(({ real, imag }: ComplexNumber) => {
//       if (imag) return false;
//       if (real > 1 || real < 0) return false;
//       return true;
//     });
//     console.log({ points, roots });
//   });

//   console.log(c);
//   const pp = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
//   pp.setAttribute('r', '1');
//   pp.setAttribute('cx', c.x.toString());
//   pp.setAttribute('cy', c.y.toString());
//   document.getElementsByTagName('svg')[0].appendChild(pp);

//   console.log(area(cubics));
//   console.log(cubics.reduce(
//     (acc, cps) => arclength(cps)(0, 1) + acc, 0,
//   ));
// }
