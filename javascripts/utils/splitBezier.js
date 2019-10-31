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
  
  //get the deCastlejau net @ t
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
  
  
  //takes an array of control points and splits the curve at a given value of t
  export default function splitBez(arr,t){
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
  