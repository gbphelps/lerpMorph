import ellipseToBezier from './utils/ellipseToBezier';


import parsePath from './utils/parsePath';
import absoluteCommands from './utils/absoluteCommands';
import cubicCommands from './utils/cubicCommands';


const d = 'M -20 -30 A 0 1.5 30 1 0 300 200'

const cubics = cubicCommands(absoluteCommands(parsePath(d)));

console.log(cubics)




const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
svg.setAttribute('viewBox', '-300 -300 600 600');
svg.setAttribute('height', 500);



const path2 = document.createElementNS('http://www.w3.org/2000/svg','path');
path2.setAttribute('d', d);
path2.setAttribute('fill', 'transparent');
path2.setAttribute('stroke', 'black');
path2.setAttribute('stroke-width',10);

const path = document.createElementNS('http://www.w3.org/2000/svg','path');
const dNew = cubics.map(c => c.type + c.params.join(',')).join('');
console.log(dNew)
path.setAttribute('d', dNew);
path.setAttribute('fill', 'transparent');
path.setAttribute('stroke', 'aqua')


document.addEventListener('DOMContentLoaded',()=>{
    document.body.appendChild(svg);
    svg.appendChild(path2);
    svg.appendChild(path);
})
