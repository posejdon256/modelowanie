import { convertFromPlaceToIndex } from "../canvas/Mill/Material/Drilling";

export function getLineFactors(p1, p2) {
    const _a = (p2.x - p1.x) === 0 ? "Top" :  (p2.y - p1.y) / (p2.x - p1.x);
    return {
        a: _a,
        b: p1.y - p1.x * _a
    }
}
export function getPointNearLine(a, b, p) {
    if(a === 0 ){
        return {
            x: p.x,
            y: b
        };
    }
    const a2 = -(1/a);
    const b2 = p.y -  a2 * p.x;
    const p2 = {};
    p2.x = (b - b2)/(a2 - a);
    p2.y = (a2 * b - b2 * a) / (a2 - a);
    return p2;
}
export function getRectangleCorners(p1, p2, r) {

    const line = getLineFactors(p1, p2);
    const _a = line.a === 0 ? 0 : -1 / line.a;
    const _b1 = p1.y - _a * p1.x;
    const _b2 = p2.y - _a * p2.x;

    const _p1 = countPoint(r, p1, _a, _b1);
    const _p2 = countPoint(r, p2, _a, _b2);
    let pC1 = _p1[0];
    let pC2 = _p1[1];
    let pC3 = _p2[0];
    let pC4 = _p2[1];
    if(p1.x === p2.x) {
        pC1 = {x: p1.x + r, y: p1.y, z: p1.z};
        pC2 = {x: p1.x - r, y: p1.y, z: p1.z};
        pC3 = {x: p2.x + r, y: p2.y, z: p2.z};
        pC4 = {x: p2.x - r, y: p2.y, z: p2.z};
    } else if(p1.y === p2.y) {
        pC1 = {x: p1.x, y: p1.y + r, z: p1.z};
        pC2 = {x: p1.x, y: p1.y - r, z: p1.z};
        pC3 = {x: p2.x, y: p2.y + r, z: p2.z};
        pC4 = {x: p2.x, y: p2.y - r, z: p2.z};
    }

    const points = [];
    points.push(
     convertFromPlaceToIndex(pC1),
     convertFromPlaceToIndex(pC2), 
     convertFromPlaceToIndex(pC3), 
     convertFromPlaceToIndex(pC4)
     );
    return points;
}

export function getRectangleLines(p1, p2, r) {

    const line = getLineFactors(p1, p2);
    const _a = line.a === 0 ? 0 : -1 / line.a;
    const _b1 = p1.y - _a * p1.x;
    const _b2 = p2.y - _a * p2.x;

    const _p1 = countPoint(r, p1, _a, _b1);
    const _p2 = countPoint(r, p2, _a, _b2);
    let pC1 = _p1[0];
    let pC2 = _p1[1];
    let pC3 = _p2[0];
    let pC4 = _p2[1];
    if(p1.x === p2.x) {
        pC1 = {x: p1.x + r, y: p1.y, z: p1.z};
        pC2 = {x: p1.x - r, y: p1.y, z: p1.z};
        pC3 = {x: p2.x + r, y: p2.y, z: p2.z};
        pC4 = {x: p2.x - r, y: p2.y, z: p2.z};
    } else if(p1.y === p2.y) {
        pC1 = {x: p1.x, y: p1.y + r, z: p1.z};
        pC2 = {x: p1.x, y: p1.y - r, z: p1.z};
        pC3 = {x: p2.x, y: p2.y + r, z: p2.z};
        pC4 = {x: p2.x, y: p2.y - r, z: p2.z};
    }

    const lines = [];
    const l1 = pC1.x === pC2.x ? {a: Infinity} : getLineFactors(pC1, pC2);
    const l2 = pC3.x === pC4.x ? {a: Infinity} :getLineFactors(pC3, pC4);
    const l3 = pC1.x === pC3.x ? {a: Infinity} :getLineFactors(pC1, pC3);
    const l4 = pC2.x === pC4.x ? {a: Infinity} : getLineFactors(pC2, pC4);

    const pC1Transformed = convertFromPlaceToIndex(pC1);
    const pC2Transformed = convertFromPlaceToIndex(pC2);
    const pC3Transformed = convertFromPlaceToIndex(pC3);
    const pC4Transformed = convertFromPlaceToIndex(pC4);

    l1.xmin = Math.min(pC1Transformed.x, pC2Transformed.x);
    l1.xmax = Math.max(pC1Transformed.x, pC2Transformed.x);

    l2.xmin = Math.min(pC3Transformed.x, pC4Transformed.x);
    l2.xmax = Math.max(pC3Transformed.x, pC4Transformed.x);

    l3.xmin = Math.min(pC1Transformed.x, pC3Transformed.x);
    l3.xmax = Math.max(pC1Transformed.x, pC3Transformed.x);

    l4.xmin = Math.min(pC2Transformed.x, pC4Transformed.x);
    l4.xmax = Math.max(pC2Transformed.x, pC4Transformed.x);

    lines.push(l1, l2, l3, l4);
    return lines;
}
function countPoint(r, p, a, b) {
    const intersections = findCircleLineIntersections(r, p.x, p.y, a, b);
    return[
    {
        x: intersections[0],
        y: a * intersections[0] + b,
        z: p.z
    },
    {
        x: intersections[1],
        y: a * intersections[1] + b,
        z: p.z
    }];
}
function findCircleLineIntersections(r, h, k, m, n) {
    // circle: (x - h)^2 + (y - k)^2 = r^2
    // line: y = m * x + n
    // r: circle radius
    // h: x value of circle centre
    // k: y value of circle centre
    // m: slope
    // n: y-intercept

    // get a, b, c values
    var a = 1 + Math.pow(m, 2);
    var b = -h * 2 + (m * (n - k)) * 2;
    var c = Math.pow(h, 2) + Math.pow(n - k, 2) - Math.pow(r, 2);

    // get discriminant
    var d = Math.pow(b, 2) - 4 * a * c;
    if (d >= 0) {
        // insert into quadratic formula
        var intersections = [
            (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a),
            (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)
        ];
        if (d == 0) {
            // only 1 intersection
            return [intersections[0]];
        }
        return intersections;
    }
    // no intersection
    return [];
}