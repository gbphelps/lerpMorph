import multiply from './crossProduct'


const rotationMx = theta => [
    [Math.cos(theta), Math.sin(theta)],
    [-Math.sin(theta), Math.cos(theta)]
];


export default function rotate(p, theta){
    const vec = [[p.x, p.y]];
  const r = rotationMx(theta);
  const result = multiply(vec, r)[0];
  
  return ({
      x: result[0],
      y: result[1]
  })
}