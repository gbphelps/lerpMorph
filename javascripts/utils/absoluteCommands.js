//takes a string of commands in the form {type: CHAR, params: [FLOAT]} and: 
/* 
    (1) changes 'H', 'h', 'V', and 'v' commands into 'L' commands.
    (2) changes curve shortcuts (i.e. 'S', 's', 'T' and 't') into explict 'C' and 'Q' commands.
    (3) changes 'Z' and 'z' commands into 'L' commands.
    (4) changes all other lowercase commands into their non-relative uppercase equivalent.
*/


function absoluteCommands(commands){
  
    const degenerateCommands = new Set(['H', 'V', 'h', 'v']);
    const relativeCommands = new Set(['m','l','c','q','s','t','a']);
    const shortcuts = new Set(['S', 'T', 's', 't']);
    const validPredecessor = {'S': 'C', 'T': 'Q'}
  
    let normalizedCommands = [];
    let start = [0,0];
    
    for (let i=0; i<commands.length; i++){
      const {type, params} = commands[i];
      let prev = normalizedCommands[i-1];
      let [x,y] = prev ? prev.params.slice(-2) : [0,0];
      
    
      
      //M,m
      if (type.toUpperCase() === 'M'){
        const nParams = Array.from(params);    
        nParams[0] += (type === 'm' ? x : 0);
        nParams[1] += (type === 'm' ? y : 0);
        start = nParams; //reset the stored 'start' location.
        normalizedCommands.push({type: 'M', params: nParams});
        continue;
      }
      
      
      //H,h,V,v
      if (degenerateCommands.has(type)){
        normalizedCommands.push({
          type: 'L',
          params: [
            (type === 'H' ? 0 : x) + (type.toUpperCase() === 'H' ? params[0] : 0),
            (type === 'V' ? 0 : y) + (type.toUpperCase() === 'V' ? params[0] : 0)
          ]
        })
        continue;
      }
    
      //a
      if(type === 'a'){
        const nParams = Array.from(params);
        nParams[5] += x;
        nParams[6] += y;
        normalizedCommands.push({
          type: 'A',
          params: nParams
        })
        continue;
      }
     
      //S,s,T,t
      if (shortcuts.has(type)){
  
          let control = null;
          if (!prev || validPredecessor[type.toUpperCase()] !== prev.type){
            control = [x,y]; //patch malformed path with current cursor position.
          } else {
            const prev1 = prev.params.slice(-4,-2);
            control = [2*x - prev1[0], 2*y - prev1[1]] //mirror final control line of previous command.
          }
  
          normalizedCommands.push({
            type: type.toUpperCase() === 'S' ? 'C' : 'Q',    
            params: control.concat(
              type.toUpperCase() !== type ? 
              params.map((p,i) => p + [x,y][i%2]) : 
              params
            )
          });
          continue;  
      }
      
      //c,q,l,s,t
      if (relativeCommands.has(type)){
  
        normalizedCommands.push({
          type: type.toUpperCase(),
          params: params.map((p,i) => p + [x,y][i%2])
        })
        continue;
      }
    
      //Z,z
      if (type.toUpperCase() === 'Z'){
        normalizedCommands.push({
          type: 'L',
          params: Array.from(start) // line to stored start position - copies the array to avoid mutations.
        });
        continue;
      }
      
      
      //C,Q,L,S,T
      normalizedCommands.push(commands[i]);
    }
    
  
    return normalizedCommands
  }