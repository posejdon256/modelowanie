import { evaluatePointWithCross } from "./Third";
import { getDatasOfMill } from "../Helpers/GeneratePathsHelper";
import { getSurfaces } from "../../../canvas/Surface/Surface";
import { proceedPoint } from "./GoUnderOtherFlake";

let maxIter = 10000;
let _stepAround  = 2;

export function setMaxIter(_iter) {
    maxIter = _iter;
}
export function goOnSelectedParametrisation(sId, division, constantDivision, startPoint, points, pointsInParts, minValue, maxValue) {
    //Height to wzduż - 6, pierwsza
    //Width to dookołoa - 5
    let start = true;
    const { aboveDraw } = getDatasOfMill();
    const surface = getSurfaces().find(x => x.id === sId);

    const stepAround = surface.Width / division;
    const stepWithParametrization = surface.Height / constantDivision;

    _stepAround = stepAround;
    let u = startPoint.u;
    let v = startPoint.v;

    let iter = 0;
    let isUnderZero = false;
    while(!isVeryCloseToStart(u, v, startPoint.u, startPoint.v, iter)) {
        while(!isVeryCloseToStart(u, v, startPoint.u, startPoint.v, iter)
        && (u < surface.Height && (maxValue === undefined || u < maxValue))) {
            if(isCloseToZero(surface, u, v) && isUnderZero) {
                isUnderZero = false;
                break;
            } else if(isUnderZero) {
                const p = evaluatePointWithCross(surface, u, v);
                if(start) {
                    points.push({x: p.x, y: p.y, z: aboveDraw / 100});
                    start = false;
                }
                const pProceed = proceedPoint(sId, p, pointsInParts, {u: u, v: v});
                const prev = points[points.length - 1]; 
                if(pProceed.z !== (aboveDraw / 100) && prev.z === (aboveDraw / 100)) {
                    points.push({x: pProceed.x, y: pProceed.y, z: aboveDraw / 100});
                }
                if(pProceed.z === (aboveDraw / 100) && prev.z !== (aboveDraw / 100)) {
                    points.push({x: prev.x, y: prev.y, z: aboveDraw / 100});
                }
                points.push(pProceed);
            } else if(!isCloseToZero(surface, u, v)) {
                isUnderZero = true;
            }
            u += stepWithParametrization;
            iter ++;
        }
        if(isVeryCloseToStart(u, v, startPoint.u, startPoint.v, iter)) {
            return;
        }
        if(u >= surface.Height || (maxValue !== undefined && u >= maxValue)) u -= stepWithParametrization;
        v += stepAround;
        v = roundV(v, surface.Width);

        while(!isVeryCloseToStart(u, v, startPoint.u, startPoint.v, iter)
        && (u > 0 && (minValue === undefined || u > minValue))) {
            if(isCloseToZero(surface, u, v) && isUnderZero) {
                isUnderZero = false;
                break;
            } else if(isUnderZero) {
                const p = evaluatePointWithCross(surface, u, v);
                if(start) {
                    points.push({x: p.x, y: p.y, z: aboveDraw / 100});
                    start = false;
                }
                const pProceed = proceedPoint(sId, p, pointsInParts, {u: u, v: v});
                const prev = points[points.length - 1]; 
                if(pProceed.z !== (aboveDraw / 100) && prev.z === (aboveDraw / 100)) {
                    points.push({x: pProceed.x, y: pProceed.y, z: aboveDraw / 100});
                }
                if(pProceed.z === (aboveDraw / 100) && prev.z !== (aboveDraw / 100)) {
                    points.push({x: prev.x, y: prev.y, z: aboveDraw / 100});
                }
                points.push(pProceed);
            } else if(!isCloseToZero(surface, u, v)) {
                isUnderZero = true;
            }
            iter ++;
            u -= stepWithParametrization;
        }
        if(isVeryCloseToStart(u, v, startPoint.u, startPoint.v, iter)) {
            return;
        }
        if(u < 0 || (minValue !== undefined && u <= minValue)) u += stepWithParametrization;
        v += stepAround;
        v = roundV(v, surface.Width);
    }
    return;
}
export function prepareParametrisation(sId, division, constantDivision, startPoint) {
    //Height to wzduż - 6, pierwsza
    //Width to dookołoa - 5
    let part = [];
    part.id = sId;
    const surface = getSurfaces().find(x => x.id === sId);

    const stepAround = surface.Width / division;
    _stepAround = stepAround;
    const stepWithParametrization = surface.Height / constantDivision;

    let u = startPoint.u;
    let v = startPoint.v;

    let iter = 0;
    let isUnderZero = false;
    while(!isVeryCloseToStart(u, v, startPoint.u, startPoint.v, iter)) {
        while(!isVeryCloseToStart(u, v, startPoint.u, startPoint.v, iter)
        && u < surface.Height) {
            if(isCloseToZero(surface, u, v) && isUnderZero) {
                isUnderZero = false;
                break;
            } else if(isUnderZero) {
                part.push(evaluatePointWithCross(surface, u, v));
            } else if(!isCloseToZero(surface, u, v)) {
                isUnderZero = true;
            }
            u += stepWithParametrization;
            iter ++;
        }
        if(isVeryCloseToStart(u, v, startPoint.u, startPoint.v, iter)) {
            return part;
        }
        if(u >= surface.Height) u -= stepWithParametrization;
        v += stepAround;
        v = roundV(v, surface.Width);

        while(!isVeryCloseToStart(u, v, startPoint.u, startPoint.v, iter)
        && u > 0 ) {
            if(isCloseToZero(surface, u, v) && isUnderZero) {
                isUnderZero = false;
                break;
            } else if(isUnderZero) {
                part.push(evaluatePointWithCross(surface, u, v));
            } else if(!isCloseToZero(surface, u, v)) {
                isUnderZero = true;
            }
            iter ++;
            u -= stepWithParametrization;
        }
        if(isVeryCloseToStart(u, v, startPoint.u, startPoint.v, iter)) {
            return part;
        }
        if(u < 0 ) u += stepWithParametrization;
        v += stepAround;
        v = roundV(v, surface.Width);
    }
    return part;
}
function isCloseToZero(s, u, v) {
    const p = evaluatePointWithCross(s, u, v);
    const eps = 0;
    if(p.z <= eps) {
        return true;
    }
    return false;
}
function roundV(u, Width) {
    return u < Width ? u : u - Width;
}
function isVeryCloseToStart(u1, v1, u2, v2, iter) {
    const eps = 0.03;
    if(Math.sqrt(Math.pow(u1 - u2, 2) + Math.pow(v1 - v2, 2)) < eps && iter > maxIter) {
        return true;
    }
    if(Math.abs(v1-v2) < 2 * _stepAround && iter > 1000) {
        return true;
    }
    return false;
}