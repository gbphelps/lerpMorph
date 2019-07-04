//this is WAY faster O(1) vs O(log(n)) than the approximation used in the other pen and WAY more precise. You can use a higher order approximation (e.g. Six-point or Seven-point quadrature) if you need even more precision. Convergence is incredibly fast. https://en.wikipedia.org/wiki/Gaussian_quadrature



const points = [{x: 0, y: 20},{x: 100, y: 0},{x: 40, y: 100}, {x: 0, y: 100}];

function arcLength(controlPoints){
  function deriv(c){
    return function(t){
        return -3*c[0] * (1-t)*(1-t) +
          3*c[1] * (1-t)*(1-3*t) +
          3*c[2] * t*(2-3*t) +
          3*c[3] * t*t
      }
   }

  const n = 5;
  
  const x = [
    -(1/3)*Math.sqrt(5+2*Math.sqrt(10/7)),
    -(1/3)*Math.sqrt(5-2*Math.sqrt(10/7)),
    0,
    (1/3)*Math.sqrt(5-2*Math.sqrt(10/7)),
    (1/3)*Math.sqrt(5+2*Math.sqrt(10/7)),
  ];
  
  const w = [
  (322-13*Math.sqrt(70))/900,
  (322+13*Math.sqrt(70))/900,
  128/225,
  (322+13*Math.sqrt(70))/900,
  (322-13*Math.sqrt(70))/900
];

  const X = deriv(controlPoints.map(p => p.x));
  const Y = deriv(controlPoints.map(p => p.y));
  
  function d_arcLength(t){
    const x = X(t);
    const y = Y(t);
    return Math.sqrt(x*x + y*y)
  }
  
  function integral(t0, t1){
    let sum = 0;
    for (let i=0; i<5; i++){
      const t = (t1-t0)/2*x[i] + (t0 + t1)/2;
      sum += (t1-t0)/2 * w[i] * d_arcLength(t);
    }
    return sum;
  }
  
  return function(start,end){
    return integral(start,end)
  }
  
}


const a = arcLength(points);

console.log(a(0,.5));