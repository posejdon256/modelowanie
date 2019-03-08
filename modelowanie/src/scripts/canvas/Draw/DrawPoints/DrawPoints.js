import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";
import { drawPixel, stereoscopyDraw, getCanvas, getContexts } from "../Draw";
import { getAddingC2type } from "../../Bezier/BSpline";

let img;
function drawPoint(x, y, z, img, ctx, rgb) {
    const xPrim = (x + 1) * 500;
    const yPrim = (y + 0.8) * 450;
    if(xPrim < 0 || yPrim < 0 || xPrim > 1000 || yPrim > 700)
        return;
    if(z !== undefined && (z > 5 || z < -5)) {
        return;
    }
    for(let i = 0; i < 4; i ++) {
        for(let j = 0; j < 4; j ++) {
            img = drawPixel(xPrim + i , yPrim + j, img, ctx, rgb);

        }
    }
}
export function DrawPoint(p, color) {
    setTranslationPoints([p]);
    const _trans = Translate({});
    let rgb;
    if(color === "Blue") {
        rgb = {r: 0, g: 255, b: 255};
    } else if(color === "Yellow") {
        rgb = {r: 255, g: 215, b: 0};
    }
    else if(color === "Red") {
        rgb = {r: 255, g: 0, b: 0};
    }
    else if(color === "Green") {
        rgb = {r: 0, g: 255, b: 0};
    }
    const { ctx } = getContexts();
    drawPoint(_trans[0].x, _trans[0].y, _trans[0].z, img, ctx, rgb);
    ctx.putImageData(img, 0, 0); 
    setTranslationPoints([]); 
}
export function _DrawPoints(points, _ctx, _ctxStereo, _ctxStereo2) {
    setTranslationPoints(points);
    const translatedPoints = Translate({});
    const stereoscopy = getStereoscopy();
    const c2BezierVisible = getAddingC2type();
    const _canvas = getCanvas();
        img = _ctx.getImageData(0, 0, _canvas.width, _canvas.height);
        let rgb = {r: 255, g: 0, b: 0};
        for(let i = 0; i < translatedPoints.length; i ++ ) {
            rgb = points[i].color ? points[i].color : rgb;
            if(((!points[i].c2Bezier) || (points[i].c2Bezier && c2BezierVisible)) && (points[i].visible !== false)) {
                drawPoint(translatedPoints[i].x, translatedPoints[i].y, translatedPoints[i].z, img, _ctx, rgb);
            }
        }
        _ctx.putImageData(img, 0, 0);
}