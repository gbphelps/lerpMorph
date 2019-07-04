const p = [
    {x: 0, y: 0},
    {x: 100, y: 0},
    {x: 100, y: 100},
    {x: 0, y: 100}
  ]
  
  
  
  ///////////////////////////////
  
  
  
  
  
  
  
  function mult(a,b){
      return {x: a.x * b, y: a.y * b}
  }
  
  function add(...args){
      return {
          x: args.reduce((a,l) => a + l.x, 0),
          y: args.reduce((a,l) => a + l.y, 0)
      }
  }
  
  function sub(a,b){
      return {x: a.x - b.x, y: a.y - b.y}
  }
  
  function div(a,b){
      return {x: a.x / b, y: a.y / b}
  }
  
  
  function mag2(a){
    return a.x*a.x + a.y*a.y
  }
  
  
  function cubic(arr){
      return function(t){
          return add(
              mult( arr[0], (1-t)*(1-t)*(1-t) ),
              mult( arr[1], 3 * (1-t)*(1-t)*t ),
              mult( arr[2], 3 * (1 - t)*t*t ),
              mult( arr[3], t*t*t )
          )
      }
  }
  
  function intermediates(arr){
      return function (t){
          const sets = [];
          let set = arr
          while (set.length >= 1){
              sets.push(set);
              const nextSet = [];
              for( let i=0; i < set.length - 1; i++ ){
                  const diff = sub(set[i+1], set[i]);
                  nextSet.push(
                      add(set[i],mult(diff,t))
                  )
              }
              set = nextSet;
          }
          return sets;
      }
  }
  
  
  function splitBez(arr,t){
      const sets = intermediates(arr)(t);
      const p1 = [];
      const p2 = [];
    
      for (let i = 0; i < arr.length; i++){
        p1.push(sets[i][0]);
        p2.unshift(sets[i][sets[i].length - 1]);
      }  
    
      return [
        p1, p2
      ]
  }
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('height', 300);
  
  const path = document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d',`M ${p[0].x} ${p[0].y} C ${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`);
  path.setAttribute('fill', 'transparent');
  path.setAttribute('stroke', 'black');
  path.setAttribute('stroke-width', 5);
  document.body.appendChild(svg);
  svg.appendChild(path);
  
  const halves = splitBez(p,.4);
  const colors = ['red', 'aqua'];
  halves.forEach((h,i) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d', `M ${h[0].x} ${h[0].y} C ${h[1].x} ${h[1].y} ${h[2].x} ${h[2].y} ${h[3].x} ${h[3].y}`);
    path.setAttribute('fill', 'transparent');
    path.setAttribute('stroke', colors[i]);
    svg.appendChild(path);
  })