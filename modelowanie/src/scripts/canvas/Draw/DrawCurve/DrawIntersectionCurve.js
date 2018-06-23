import { getCuttingCurves } from "../../CuttingCurve/CuttingCurve";
import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getContexts, drawLine } from "../Draw";
import { DrawLines } from "../DrawLine/DrawLines";

export function _DrawIntersectionCurves() {
    const curves = getCuttingCurves();
    const color = {r: 80, g: 168, b: 227, a: 1};
    curves.forEach(curve => {
        DrawLines(curve.points, color);
    });
}