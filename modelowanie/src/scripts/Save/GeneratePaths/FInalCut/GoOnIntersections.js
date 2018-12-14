import { getCuttingCurves } from "../../../canvas/CuttingCurve/CuttingCurve";

export function goOnIntersection() {
    const points = [];
    const cuttingCurves = getCuttingCurves();
    for(let j = 0; j < cuttingCurves.length; j ++) {
        const c = cuttingCurves[j];
        points.push({x: c.points[0].x - 0.001, y: c.points[0].y, z: 0.6});
        for(let i = 0; i < c.points.length; i ++) {
            points.push({x: c.points[i].x, y: c.points[i].y, z: c.points[i].z});
        }
        points.push({x: c.points[c.points.length - 1].x  - 0.001, y: c.points[c.points.length - 1].y, z: 0.6});
    }
    return points;
}