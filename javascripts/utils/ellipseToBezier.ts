import rotate from '../vectors/rotate';
import bumpDegree from './bumpDegree';
import { Vector, Point, AnyCommand } from '../types';

/*

Ellipses are a pain, so the algorithm below just transforms the space by
(1) rotating until the ellipse axes are orthogonal to the x y axes, and then
(2) scaling one of the axes to "unsquish" the ellipse into a circle.
The algorithm then solves for the bezier control points in the
transformed space as if the shape were a circle, and finally
applies the reverse transformations to the control points before the bezier is drawn.
Bezier curves can approximate arcs super well, it turns out.
However, at some point beyond pi radians, that approximation
starts to fall apart. For this reason, the algorithm takes a max
theta and divides the arc into as many sub-arcs as needed so that no
arc angle exceeds the max theta.
*/

interface EllipseConfig {
  start: Point,
  end: Point,
  dir: number,
  Rx: number,
  Ry: number,
  rotation: number,
  sweep: number,
  maxTheta: number,
}

function norm(a: Vector) {
  const div = Math.sqrt(a.x * a.x + a.y * a.y);
  return { x: a.x / div, y: a.y / div };
}

function distance(a: Point, b: Point) {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return Math.sqrt(x * x + y * y);
}

function bezEllipse({
  start,
  end,
  dir,
  Rx,
  Ry,
  rotation,
  sweep,
  maxTheta,
}: EllipseConfig) {
  if (!Rx || !Ry) {
    return bumpDegree(bumpDegree([start, end]));
  }

  function mapIntoCircleCoords(a: Point) {
    const result = rotate(a, -rotation * Math.PI / 180);
    return { x: result.x * Ry / Rx, y: result.y };
  }

  function mapOutOfCircleCoords(a: Point) {
    const result = { x: a.x * Rx / Ry, y: a.y };
    return rotate(result, rotation * Math.PI / 180);
  }

  const startPointCicleCoords = mapIntoCircleCoords(start);
  const endPointCircleCoords = mapIntoCircleCoords(end);

  if (Ry < 0.5 * distance(startPointCicleCoords, endPointCircleCoords)) {
    // This is the way the svg spec handles malformed circle commands.
    // If the radii provided are not large enough to connect the two
    // points (i.e., if the radius is less than half the distance between them),
    // Then scale the x and y radii up to the smallest possible values
    // at which an ellipse can connect the points. Maintain orientation and
    // ratio between Rx and Ry.
    const ratio = Rx / Ry;
    Ry = 0.5 * distance(startPointCicleCoords, endPointCircleCoords);
    Rx = ratio * Ry;
  }

  const mid = {
    x: (startPointCicleCoords.x + endPointCircleCoords.x) / 2,
    y: (startPointCicleCoords.y + endPointCircleCoords.y) / 2,
  };
  const slope = norm({
    x: endPointCircleCoords.x - startPointCicleCoords.x,
    y: endPointCircleCoords.y - startPointCicleCoords.y,
  });

  const theta = 2 * Math.asin(
    distance(startPointCicleCoords, endPointCircleCoords) / (2 * Ry),
  );

  const thetaEffective = sweep ? Math.PI * 2 - theta : theta;
  // based on sweep, determine whether theta needs to be traded out for the complement.

  if (thetaEffective > maxTheta) {
    // how many times larger is theta than our allowable max?
    const num = Math.ceil(thetaEffective / maxTheta);
    // divide theta into that many slices.
    const tSlice = thetaEffective / num;
    // calc distance from chord bisector to center of circle.
    const chordBisectorToCenter = Ry * Math.cos(theta / 2);

    // use this to find the center based on our known slope.
    const center = {
      x: mid.x + (sweep === dir ? 1 : -1) * slope.y * chordBisectorToCenter,
      y: mid.y + (sweep === dir ? -1 : 1) * slope.x * chordBisectorToCenter,
    };
    // find the vector between the center and the start point.
    let radiusVector = {
      x: startPointCicleCoords.x - center.x,
      y: startPointCicleCoords.y - center.y,
    };
    const points = [{
      x: center.x + radiusVector.x,
      y: center.y + radiusVector.y,
    }];
    // subdivide the arc by iteratively rotating the radiusVector and adding it to
    // the center.
    for (let i = 0; i < num; i++) {
      radiusVector = rotate(radiusVector, (dir ? 1 : -1) * tSlice);
      points.push({
        x: center.x + radiusVector.x,
        y: center.y + radiusVector.y,
      });
    }

    let path = [start];
    for (let i = 0; i < points.length - 1; i++) {
      const a = mapOutOfCircleCoords(points[i]);
      const b = mapOutOfCircleCoords(points[i + 1]);
      // collect all of my control points from calling
      // bezEllipse on smaller arcs. Discard the initial
      // point with slice(1), since cubic commands get the
      // initial point from where the previous command ended.
      path = path.concat(bezEllipse({
        start: a,
        end: b,
        dir,
        Rx,
        Ry,
        rotation,
        maxTheta,
        sweep: tSlice > Math.PI ? 1 : 0,
      }).slice(1));
    }
    return path;
  }
  // this is the actual bezier approximation of a circular arc.
  const controlDist = 4 / 3 * Ry * (1 - Math.cos(theta / 2)) / (Math.sin(theta / 2));

  let l1 = {
    x: slope.x * controlDist,
    y: slope.y * controlDist,
  };

  l1 = rotate(l1, dir ? -theta / 2 : theta / 2);

  let l2 = { x: slope.x * controlDist * -1, y: slope.y * controlDist * -1 };
  l2 = rotate(l2, dir ? theta / 2 : -theta / 2);

  l1 = mapOutOfCircleCoords(l1);
  l2 = mapOutOfCircleCoords(l2);

  return [
    start,
    { x: start.x + l1.x, y: start.y + l1.y },
    { x: end.x + l2.x, y: end.y + l2.y },
    end,
  ];
}

export default function ellipseToCubicCommands(config: EllipseConfig) {
  const path = bezEllipse(config);
  const d: AnyCommand[] = [{
    type: 'M',
    params: [path[0].x, path[0].y],
  }];
  for (let i = 0; i < (path.length - 1) / 3; i++) {
    const p = path.slice(i * 3 + 1, i * 3 + 4);
    d.push({
      type: 'C',
      params: [
        p[0].x,
        p[0].y,
        p[1].x,
        p[1].y,
        p[2].x,
        p[2].y,
      ],
    });
  }
  return d;
}
