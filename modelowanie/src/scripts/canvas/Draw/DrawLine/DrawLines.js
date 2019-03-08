import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { drawLine, getContexts, stereoscopyDraw } from "../Draw";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";
import { trimIsMet } from "../../CuttingCurve/Trimming";

/**
 * 
 * @param {Point} p1 {x: 1, y: 1, z: 1}
 * @param {Point} p2 {x: 1, y: 1, z: 1}
 * @param {rgb} color {r: 255, g: 0, b: 0} 
 */
export function DrawLines(points) {

    const { ctx } = getContexts();
    setTranslationPoints(points);
    let x1, x2, y1, y2, z1, z2;
    const translated = Translate({});
    ctx.beginPath();
    for(let i = 0; i < translated.length; i +=2) {

        const _color = points[i].color ? points[i].color : { r: 255, g: 255, b: 255 };
        ctx.strokeStyle = "rgba("+_color.r+","+_color.g+","+_color.b+","+(!_color.a ? 1.0 : _color.a)+")";
        ctx.beginPath();

        x1 = (translated[i + 1].x + 1) * 500;
        y1 = (translated[i + 1].y + 0.8) * 450;
        z1 = translated[i + 1].z;

        x2 = (translated[i].x + 1) * 500;
        y2 = (translated[i].y + 0.8) * 450;
        z2 = translated[i].z;
        if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -5 || z1 > 5
            || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -5 || z2 > 5)
            continue;
        drawLine(parseInt(x1, 10), parseInt(y1, 10), parseInt(x2, 10), parseInt(y2, 10), ctx);

        ctx.stroke();
    }
}