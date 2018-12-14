import { getMillRForPaths } from "../GeneratePaths";
import { saveToFilePaths } from "../../Save";
import { evaluateDV, evaluateDU } from "../../../canvas/CuttingCurve/FindIntersection";
import { crossMultiply, SumPoints, MultiplyPoint, normalize } from "../../../Helpers/Helpers";

let stretchValue = 1.0;
export function fromIndexToPlace(x) {
    const { size, r, start} = getDatasOfMill();
    return (x + r) * size + start;
}
export function getDatasOfMill() {
    return {
        size: 140 / 500,
        start: -70,
        end: 70,
        r: getMillRForPaths(),
        drawStart: -70,
        minDraw: 0.45 * 100,
        maxDraw: 0.2 * 100,
        aboveDraw: 0.6 * 100
    }
}
export function createFiles(points, size) {
    let str = "";
    for(let i = 0; i < points.length; i ++) {
        if(isNaN(points[i].x) || isNaN(points[i].y) || isNaN(points[i].z)) {
            console.log(points[i]);
            continue;
        }
        //N3G01X0.000Y-98.000Z80.000
        str = str.concat(`N${i}G01X${points[i].x.toFixed(3)}Y${points[i].y.toFixed(3)}Z${points[i].z.toFixed(3)}\r\n`);
    }
    saveToFilePaths(str, size);
}
function getCrossC0(ob, u, v) {
    const p_u1 = evaluateDU(ob, ob.Width - 0.01, v);
    const p_v1 = evaluateDV(ob, ob.Width - 0.01, v);
    const cross1 = crossMultiply(p_u1, p_v1);

    const p_u2 = evaluateDU(ob, 0.01, v);
    const p_v2 = evaluateDV(ob, 0.01, v);
    const cross2 = crossMultiply(p_u2, p_v2);

    return SumPoints(cross1, cross2);
}

export function getCross(ob, u, v) {
    const p_u = evaluateDU(ob, u, v);
    const p_v = evaluateDV(ob, u, v);
    let cross = crossMultiply(p_u, p_v);
    if(cross.x === 0 && cross.y === 0 && cross.z === 0 ){
        cross = getCrossC0(ob, u, v);
    }
    const r = getMillRForPaths();
    cross = MultiplyPoint(normalize(cross), r / 100);
    //cross.z = 0;
    return cross;
}
export function updateStretChValue(_v) {
    stretchValue = _v;
}
export function getStretchValue() {
    return stretchValue;
}
export function stretchModel(p) {
    const model = {x: p.x, y: p.y, z: p.z * getStretchValue()};
    return p;//model;
}