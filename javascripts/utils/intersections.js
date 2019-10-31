import split from './splitBezier';


export function segment(ctrlPoints, n){
    const segments = [];
    let current = ctrlPoints;
    for (let i=0; i<n-1; i++){
        const [seg, rest] = split(current, 1/(n-i));
        segments.push(seg);
        current = rest;
    }
    segments.push(current);
    return segments;
}

export function lineIntersection(l1points, l2points){
    const [p0, p1] = l1points;
    const [p2, p3] = l2points;
    
    const x_l1 = p1.x-p0.x;
    const y_l2 = p3.y-p2.y;
    const y_l1 = p1.y-p0.y;
    const x_l2 = p3.x-p2.x;

    const divisor = (x_l1)*(y_l2) - (y_l1)*(x_l2);
    if (divisor === 0) return null;
    const numerator = (x_l1)*(y_l2)*p2.x - (x_l2)*(x_l1)*(p2.y-p0.y) - (y_l1)*(x_l2)*p0.x;

    const x = numerator/divisor;
    const y = (y_l1)/(x_l1)*(x - p0.x) + p0.y;
    return {x,y};
}


function mag(a){
    return Math.sqrt(a.x*a.x + a.y*a.y);
}

function len(a,b){
    const x = a.x - b.x;
    const y = a.y - b.y;
    return Math.sqrt(x*x + y*y);
}

export function distanceToLine(p, lpoints){
    if (!isPerpindicularInRange(p,lpoints)) return Infinity;
    const vec1 = {x: p.x - lpoints[0].x, y: p.y - lpoints[0].y};
    const vec2 = {x: lpoints[1].x - lpoints[0].x, y: lpoints[1].y - lpoints[0].y};
    const crossProduct = vec1.x * vec2.y - vec1.y * vec2.x;
    const sin = crossProduct/(mag(vec1)*mag(vec2));
    const distanceToLine = Math.abs(mag(vec1)*sin);
    return distanceToLine;
}

export function isPerpindicularInRange(p, lpoints){
    const m1 = -(lpoints[1].x-lpoints[0].x)/(lpoints[1].y-lpoints[0].y);
    const b1 = p.y - m1 * p.x;
    const m2 = -1/m1;
    const b2 = lpoints[0].y - m2 * lpoints[0].x;
    const x = (b2-b1)/(m1-m2);
    const range = lpoints.map(p => p.x).sort((a,b) => a - b);
    if (range[0] <= x && range[1] >= x) return true;
    return false;
}


export function intersectionDistance(l1points, l2points){
    const intersection = lineIntersection(l1points, l2points);
    const x_range1 = l1points.map(p => p.x).sort((a,b) => a - b);
    const x_range2 = l2points.map(p => p.x).sort((a,b) => a - b);
    if (
        x_range1[0] <= intersection.x && 
        x_range1[1] >= intersection.x && 
        x_range2[0] <= intersection.x &&
        x_range2[1] >= intersection.x
        ) return 0;

    const l1_len = len(...l1points);
    const l2_len = len(...l2points);
    const avg_len = (l1_len + l2_len)/2;

    return Math.min(
        distanceToLine(l1points[0], l2points), 
        distanceToLine(l1points[1], l2points),
        distanceToLine(l2points[0], l1points),
        distanceToLine(l2points[1], l1points),
        len(l1points[0], l2points[0]),
        len(l1points[1], l2points[0]),
        len(l1points[0], l2points[1]),
        len(l1points[1], l2points[1])
    )/avg_len
}

export function findIntersections(ctrlPoints1, ctrlPoints2){
    const tests = [[ctrlPoints1, ctrlPoints2]];
    i = 0;
    while (tests.length && i < 100){
        i++;
        const [curve1, curve2] = tests.shift();
        console.log({curve1, curve2})
        const cseg1 = segment(curve1, 3);
        const cseg2 = segment(curve2, 3);
        const lines1 = cseg1.map(points => [points[0], points[points.length-1]]);
        const lines2 = cseg2.map(points => [points[0], points[points.length-1]]);
        for (let i=0; i<lines1.length; i++){
            const one = lines1[i];
            for (let j=0; j<lines2.length; j++){
                const two = lines2[j];
                if (intersectionDistance(one,two) < 1){
                    tests.push([cseg1[i],cseg2[j]])
                }
            }
        }
    }
}

//if errorToLine < 1, let's say there *might* be an intersection, so recurse.

