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
    const bla = 10;
    const blaZ = 100;
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
        for(let i = 0; i < 6; i += 2) {
            if(left[i].z < 1 && left[i].z > -blaZ && left[i].x < bla && left[i].x > -bla
                && left[i].y < bla  && left[i].y > -bla && left[i + 1].z < 1 && left[i + 1].z > -blaZ && left[i + 1].x < bla && left[i + 1].x > -bla
                && left[i + 1].y < bla && left[i + 1].y > -bla) {
                drawLine((left[i].x + 1) * 500,(left[i].y + 1) * 300, (left[i + 1].x + 1) * 500,(left[i + 1].y + 1) * 300, _ctxStereo);
                drawLine((right[i].x + 1) * 500,(right[i].y + 1) * 300, (right[i + 1].x + 1) * 500,(right[i + 1].y + 1) * 300, _ctxStereo2);
                }
        }
        _ctxStereo.stroke();
        _ctxStereo2.stroke();
    } else {
        for(let i = 0; i < 6; i += 2) {
            if(translatedPoints[i].z < 1 && translatedPoints[i].z > -blaZ && translatedPoints[i].x < bla && translatedPoints[i].x > -bla
                && translatedPoints[i].y < bla  && translatedPoints[i].y > -bla && translatedPoints[i + 1].z < 1 && translatedPoints[i + 1].z > -blaZ 
                && translatedPoints[i + 1].x < bla && translatedPoints[i + 1].x > -bla
                && translatedPoints[i + 1].y < bla && translatedPoints[i + 1].y > -bla) {
                _ctx.beginPath();
                _ctx.strokeStyle = i === 0 ? "rgba(255, 0, 0, 1)" : (i === 2 ? "rgba(0, 255, 0, 1)" : "rgba(0, 0, 255, 1)");
                drawLine((translatedPoints[i].x + 1) * 500,(translatedPoints[i].y + 1) * 300, (translatedPoints[i + 1].x + 1) * 500,(translatedPoints[i + 1].y + 1) * 300);
                _ctx.stroke();
                }
        }
    }
    //_ctx.strokeStyle = "rgba(206, 76, 76, 1)";

}