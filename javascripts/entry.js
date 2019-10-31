import splitAt from './utils/splitAtLength';
import { lineIntersection } from './utils/intersections';

document.addEventListener('DOMContentLoaded',populate);

function populate(){
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('height', 200);
    svg.setAttribute('width', 200);
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.style.background = 'black';

    const line1 = [{x:50, y: 70},{x: 150, y: 10}];
    const line2 = [{x:100, y: 20},{x:50, y: 200}];
    const intersection = lineIntersection(line1, line2);

    [line1,line2].forEach(line => {
        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        path.setAttribute('d', `M ${line[0].x} ${line[0].y} L ${line[1].x} ${line[1].y}`);
        path.setAttribute('fill', 'transparent');
        path.setAttribute('stroke', 'magenta');
        svg.appendChild(path);
    })

    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('r', 2);
    circle.setAttribute('cx', intersection.x);
    circle.setAttribute('cy', intersection.y);
    circle.setAttribute('fill', 'red');
    svg.appendChild(circle);

    document.body.appendChild(svg);
}