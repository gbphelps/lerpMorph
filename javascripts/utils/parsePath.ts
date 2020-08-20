// NOTE: takes a path's d attribute (as a string) and returns an array of commands in the form:
// { type: CHAR, params: ARR } example:
/*

'M 0 4 L 5 5 q 10 10 -20 20 Z' => [
    {type: 'M', params: [0, 4]},
    {type: 'L', params: [5, 5]},
    {type: 'q', params: [10, 10, -20, 20]},
    {type: 'Z', params: []}
]

*/

import { AnyCommand, AbsoluteCommandType, RelativeCommandType } from '../types';

// The regex should recognize any valid javascript float format
// (e.g. 200, 2e5, 3.e-2, +4, -50e-2, .3)

export default function getCommands(path: string) {
  const floatRx = /([+-]{0,1}(?:(?:\d+\.)|(?:\.\d)|\d){1}\d*(?:e[+-]{0,1}\d+){0,1})/g;
  const commandRx = /([MmLlCcQqHhVvSsTtAaZz])((?: *(?:[+-]{0,1}(?:(?:\d+\.)|(?:\.\d)|\d){1}\d*(?:e[+-]{0,1}\d+){0,1})* *\,{0,1})*)/g;

  const commands: { type: string, params: number[] }[] = [];
  let command;
  // eslint-disable-next-line no-cond-assign
  while (command = commandRx.exec(path)) {
    const type = command[1] as AbsoluteCommandType | RelativeCommandType;
    const params = [];
    let float;
    // eslint-disable-next-line no-cond-assign
    while (float = floatRx.exec(command[2])) {
      params.push(+float[1]);
    }
    commands.push({ type, params });
  }
  return commands.reduce<AnyCommand[]>((acc, cmd) => {
    let paramLength = 0;
    switch (cmd.type) {
      case ('a'):
      case ('A'):
        paramLength = 7;
        break;
      case ('H'):
      case ('h'):
      case ('V'):
      case ('v'):
        paramLength = 1;
        break;
      case ('L'):
      case ('l'):
      case ('M'):
      case ('m'):
      case ('T'):
      case ('t'):
        paramLength = 2;
        break;
      case ('C'):
      case ('c'):
        paramLength = 6;
        break;
      case ('Q'):
      case ('q'):
      case ('S'):
      case ('s'):
        paramLength = 4;
        break;
      case ('Z'):
      case ('z'):
        paramLength = 0;
        break;
      default:
        throw new Error(`Invalid command ${(cmd as any).type} detected in path.`);
    }
    if (paramLength === 0) {
      if (cmd.params.length !== 0) throw new Error(`Command of type ${cmd.type} takes no parameters, but ${cmd.params.length} were found.`);
      acc.push({
        type: cmd.type,
        params: [],
      });
      return acc;
    }

    const sets = Math.floor(cmd.params.length / paramLength);
    if (sets * paramLength !== cmd.params.length) throw new Error(`Detected a ${cmd.type} command with an invalid number of paramaters. Expected a multiple of ${paramLength}, got: ${cmd.params.length}`);
    for (let i = 0; i < sets; i++) {
      acc.push({
        type: cmd.type,
        params: cmd.params.slice(i * paramLength, (i + 1) * paramLength),
      });
    }
    return acc;
  }, []);
}
