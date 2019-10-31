//this is WAY faster O(1) vs O(log(n)) than the approximation used in the other pen and WAY more precise. You can use a higher order approximation (e.g. Six-point or Seven-point quadrature) if you need even more precision. Convergence is incredibly fast. https://en.wikipedia.org/wiki/Gaussian_quadrature

export default function arcLength(controlPoints){
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

  const dxdt = deriv(controlPoints.map(p => p.x));
  const dydt = deriv(controlPoints.map(p => p.y));
  
  //derivative of arclength; the thing to be integrated
  function d_arcLength(t){
    const x = dxdt(t);
    const y = dydt(t);
    return Math.sqrt(x*x + y*y)
  }
  
  //Gaussian quadrature to implement integration
  function integral(t0, t1){
    let sum = 0;
    for (let i=0; i<5; i++){
      const t = (t1-t0)/2*x[i] + (t0 + t1)/2;
      sum += (t1-t0)/2 * w[i] * d_arcLength(t);
    }
    return sum;
  }
  
  //arcLength returns a function that takes in a start t and an end t,
  //and then spits out the length from start to end.
  return function(start,end){
    return integral(start,end)
  }
  
}


//todo: implement a binary search function that repeatedly splits the bezier and calls arcLength until the correct length has been achieved.
