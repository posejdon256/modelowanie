import { getSurfaces } from "../../../canvas/Surface/Surface";
import { evaluatePointWithCross, setSumCross } from "./Third";
import { addPoint } from "../../../canvas/Points/Points";
import { getVectorLength } from "../../../Helpers/Helpers";
import { getCuttingCurves } from "../../../canvas/CuttingCurve/CuttingCurve";

let first = true;
export function findCutBetweenC0() {
    const s5 = getSurfaces().find(x => x.id === 5);
    const curve = [];
    for(let i = 0; i < s5.Width; i += 0.01) {
        if(i > 0.8 && i < 3) {
            continue;
        }
        const minPoints = [];
        for(let j = 3; j < 4; j += 0.01) {
            setSumCross(true);
            let p = evaluatePointWithCross(s5, j, i);
            if(p.z < 0.01) {
                continue;
            }
            addPoint(p.x, p.y, p.z, "mill");
            const closest = findClosestPoint(p);
            minPoints.push({minPoint: p, len: closest.len});
            first = false;
        }
        let minPoint = {};
        let minlen = 1000;
        for(let j = 0; j < minPoints.length; j ++) {
            if(minlen > minPoints[j].len) {
                minPoint = minPoints[j].minPoint;
                minlen = minPoints[j].len;
            }
        }
        curve.push(minPoint);
        //addPoint(minPoint.x, minPoint.y, minPoint.z, "mill");
    }
    const cuttingCurve = getCuttingCurves().find(x => x.id === 0);
    cuttingCurve.points = curve;
    cuttingCurve.points = cuttingCurve.points.sort(function compareNumbers(a, b) {
        return a.x - b.x
     }
     );
}
function findClosestPoint(p) {
    setSumCross(false);
    let minPoint = {};
    let minlen = 1000;
    const s1 = getSurfaces().find(x => x.id === 1);
    for(let i = 0; i < s1.Width; i += 0.01) {
        if(i > 0.5 && i < 3) {
            continue;
        }
        for(let j = 1.2; j < 1.8; j += 0.01) {
            const _eval = evaluatePointWithCross(s1, j, i);
            if(_eval.z < 0) {
                continue;
            }
            if(first)  {
             //  addPoint(_eval.x, _eval.y, _eval.z, "mill");
            }
            const len = getVectorLength(_eval, p);
            if(len < minlen && _eval.z > 0) {
                minlen = len;
                minPoint = _eval;
            }
        }
    }
    return {minPoint: minPoint, len: minlen};
}