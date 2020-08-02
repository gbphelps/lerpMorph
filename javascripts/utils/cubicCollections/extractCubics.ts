import cubicCommands from '../cubicCommands';
import absoluteCommands from '../absoluteCommands';
import parsePath from '../parsePath';
import { Point } from '../../types';

export default function extractCubics(pathString: string) {
  const cmds = cubicCommands(absoluteCommands(parsePath(pathString)));
  const controlPointCollections: Point[][] = [];
  for (let i = 1; i < cmds.length; i++) {
    const controlPoints = [];
    const prevParams = cmds[i - 1].params;
    controlPoints.push({
      x: prevParams[prevParams.length - 2],
      y: prevParams[prevParams.length - 1],
    });
    for (let j = 0; j < 3; j++) {
      controlPoints.push({
        x: cmds[i].params[j * 2],
        y: cmds[i].params[j * 2 + 1],
      });
    }
    controlPointCollections.push(controlPoints);
  }
  return controlPointCollections;
}
