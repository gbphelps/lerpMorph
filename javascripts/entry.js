import ellipseToBezier from './utils/ellipseToBezier';

let start = {x: 10, y: 50};
let end = {x: 0, y: 50};
const dir = 1;

const Rx = 150;
const Ry = 80;

const rotation = 30;
const sweep = 1;
const maxTheta = Math.PI;

//////////////

const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
svg.setAttribute('viewBox', '-300 -300 600 600');
svg.setAttribute('height', 500);

const d = ellipseToBezier({start, end, dir, Rx, Ry, rotation, sweep, maxTheta});
const path = document.createElementNS('http://www.w3.org/2000/svg','path');
path.setAttribute('d', d.map(c => c.command + c.params.join(',')).join() );


document.addEventListener('DOMContentLoaded',()=>{
    document.body.appendChild(svg);
    svg.appendChild(path);
})
