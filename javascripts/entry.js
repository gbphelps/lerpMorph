import ellipseToBezier from './utils/ellipseToBezier';

let start = {x: 10, y: 50};
let end = {x: 0, y: 50};
const dir = 1;

const Rx = 150;
const Ry = 80;

const rotation = 10;
const sweep = 1;
const maxTheta = Math.PI;

//////////////

const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
svg.setAttribute('viewBox', '0 0 300 300');
svg.setAttribute('height', 500);

const path_d = ellipseToBezier({start, end, dir, Rx, Ry, rotation, sweep, maxTheta});

let d = `M ${path_d[0].x} ${path_d[0].y}`;
for (let i=0; i<(path_d.length-1)/3; i++){
    const p = path_d.slice(i*3 + 1, i*3 + 4);
    d += `C ${p[0].x} ${p[0].y} ${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y}`
}

const path = document.createElementNS('http://www.w3.org/2000/svg','path');
path.setAttribute('d', d);


document.addEventListener('DOMContentLoaded',()=>{
    document.body.appendChild(svg);
    svg.appendChild(path);
})
