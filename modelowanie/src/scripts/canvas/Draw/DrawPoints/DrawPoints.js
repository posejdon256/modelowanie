import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";
import { drawPixel, stereoscopyDraw, getCanvas } from "../Draw";

let img;
function drawPoint(x, y, img, ctx) {
    const xPrim = ((x + 1) * 500);
    const yPrim = (((y + 1) )* 300);
    if(xPrim < 0 || yPrim < 0 || xPrim > 1000 || yPrim > 700)
        return;
    for(let i = 0; i < 2; i ++) {
        for(let j = 0; j < 2; j ++) {
            img = drawPixel(xPrim + i , yPrim + j, img, ctx);

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
        _ctxStereo.fillStyle = "rgba(236, 4, 0, 1)";
        _ctxStereo2.fillStyle = "rgba(0, 249, 247, 1)";
        img = _ctxStereo.getImageData(0, 0, _canvas.width, _canvas.height);
        left.forEach(point => {
            drawPoint(point.x, point.y, img, _ctxStereo);
        });
        _ctxStereo.putImageData(img, 0, 0);
        img = _ctxStereo2.getImageData(0, 0, _canvas.width, _canvas.height);
        right.forEach(point => {
            drawPoint(point.x, point.y, img, _ctxStereo2);
        });
        _ctxStereo2.putImageData(img, 0, 0);
        stereoscopyDraw();
    }
    else {
        img = _ctx.getImageData(0, 0, _canvas.width, _canvas.height);
        for(let i = 0; i < translatedPoints.length; i ++ ) {
            if(points[i].selected) {
                _ctx.fillStyle = "rgba(255, 0, 0, 1)";
            } else {
                _ctx.fillStyle = "rgba(255, 255, 255, 1)";
            }
            drawPoint(translatedPoints[i].x, translatedPoints[i].y, img, _ctx);
        }
        _ctx.putImageData(img, 0, 0);  
    }
}