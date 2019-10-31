function multiply(a,b){

    if (a[0].length !== b.length) throw new RangeError('dimensional mismatch')
  
      const ans = [];
    for (let i=0; i<a.length; i++) ans[i] = [];
    
      for (let rowA=0; rowA<a.length; rowA++){
        for (let colB=0; colB<b[0].length; colB++){
          let val = 0;
          for (let i=0; i<a[0].length; i++){
            val += a[rowA][i] * b[i][colB];
        }
        ans[rowA][colB] = val;
      }
    }
    
    return ans;
  }
  
  const rotationMx = theta => [
      [Math.cos(theta), Math.sin(theta)],
      [-Math.sin(theta), Math.cos(theta)]
  ];


function rotate(p, theta){
      const vec = [[p.x, p.y]];
    const r = rotationMx(theta);
    const result = multiply(vec, r)[0];
    
    return ({
        x: result[0],
        y: result[1]
    })
  }
//////////////////////////////////////////////






class Element{
  constructor(el, attrs){
    this.domElement = document.createElementNS('http://www.w3.org/2000/svg',el);
    if (attrs) this.set(attrs);
  }
  
  set(attrs){
    Object.keys(attrs).forEach(key => {
      this.domElement.setAttribute(key, attrs[key])
    })
  }
  
  append(){
    document.getElementById('svg').appendChild(this.domElement)
  }
}


const p = [
  {x: -40, y: -80},
  {x: -100, y: 150},
  {x: 40, y: -20},
  {x: -80, y: 20}
]

function cubic(p){
    return `M ${p[0].x} ${p[0].y} C ${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`
}

let moved = p.map(point => ({
  x: point.x - p[0].x,
  y: point.y - p[0].y,
}))

const theta = Math.atan(moved[moved.length - 1].y/moved[moved.length - 1].x)
moved = moved.map(point => rotate(point,-theta));


function limits(arr, dim){
   let maxima = [];
   const a = - arr[0][dim] + 3*arr[1][dim] - 3*arr[2][dim] + arr[3][dim];
   const b = 2*arr[0][dim] - 4*arr[1][dim] + 2*arr[2][dim];
   const c = arr[1][dim] - arr[0][dim];
  
   if (Math.abs(a) < 1e-8){
     maxima.push(-c/b)
   } else {
      const rad = b*b - 4*a*c;
      if (rad >= 0){
        maxima.push((-b + Math.sqrt(rad))/(2*a), (-b - Math.sqrt(rad))/(2*a))
      }
   }
  maxima.push(0);
  maxima.push(1);
  
  maxima = maxima.filter(x => x <=1 && x>=0);
 
  const bezier = bez(arr,dim);
  maxima = maxima.map(m => bezier(m));
  
  let max = -Infinity;
  let min = Infinity;
  for (let i=0; i<maxima.length; i++){
    if (maxima[i] > max) max = maxima[i];
    if (maxima[i] < min) min = maxima[i];
  }
  

  
   return [min, max];
}

function bez(arr, dim){
  return function(t){
    return (1-t)*(1-t)*(1-t)*arr[0][dim] + 3*(1-t)*(1-t)*t*arr[1][dim] + 3*(1-t)*t*t*arr[2][dim] + t*t*t*arr[3][dim];
  }
}

let xLims = limits(moved, 'x');
let yLims = limits(moved, 'y');

const corners = [
  {x: xLims[0], y: yLims[0]},
  {x: xLims[0], y: yLims[1]},
  {x: xLims[1], y: yLims[0]},
  {x: xLims[1], y: yLims[1]},
].map(point => rotate(point, theta)).map(point => ({x: point.x + p[0].x, y: point.y + p[0].y}))

let center = rotate({
  x: (xLims[0] + xLims[1])/2,
  y: (yLims[0] + yLims[1])/2,
},theta);
center = {x: center.x + p[0].x, y: center.y + p[0].y}


const ll = new Element('line');
ll.set({y1: corners[0].y, y2: corners[1].y, x1: corners[0].x, x2: corners[1].x, stroke: 'red' });
ll.append();

const lr = new Element('line');
lr.set({y1: corners[1].y, y2: corners[3].y, x1: corners[1].x, x2: corners[3].x, stroke: 'red' });
lr.append();

const lt = new Element('line');
lt.set({y1: corners[2].y, y2: corners[3].y, x1: corners[2].x, x2: corners[3].x, stroke: 'red' });
lt.append();

const lb = new Element('line');
lb.set({y1: corners[2].y, y2: corners[0].y, x1: corners[2].x, x2: corners[0].x, stroke: 'red' });
lb.append();

const ctr = new Element('circle');
ctr.set({cx: center.x, cy: center.y, r: 2});
ctr.append();



const c = new Element('path');
c.set({d: cubic(p), stroke: 'black', fill: 'transparent'});
c.append();


{/* <svg id='svg' viewBox="-100 -100 200 200" height="400" style="outline: 1px solid #aaa">
  
  </svg> */}