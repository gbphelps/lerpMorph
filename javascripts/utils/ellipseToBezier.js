import rotate from '../vectors/rotate';


/*

Ellipses are a pain, so the algorithm below just transforms the space by 
(1) rotating until the ellipse axes are orthogonal to the x y axes, and then 
(2) scaling one of the axes to "unsquish" the ellipse into a circle. 
The algorithm then solves for the bezier control points in the transformed space as if the shape were a circle, and finally applies the reverse transformations to the control points before the bezier is drawn.
Bezier curves can approximate arcs super well, it turns out. However, at some point beyond pi radians, that approximation starts to fall apart. For this reason, the algorithm takes a max theta and divides the arc into as many sub-arcs as needed so that no arc angle exceeds the max theta. 

The function errors out for sets of parameters that have no arc solution (in contrast, SVG patches the non-existent curve with a half arc - need to examine the w3 spec so that I can match this behavior)
*/

function norm(a){
  const div = Math.sqrt(a.x*a.x + a.y*a.y);
  return {x: a.x/div, y: a.y/div}
}

function mag(a,b){
  const x = a.x - b.x;
  const y = a.y - b.y;
  return Math.sqrt(x*x + y*y);
}


export default function bezEllipse({
    start,
    end,
    dir,
    Rx,
    Ry,
    rotation,
    sweep, 
    maxTheta
}){
  
  function map(a){
    let result = rotate(a, -rotation* Math.PI/180);
    return {x: result.x * Ry/Rx, y: result.y}
  }
  
  function revMap(a){
    let result = {x: a.x * Rx/Ry, y: a.y};
    return rotate(result, rotation * Math.PI/180);
  }
  
  let startMap = map(start);
  let endMap= map(end);


  let mid = { x: (startMap.x + endMap.x) / 2, y: (startMap.y + endMap.y) / 2 }
  let slope = norm({ x: endMap.x - startMap.x, y: endMap.y - startMap.y });
  
  const theta = 2*Math.asin(mag(startMap,endMap)/(2*Ry));

  
  const thetaEffective = sweep ? Math.PI * 2 - theta : theta;
  if (thetaEffective > maxTheta){
    const num = Math.ceil(thetaEffective/maxTheta);
    const tSlice = thetaEffective / num;
    console.log(tSlice * (num-1), thetaEffective, num)
    const chordToCenter = Ry * Math.cos(theta/2);
    
    const center = {
      x: mid.x + (sweep===dir ? 1: -1) * slope.y * chordToCenter,
      y: mid.y + (sweep===dir ? -1 : 1) * slope.x * chordToCenter
    }
    
    
    let line = {x: startMap.x - center.x, y: startMap.y - center.y};
    const points = [{x: center.x + line.x, y: center.y + line.y}];
    for (let i=0; i<num; i++){
      line = rotate(line, (dir ? 1 : -1) * tSlice );
      points.push({x: center.x + line.x, y: center.y + line.y});
    }
    
    let path = [start];
    for(let i=0; i< points.length-1; i++){
      const a = revMap(points[i]);
      const b = revMap(points[i+1]);
      path = path.concat(bezEllipse({start: a, end: b, dir, Rx, Ry, rotation, maxTheta, sweep: tSlice > Math.PI ? 1 : 0}).slice(1))
    }
    return path;
    
  }
  



  const controlDist = 4/3*Ry*(1-Math.cos(theta/2))/(Math.sin(theta/2));


  let l1 = {x: slope.x * controlDist, y: slope.y*controlDist};
  l1 = rotate(l1, dir ? -theta/2 : theta/2);

  let l2 = {x: slope.x * controlDist * -1, y: slope.y * controlDist * -1}
  l2 = rotate(l2, dir? theta/2 : -theta/2);



  l1 = revMap(l1);
  l2 = revMap(l2);


  return [
    start, 
    {x: start.x + l1.x, y: start.y + l1.y},
    {x: end.x + l2.x, y: end.y + l2.y},
    end
  ]
  
}
