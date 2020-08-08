import { findIntersections } from '../beta/intersections';
import segment from '../utils/segmentCubic';

document.addEventListener('DOMContentLoaded', populate);

export default function populate() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('height', '200');
  svg.setAttribute('width', '200');
  svg.setAttribute('viewBox', '0 0 200 200');
  svg.style.background = 'black';

  const line1 = [{ x: 0, y: 0 }, { x: 1, y: 500 }, { x: 100, y: -200 }, { x: 150, y: 200 }];
  let pieces1 = segment(line1, 3);
  pieces1 = pieces1.map((p) => p.map(({ x, y }) => ({ x: x.toFixed(4), y: y.toFixed(4) })));

  ['red', 'lime', 'blue'].forEach((color, i) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('stroke', color);
    const d = `M ${pieces1[i][0].x} ${pieces1[i][0].y} C ${pieces1[i][1].x} ${pieces1[i][1].y} ${pieces1[i][2].x} ${pieces1[i][2].y} ${pieces1[i][3].x} ${pieces1[i][3].y}`;
    line.setAttribute('d', d);
    line.setAttribute('fill', 'transparent');
    svg.appendChild(line);
  });

  const line2 = [{ x: 0, y: 80 }, { x: 400, y: 90 }, { x: -200, y: 0 }, { x: 200, y: 110 }];
  let pieces2 = segment(line2, 3);
  pieces2 = pieces2.map((p) => p.map(({ x, y }) => ({ x: x.toFixed(4), y: y.toFixed(4) })));

  ['red', 'lime', 'blue'].forEach((color, i) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('stroke', color);
    const d = `M ${pieces2[i][0].x} ${pieces2[i][0].y} C ${pieces2[i][1].x} ${pieces2[i][1].y} ${pieces2[i][2].x} ${pieces2[i][2].y} ${pieces2[i][3].x} ${pieces2[i][3].y}`;
    line.setAttribute('d', d);
    line.setAttribute('fill', 'transparent');
    svg.appendChild(line);
  });

  const ixx = findIntersections(line1, line2);

  //   [line1, line2].forEach((line) => {
  //     const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  //     path.setAttribute('d', `M ${line[0].x} ${line[0].y} C ${line[1].x} ${line[1].y} ${line[2].x} ${line[2].y} ${line[3].x} ${line[3].y}`);
  //     path.setAttribute('fill', 'transparent');
  //     path.setAttribute('stroke', 'magenta');
  //     path.setAttribute('stroke-opacity', '0.4');
  //     svg.appendChild(path);
  //   });

  ixx.forEach((ix) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '2');
    circle.setAttribute('cx', ix.x.toString());
    circle.setAttribute('cy', ix.y.toString());
    circle.setAttribute('fill', 'yellow');
    svg.appendChild(circle);
  });

  document.body.appendChild(svg);
}
