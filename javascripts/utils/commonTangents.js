function curve(c){
    return function(t){
            c[0] * (1-t)*(1-t)*(1-t)  +
            c[1] * 3 * (1-t)*(1-t)*t +
            c[2] * 3 * (1 - t)*t*t  +
            c[3] * t*t*t
    }
}


function deriv(c){
    return function(t){
        return -3*c[0] * (1-t)*(1-t) +
          3*c[1] * (1-t)*(1-3*t) +
          3*c[2] * t*(2-3*t) +
          3*c[3] * t*t
    }
}

function deriv2(c){
    return function(t){
        6 * (1-t) * (c[2] - 2*c[1] + c[0]) +
        6 * t * (c[3] - 2*c[2] + c[1])
    }
}

// We have curve A and curve B.
// A common tangent must occur when:
// For some parameter t on A and some parameter s on B,
// A'(t) = B'(s) = slope(A(t),B(s))


//a: controlPoints[];
//b: controlPoints[];

// f1 = (dAy/dt / dAx/dt) - (dBy/ds / dBx/ds)

// d(f1)/dt = 
//second term vanishes; not dependent on t.
const ax = a.map(p => p.x);
const ay = a.map(p => p.y);

const df1dt = (t,_s) => (
    deriv2(ay)(t) * deriv(ax)(t) -
    deriv(ay)(t) * deriv2(ax)(t)
) / deriv(ax)(t)**2

//d(f1)/ds = 
//first term vanishes; not dependent on s.
const bx = b.map(p => p.x);
const by = b.map(p => p.y);

const df1ds = (_t,s) => (
    deriv(by)(s) * deriv2(bx)(s) -
    deriv2(by)(s) * deriv(bx)(s)
) / deriv(bx)(s)**2


// f2 = dAy/dt / dAx/dt - (Ay - By) / (Ax - Bx)

// d(f2)/dt =

// [(dAy/dt)(Ax - Bx) - (Ay - By)(dAx/dt)] / (Ax - Bx)**2
const denom = (t,s) => (curve(ax)(t) - curve(bx)(s))**2;
const ab_x = (t,s) => curve(ax)(t)-curve(bx)(s);
const ab_y = (t,s) => curve(ay)(t)-curve(by)(s);

const df2dt = (t,s) => (
    df1dt(t,s) - 
    ( 
        deriv(ay)(t) * ab_x(t,s) - deriv(ax)(t) * ab_y(t,s)
    ) / denom(t,s)
)

// --[(dBy/ds)(Ax - Bx) - (Ay - By)(dBx/ds)] / (Ax - Bx)**2
const df2ds = (t,s) => (
    ( 
        deriv(by)(s) * ab_x(t,s) - deriv(bx)(s) * ab_y(t,s) 
    ) / denom(t,s)
)
