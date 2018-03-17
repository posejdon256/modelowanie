import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";
import { drawPixel, stereoscopyDraw } from "../Draw";

function drawPoint(x, y, ctx) {
    for(let i = 0; i < 2; i ++) {
        for(let j = 0; j < 2; j ++) {
            drawPixel((x + (i/1000) + 1) * 500, (y + (j/700) + 1) * 300, ctx);
        }
    }
}
export function _DrawPoints(points, _ctx, _ctxStereo, _ctxStereo2) {
    setTranslationPoints(points);
    const translatedPoints = Translate({});
    const stereoscopy = getStereoscopy();
    if(stereoscopy){
        const { left, right } = translatedPoints;
        _ctxStereo.fillStyle = "rgba(236, 4, 0, 1)";
        _ctxStereo2.fillStyle = "rgba(0, 249, 247, 1)";
        left.forEach(point => {
            drawPoint(point.x, point.y, _ctxStereo);
        });
        right.forEach(point => {
            drawPoint(point.x, point.y, _ctxStereo2);
        });
        stereoscopyDraw();
    }
    else {
        for(let i = 0; i < translatedPoints.length; i ++ ) {
            if(points[i].selected) {
                _ctx.fillStyle = "rgba(255, 0, 0, 1)";
            } else {
                _ctx.fillStyle = "rgba(255, 255, 255, 1)";
            }
            drawPoint(translatedPoints[i].x, translatedPoints[i].y, _ctx);
        }
    }
}