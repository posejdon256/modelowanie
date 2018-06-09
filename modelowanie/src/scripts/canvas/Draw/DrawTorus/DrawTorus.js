import { getTorusLines, getToruses, getTorusVertices } from "../../Torus/Torus";
import { drawLine, getPixelColor, stereoscopyDraw } from "../Draw";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";
import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";

function drawTorusLines(lines, id, ctx, points) {
    ctx.beginPath();
    lines.forEach(line => {
        let bla = 10;
        let blaZ = 5;
        if(line[1] < points.length 
        && line[0] < points.length && points[line[0]].z > -blaZ && points[line[0]].x < bla && points[line[0]].x > -bla
            && points[line[0]].y < bla  && points[line[0]].y > -bla && points[line[1]].z < 1 && points[line[1]].z > -blaZ && points[line[1]].x < bla && points[line[1]].x > -bla
            && points[line[1]].y < bla && points[line[1]].y > -bla) {
             drawLine((points[line[0]].x + 1) * (500), (points[line[0]].y + 1) * (350), (points[line[1]].x + 1) * (500), (points[line[1]].y + 1) * (350), ctx);
         }
    });
    ctx.stroke();
}
export function _DrawTorus(_ctx, _ctxStereo, _ctxStereo2){
    const stereoscopy = getStereoscopy();
    const toruses = getToruses();
    toruses.forEach(torus => {
        setTranslationPoints(getTorusVertices(torus.id));
        const confObject = {};
        if(torus.rotation.x !== 0) {
            confObject.axisX = true;
            confObject.alphaX = torus.rotation.x;
        }
        if(torus.rotation.y !== 0) {
            confObject.axisY = true;
            confObject.alphaY = torus.rotation.y;
        }
        if(torus.rotation.z !== 0) {
            confObject.axisZ = true;
            confObject.alphaZ = torus.rotation.z;
        }
        const translated = Translate(confObject, "torus");
        drawTorus(translated, torus.id, _ctx, _ctxStereo, _ctxStereo2);
    });
    if(stereoscopy){
        stereoscopyDraw();
    }
}
function drawTorus(points, id, _ctx, _ctxStereo, _ctxStereo2) {
    const lines = getTorusLines(id);
    const stereoscopy = getStereoscopy();
    const {r, g, b, a} = getPixelColor();
    if(!stereoscopy) {
        _ctx.strokeStyle = "rgba("+r+","+g+","+b+","+a+")";
        drawTorusLines(lines, id, _ctx, points);
    } else {
        const { left, right } = points;
        
        _ctxStereo.strokeStyle = "rgba(236, 4, 0, 1)";
        _ctxStereo2.strokeStyle = "rgba(0, 249, 247, 1)";
        if(drawTorusLines) {
            drawTorusLines(lines, id, _ctxStereo2, left);
            drawTorusLines(lines, id, _ctxStereo, right);
        }
    }
}