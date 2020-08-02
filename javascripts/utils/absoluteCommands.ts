// takes a string of commands in the form {type: CHAR, params: [FLOAT]} and:
/*
    (1) changes 'H', 'h', 'V', and 'v' commands into 'L' commands.
    (2) changes curve shortcuts (i.e. 'S', 's', 'T' and 't') into explict 'C' and 'Q' commands.
    (3) changes 'Z' and 'z' commands into 'L' commands.
    (4) changes all other lowercase commands into their non-relative uppercase equivalent.
*/

import { AnyCommand, AbsoluteCommandType, toUpperCaseMap } from '../types';

export default function AbsoluteCommandTypes(commands: AnyCommand[]) {
  const degenerateCommands = new Set(['H', 'V', 'h', 'v']);
  const RelativeCommandTypes = new Set(['m', 'l', 'c', 'q', 's', 't', 'a']);
  const shortcuts = new Set(['S', 'T', 's', 't']);
  const validPredecessor = { S: 'C', T: 'Q' };
  // TODO: S and T can also be chained., so validPredecessor needs to be arrays [S, C] and [Q,T]

  const normalizedCommands: {type: AbsoluteCommandType, params: any}[] = [];
  let start = [0, 0];

  for (let i = 0; i < commands.length; i++) {
    const { type, params } = commands[i];
    const prev = normalizedCommands[i - 1];
    const [x, y] = prev ? prev.params.slice(-2) : [0, 0];

    // M,m
    if (toUpperCaseMap[type] === 'M') {
      const nParams = [...params];
      nParams[0] += (type === 'm' ? x : 0);
      nParams[1] += (type === 'm' ? y : 0);
      start = nParams; // reset the stored 'start' location.
      normalizedCommands.push({ type: 'M', params: nParams });
      continue;
    }

    // H,h,V,v
    if (degenerateCommands.has(type)) {
      normalizedCommands.push({
        type: 'L',
        params: [
          (type === 'H' ? 0 : x) + (toUpperCaseMap[type] === 'H' ? params[0] : 0),
          (type === 'V' ? 0 : y) + (toUpperCaseMap[type] === 'V' ? params[0] : 0),
        ],
      });
      continue;
    }

    // a
    if (type === 'a') {
      const nParams = [...params];
      nParams[5] += x;
      nParams[6] += y;
      normalizedCommands.push({
        type: 'A',
        params: nParams,
      });
      continue;
    }

    // S,s,T,t
    if (shortcuts.has(type)) {
      let control = null;
      const uppercase = toUpperCaseMap[type] as 'S' | 'T';
      if (!prev || validPredecessor[uppercase] !== prev.type) {
        control = [x, y];
        // use current cursor position.
      } else {
        const prev1 = prev.params.slice(-4, -2);
        control = [2 * x - prev1[0], 2 * y - prev1[1]];
        // mirror final control line of previous command.
      }

      normalizedCommands.push({
        type: toUpperCaseMap[type] === 'S' ? 'C' : 'Q',
        params: control.concat(
          toUpperCaseMap[type] !== type
            ? params.map((p, idx) => p + [x, y][idx % 2])
            : params,
        ),
      });
      continue;
    }

    // c,q,l,s,t
    if (RelativeCommandTypes.has(type)) {
      normalizedCommands.push({
        type: toUpperCaseMap[type],
        params: params.map((p, idx) => p + [x, y][idx % 2]),
      });
      continue;
    }

    // Z,z
    if (toUpperCaseMap[type] === 'Z') {
      normalizedCommands.push({
        type: 'L',
        params: [...start],
        // line to stored start position - copies the array to avoid mutations.
      });
      continue;
    }

    // C,Q,L,S,T
    const command = {
      type: commands[i].type as AbsoluteCommandType,
      params: commands[i].params,
    };
    normalizedCommands.push(command);
  }

  return normalizedCommands;
}
