import { getCursor, setScreenPlace } from "../../Cursor/Cursor";
import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { drawLine } from "../Draw";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";

export function _DrawCursor(_ctx, _ctxStereo, _ctxStereo2) {
    const cursorLX = 0.05;
    const cursorLZ = 0.07;
    const cursorLY = 0.05 * (5/3);
    const cursor = getCursor();
    const stereoscopy = getStereoscopy();

    const points = [];
    let translatedPoints;
    points.push({x: cursor.x - cursorLX, y: cursor.y, z: cursor.z});
    points.push({x: cursor.x + cursorLX, y: cursor.y, z: cursor.z});
    points.push({x: cursor.x, y: cursor.y - cursorLY, z: cursor.z});
    points.push({x: cursor.x, y: cursor.y + cursorLY, z: cursor.z});
    points.push({x: cursor.x, y: cursor.y, z: cursor.z - cursorLZ});
    points.push({x: cursor.x, y: cursor.y, z: cursor.z + cursorLZ});

    setTranslationPoints(points);
    translatedPoints = Translate({});
    const cursorPos = [{x: cursor.x, y: cursor.y, z: cursor.z}];
    setTranslationPoints(cursorPos);
    const cursorPosTrans = Translate({});
    if(!stereoscopy)
        setScreenPlace(Math.round((cursorPosTrans[0].x + 1) * 500), Math.round((cursorPosTrans[0].y + 1) * 300));
    else
        setScreenPlace(Math.round((cursorPosTrans.left[0].x + 1) * 500), Math.round((cursorPosTrans.left[0].y + 1) * 300));
    if(stereoscopy) {
        const { left, right } = translatedPoints;
        _ctxStereo.strokeStyle = "rgba(236, 4, 0, 1)";
        _ctxStereo2.strokeStyle = "rgba(0, 249, 247, 1)";
        _ctxStereo.beginPath();
        _ctxStereo2.beginPath();
        drawLine((left[0].x + 1) * 500,(left[0].y + 1) * 300, (left[1].x + 1) * 500,(left[1].y + 1) * 300, _ctxStereo);
        drawLine((right[0].x + 1) * 500,(right[0].y + 1) * 300, (right[1].x + 1) * 500,(right[1].y + 1) * 300, _ctxStereo2);
        drawLine((left[2].x + 1) * 500,(left[2].y + 1) * 300, (left[3].x + 1) * 500,(left[3].y + 1) * 300, _ctxStereo);
        drawLine((right[2].x + 1) * 500,(right[2].y + 1) * 300, (right[3].x + 1) * 500,(right[3].y + 1) * 300, _ctxStereo2);
        drawLine((left[4].x + 1) * 500,(left[4].y + 1) * 300, (left[5].x + 1) * 500,(left[5].y + 1) * 300, _ctxStereo);
        drawLine((right[4].x + 1) * 500,(right[4].y + 1) * 300, (right[5].x + 1) * 500,(right[5].y + 1) * 300, _ctxStereo2);
        _ctxStereo.stroke();
        _ctxStereo2.stroke();
    } else {
        _ctx.beginPath();
        _ctx.strokeStyle = "rgba(255, 0, 0, 1)";
        drawLine((translatedPoints[0].x + 1) * 500,(translatedPoints[0].y + 1) * 300, (translatedPoints[1].x + 1) * 500,(translatedPoints[1].y + 1) * 300);
        _ctx.stroke();
        _ctx.beginPath();
        _ctx.strokeStyle = "rgba(0, 255, 0, 1)";
        drawLine((translatedPoints[2].x + 1) * 500,(translatedPoints[2].y + 1) * 300, (translatedPoints[3].x + 1) * 500,(translatedPoints[3].y + 1) * 300);
        _ctx.stroke();
        _ctx.beginPath();
        _ctx.strokeStyle = "rgba(0, 0, 255, 1)";
        drawLine((translatedPoints[4].x + 1) * 500,(translatedPoints[4].y + 1) * 300, (translatedPoints[5].x + 1) * 500,(translatedPoints[5].y + 1) * 300);
        _ctx.stroke();
    }
    //_ctx.strokeStyle = "rgba(206, 76, 76, 1)";

}