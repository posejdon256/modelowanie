import { getCuttingCurves } from "../../../canvas/CuttingCurve/CuttingCurve";

export function goOnIntersection() {
    const points = [];
    const cuttingCurves = getCuttingCurves();
    cuttingCurves.forEach(c => {
        points.push({x: c.points[0].x - 0.1, y: c.points[0].y, z: 0.6});
        for(let i = 0; i < c.points.length; i ++) {
            points.push(c.points[i]);
        }
        points.push({x: c.points[c.points.length - 1].x  - 0.001, y: c.points[c.points.length - 1].y, z: 0.6});
    });
    return points;
}