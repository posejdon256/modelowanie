export function factorial(n) {
    if ((n === 0) || (n === 1))
       return 1
    else {
       let result = (n * factorial(n-1) );
       return result
    }
 }
 export function getVectorLength(v1, v2) {
     return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2) + Math.pow(v2.z - v1.z, 2));
 }
 export function TryParseInt(str ,defaultValue) {
    let retValue = defaultValue;
    if(str !== null) {
        if(str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str, 10);
            }
        }
    }
    return retValue;
}
export function TryParseFloat(str ,defaultValue) {
    let retValue = defaultValue;
    if(str !== null) {
        if(str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseFloat(str, 10);
            }
        }
    }
    return retValue;
}
export function TryParseFloat2(str) {
    let retValue = undefined;
    if(str !== null) {
        if(str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseFloat(str, 10);
            }
        }
    }
    return retValue;
}
export function DiffPoints(p1, p2) {
    const ret = {};
    ret.x = p1.x - p2.x;
    ret.y = p1.y - p2.y;
    ret.z = p1.z - p2.z;
    return ret;
}
export function SumPoints(p1, p2) {
    const ret = {};
    ret.x = p1.x + p2.x;
    ret.y = p1.y + p2.y;
    ret.z = p1.z + p2.z;
    return ret;
}
export function DividePoint(p1, number) {
    const ret = {};
    ret.x = p1.x / number;
    ret.y = p1.y / number;
    ret.z = p1.z / number;
    return ret;
}
export function MultiplyPoint(p1, number) {
    const ret = {};
    ret.x = p1.x * number;
    ret.y = p1.y * number;
    ret.z = p1.z * number;
    return ret;
}
export function UpdatePointsForCanvas(points) {
    const ret = [];
    points.forEach(p => {
        ret.push({x: (p.x + 1) * 500, y: (p.y + 0.8) * 450});
    });
    return ret;
}
export function scalarMultiply(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}
export function normalize(v) {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    return {
        x: v.x / length,
        y: v.y / length,
        z: v.z / length
    };
}
export function crossMultiply(v1, v2) {
    // [ a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1 ]
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
    }
}
export function longVectorScalar(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}