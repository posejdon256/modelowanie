import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { drawLine, getContexts, stereoscopyDraw } from "../Draw";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";

/**
 * 
 * @param {Point} p1 {x: 1, y: 1, z: 1}
 * @param {Point} p2 {x: 1, y: 1, z: 1}
 * @param {rgb} color {r: 255, g: 0, b: 0} 
 */
export function DrawLine(p1, p2, color) {

    const { ctx, ctxS1, ctxS2 } = getContexts();
    const _color = color ? color : { r: 255, g: 255, b: 255 };
    setTranslationPoints([p1, p2]);
    const stereoscopy = getStereoscopy();
    let x1, x2, y1, y2, z1, z2;
    if(stereoscopy) {
        const { left, right } = Translate({});

        ctxS1.strokeStyle = "rgba(236, 4, 0, 1)";
        ctxS2.strokeStyle = "rgba(0, 249, 247, 1)";
        ctxS1.beginPath();

        x1 = (left[0].x + 1) * 350;
        y1 = (left[0].y + 1) * 350;
        z1 = left[0].z;
    
        x2 = (left[1].x + 1) * 500;
        y2 = (left[1].y + 1) * 350;
        z2 = left[1].z;
        if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -5 || z1 > 5
            || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -5 || z2 > 5)
            return;
            drawLine(parseInt(x1, 10), parseInt(y1, 10), parseInt(x2, 10), parseInt(y2, 10), ctxS1);
        ctxS1.stroke();
        ctxS2.beginPath();

        x1 = (right[0].x + 1) * 350;
        y1 = (right[0].y + 1) * 350;
        z1 = right[0].z;
    
        x2 = (right[1].x + 1) * 500;
        y2 = (right[1].y + 1) * 350;
        z2 = right[1].z;
        if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -5 || z1 > 5
            || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -5 || z2 > 5)
            return;
            drawLine(parseInt(x1, 10), parseInt(y1, 10), parseInt(x2, 10), parseInt(y2, 10), ctxS2);
        ctxS2.stroke();

        stereoscopyDraw();
        return;
    }
    const translated = Translate({});
    x1 = (translated[0].x + 1) * 500;
    y1 = (translated[0].y + 1) * 350;
    z1 = translated[0].z;

    x2 = (translated[1].x + 1) * 500;
    y2 = (translated[1].y + 1) * 350;
    z2 = translated[1].z;
    if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -5 || z1 > 5
        || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -5 || z2 > 5)
        return;
    
    ctx.strokeStyle = "rgba("+_color.r+","+_color.g+","+_color.b+","+(!_color.a ? 1 : _color.a)+")";
    ctx.beginPath();
    drawLine(parseInt(x1, 10), parseInt(y1, 10), parseInt(x2, 10), parseInt(y2, 10), ctx);
    ctx.stroke();
}