//NOTE: takes a path's d attribute (as a string) and returns an array of commands in the form:
//{ type: CHAR, params: ARR } example:
/*

'M 0 4 L 5 5 q 10 10 -20 20 Z' => [
    {type: 'M', params: [0, 4]},
    {type: 'L', params: [5, 5]},
    {type: 'q', params: [10, 10, -20, 20]},
    {type: 'Z', params: []}
]

*/

//The regex should recognize any valid javascript float format (e.g. 200, 2e5, 3.e-2, +4, -50e-2, .3)


export default function getCommands(path){
    const floatRx = /([+-]{0,1}(?:(?:\d+\.)|(?:\.\d)|\d){1}\d*(?:e[+-]{0,1}\d+){0,1})/g;
    const commandRx = /([MmLlCcQqHhVvSsTtAaZz])((?: *(?:[+-]{0,1}(?:(?:\d+\.)|(?:\.\d)|\d){1}\d*(?:e[+-]{0,1}\d+){0,1})* *\,{0,1})*)/g;
    
    let commands = [];
    let command;
    while (command = commandRx.exec(path)){
       const type = command[1];
       const params = [];
       let float;
       while(float = floatRx.exec(command[2])){
         params.push(+float[1])
       }
      commands.push({type, params})
    }
    return commands;
  }
  