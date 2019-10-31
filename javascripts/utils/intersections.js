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