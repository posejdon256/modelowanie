import { DiffPoints } from '../../../Helpers/Helpers';
import { getCuttingCurves } from '../../../canvas/CuttingCurve/CuttingCurve';
import { getMillRForPaths } from '../GeneratePaths';

export function isOtherPartnClose(p, pointsBefore, id) {
    for(let i = 0; i < pointsBefore.length; i ++) {
        if(getXYVectioLength(p, pointsBefore[i]) < getRadiusForSpecificSurface(id)) {
            return true;
        }
    }
    return false
}
export function isIntersectionClose(p, id) {
    const curves = getCuttingCurves();
    const r = getMillRForPaths();
    for(let i = 0; i < curves.length - 7; i ++) {
        for(let j = 0; j < curves[i].points.length; j ++) {
            if(getXYZVectioLength(p, curves[i].points[j]) < r / 100) {
                return true;
            }
        }
    }
    return false;
}
function IsThisSurfaceOneOfTheFirsts(id) {
    return id === 2 || id === 4 || id === 1;
}
function getXYVectioLength(p1, p2) {
    const p = DiffPoints(p1, p2);
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
}
function getRadiusForSpecificSurface(id) {
    if(id === 1) {
        return 0.03;
    } else {
        return 0.005;
    }
}
export function getXYZVectioLength(p1, p2) {
    const p = DiffPoints(p1, p2);
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2) + Math.pow(p.z, 2));
}