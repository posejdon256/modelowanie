import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getCanvas, drawLine, stereoscopyDraw } from "../Draw";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";
import { getCurves, getCurvesPoints } from "../../Bezier/Curve";
import { DrawLines } from "../DrawLine/DrawLines";

export function _DrawCurves() {
    const points = getCurvesPoints();
    drawChaines();
    let color = undefined;
    if(points.length > 0 && points[0].selected){
        color = {r: 255, g: 0, b: 0, a: 1};
    }
    DrawLines(points, color);
}

function drawChaines() {
    const curves = getCurves();
    for(let i = 0; i < curves.length; i ++) {
        if(!curves[i].chain)
            continue;
        if(curves[i].surface && curves[i].type === "C2") {
            DrawLines(curves[i].pointsBspline);
        } else {
            DrawLines(curves[i].points);
        }
    }
}