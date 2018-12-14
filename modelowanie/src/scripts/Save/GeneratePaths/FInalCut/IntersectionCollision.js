import { DiffPoints } from '../../../Helpers/Helpers';
import { getCuttingCurves } from '../../../canvas/CuttingCurve/CuttingCurve';

export function findSmallestIntersection(p) {
    const curves = getCuttingCurves();
    let minLen = 10000;
    let closestPoint = undefined;
    for(let i = 0; i < curves.length; i ++) {
        for(let j = 0; j < curves[i].points.length; j ++) {
            if(getXYZVectioLength(p, curves[i].points[j]) < minLen && curves[i].points[j].z > 0) {
                closestPoint = curves[i].points[j];
                minLen = getXYZVectioLength(p, curves[i].points[j]);
            }
        }
    }
    return {x: closestPoint.x, y: closestPoint.y, z: closestPoint.z};//findUVPlace(sId, curves[finalI], uvPoint, "v");
}
export function isIntersectionClose(p, howClose, uvPoint, sId) {
    const inter = findSmallestIntersection(p);
    if(getXYZVectioLength(inter, p) < howClose || getXYVectioLength(inter, p) < howClose / 4) {
        return {x: inter.x, y: inter.y, z: inter.z};//findUVPlace(sId, curves[finalI], uvPoint, "v");
    }
    return false;
}
export function findUVPlace(sId, curve, uvPoint, uv) {
    let minLen = 1000;
    let foundP;
    for(let i = 0; i < curve.points.length; i ++) {
        if(sId === curve.ob1.id) {
            const _len = Math.pow(curve.v1[i] - uvPoint.v, 2) + Math.pow(curve.u1[i] - uvPoint.u, 2);
            if(_len < minLen) {
                minLen = _len;
                foundP = curve.points[i];
            }
        } else {
            const _len = Math.pow(curve.v2[i] - uvPoint.v, 2) + Math.pow(curve.u2[i] - uvPoint.u, 2);
            if(_len < minLen) {
                minLen = _len;
                foundP = curve.points[i];
            }
        }
    }
    return {x: foundP.x, y: foundP.y, z: foundP.z};
}
export function getXYVectioLength(p1, p2) {
    const p = DiffPoints(p1, p2);
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
}
export function getXYZVectioLength(p1, p2) {
    const p = DiffPoints(p1, p2);
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2) + Math.pow(p.z, 2));
}