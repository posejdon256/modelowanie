import { getCuttingCurves } from "../../CuttingCurve/CuttingCurve";
import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getContexts, drawLine } from "../Draw";
import { DrawLines } from "../DrawLine/DrawLines";

export function _DrawIntersectionCurves() {
    const curves = getCuttingCurves();
    const color = {r: 255, g: 255, b: 0, a: 1};
    curves.forEach(curve => {
        DrawLines(curve.points, color);
    });
}