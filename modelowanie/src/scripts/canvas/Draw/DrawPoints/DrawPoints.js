import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";
import { drawPixel, stereoscopyDraw, getCanvas } from "../Draw";

let img;
function drawPoint(x, y, img, ctx, rgb) {
    const xPrim = ((x + 1) * 500);
    const yPrim = (((y + 1) )* 300);
    if(xPrim < 0 || yPrim < 0 || xPrim > 1000 || yPrim > 700)
        return;
    for(let i = 0; i < 2; i ++) {
        for(let j = 0; j < 2; j ++) {
            img = drawPixel(xPrim + i , yPrim + j, img, ctx, rgb);

        }
    }
}
export function _DrawPoints(points, _ctx, _ctxStereo, _ctxStereo2) {
    setTranslationPoints(points);
    const translatedPoints = Translate({});
    const stereoscopy = getStereoscopy();
    const _canvas = getCanvas();
    if(stereoscopy){
        const { left, right } = translatedPoints;
        img = _ctxStereo.getImageData(0, 0, _canvas.width, _canvas.height);
        let rgb = {r: 236, g: 4, b: 0};
        left.forEach(point => {
            drawPoint(point.x, point.y, img, _ctxStereo, rgb);
        });
        _ctxStereo.putImageData(img, 0, 0);
        rgb = {r: 0, g: 249, b: 0};
        img = _ctxStereo2.getImageData(0, 0, _canvas.width, _canvas.height);
        right.forEach(point => {
            drawPoint(point.x, point.y, img, _ctxStereo2, rgb);
        });
        _ctxStereo2.putImageData(img, 0, 0);
        stereoscopyDraw();
    }
    else {
        img = _ctx.getImageData(0, 0, _canvas.width, _canvas.height);
        let rgb;
        for(let i = 0; i < translatedPoints.length; i ++ ) {
            if(points[i].selected) {
                rgb = {r: 255, g: 0, b: 0};
            } else {
                rgb = {r: 255, g: 255, b: 255};
            }
            drawPoint(translatedPoints[i].x, translatedPoints[i].y, img, _ctx, rgb);
        }
        _ctx.putImageData(img, 0, 0);  
    }
}