import { getCuttingCurves } from "../../CuttingCurve/CuttingCurve";
import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getContexts, drawLine } from "../Draw";
import { DrawLines } from "../DrawLine/DrawLines";

export function _DrawIntersectionCurves() {
    const curves = getCuttingCurves();
    curves.forEach(curve => {
        DrawLines(curve.points);
    });
}