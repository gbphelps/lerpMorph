import { findIntersections } from '../beta/intersections';

// document.addEventListener('DOMContentLoaded', populate);

export default function populate() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('height', '200');
  svg.setAttribute('width', '200');
  svg.setAttribute('viewBox', '0 0 200 200');
  svg.style.background = 'black';

  const line1 = [{ x: 0, y: 0 }, { x: 50, y: 400 }, { x: 100, y: -200 }, { x: 150, y: 200 }];
  const line2 = [{ x: 0, y: 80 }, { x: 400, y: 90 }, { x: -200, y: 100 }, { x: 200, y: 110 }];
  const ixx = findIntersections(line1, line2);

  [line1, line2].forEach((line) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${line[0].x} ${line[0].y} C ${line[1].x} ${line[1].y} ${line[2].x} ${line[2].y} ${line[3].x} ${line[3].y}`);
    path.setAttribute('fill', 'transparent');
    path.setAttribute('stroke', 'magenta');
    path.setAttribute('stroke-opacity', '0.4');
    svg.appendChild(path);
  });

  ixx.forEach((ix) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '1');
    circle.setAttribute('cx', ix.x.toString());
    circle.setAttribute('cy', ix.y.toString());
    circle.setAttribute('fill', 'white');
    svg.appendChild(circle);
  });

  document.body.appendChild(svg);
}
