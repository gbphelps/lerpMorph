import ellipseToBezier from './ellipseToBezier';
import bumpDegree from './bumpDegree';

//translates all commands into their corresponding cubic bezier
//(approximates ellipses with bezier segments so that no bezier
//is responsible for an arclength spanning more than PI radians)


export default function cubicCommands(absoluteCommands){
    const cubics = [];
    const accepted = new Set(['M','C'])
    
    for (let i = 0; i < absoluteCommands.length; i++){
      const command = absoluteCommands[i];
     
      if (accepted.has(command.type)){
        cubics.push(command);
        continue;
      }

      if (command.type === 'A'){
        let prev = absoluteCommands[i-1].params;
        const [Rx, Ry, rotation, sweep, dir, x, y] = command.params;
        const end = {x, y};
        const start = {x: prev[prev.length-2], y: prev[prev.length-1]}
        const newCommands = ellipseToBezier({
          Rx, Ry, rotation, sweep, dir, start, end, maxTheta: Math.PI
        });
        for (let i=1; i<newCommands.length; i++) cubics.push(newCommands[i]);
        continue;
      }
      
      if (command.type === 'L' || command.type === 'Q'){
        let prev = absoluteCommands[i-1].params;
        let points = [{x: prev[prev.length-2], y: prev[prev.length - 1]}] 
        //NOTE: had to add previous point, because it's part of the control configuration
        
        for(let i=0; i<command.params.length/2; i++) points.push({
          x: command.params[i*2], y: command.params[i*2+1]
        });
        
        while (points.length < 4) points = bumpDegree(points);
        
        const params = [];
        for (let i=1; i<points.length; i++) params.push(points[i].x, points[i].y); 
        //NOTE: now we strip the previous point by starting at i=1, because it's not part of the path definition
  
        cubics.push({
          type: 'C',
          params
        });
        continue;
      }    
    }
    
    return cubics;
  }