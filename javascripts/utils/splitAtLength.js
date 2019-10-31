import split from './splitBezier';
import arcLength from './bezierLength';

// this is a (sort of lazy) binary search to split a curve at a given arclength.
// takes in the control points `ctrlPoints` and a desired clipping length `targetLength`.
// Returns an array of two sets of ctrlPoints: 
// the first of these is a piece of the curve (starting from the curve's beginning), that is 
// `targetLength` units long. The second is the remainder of the curve.



//NOTE this function will NOT NECESSARILY CONVERGE if the error of your length function is higher than the error of this one!
export default function getTforLength(ctrlPoints, targetLength){
    
    const cutoff=100;
    
    
    const getLength = arcLength(ctrlPoints);
    const totalLength =  getLength(0, 1)
    if (targetLength > totalLength ) throw new Error(`You indicated a target length of ${targetLength}, but the given curve is only ${totalLength} units long`)
    let bounds = {
        low: 0,
        high: 1,
    }
    let guess = {t: null, len: null};
    let i = 0;
    do {
        guess.t = (bounds.high + bounds.low)/2;
        guess.len = getLength(0, guess.t);
        if (guess.len < targetLength){
            bounds.low = guess.t;
        } else {
            bounds.high = guess.t;
        }
        i++
    } while (Math.abs(i < cutoff && guess.len - targetLength) > 1e-16); 
    if ( i === cutoff) console.log('WARNING: the desired precision could not be obtained because of a mismatch of error magnitudes in one or more of the subordinate functions.')
    console.log(`took ${i} tries`);
    return split(ctrlPoints,guess.t);
}