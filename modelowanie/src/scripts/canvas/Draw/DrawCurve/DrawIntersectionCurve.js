import { getCuttingCurves } from "../../CuttingCurve/CuttingCurve";
import { DrawLines } from "../DrawLine/DrawLines";

export function _DrawIntersectionCurves() {
    const curves = getCuttingCurves();
    const color = {r: 255, g: 255, b: 0, a: 1};
    curves.forEach(curve => {
        const _points = {points: curve.points, trim: false};
        const points = [_points];
        DrawLines(points, color);
    });
}