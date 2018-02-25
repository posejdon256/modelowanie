import Translate from "../Translation/TranslationCenter/TranslationCenter";
import Draw, { clearCanvas } from "../Draw/Draw";



let lastX;
let lastY;
let rotationXY = false;
let rotationZ = false;
const alpha = 0.07;
export function StartRotation(x, y, isZ){
    lastX = x;
    lastY = y;
    if(isZ)
        rotationZ = true;
    else
        rotationXY = true;
}
export function StopRoatation(isZ){
    lastX = undefined;
    lastY = undefined;
    if(isZ)
        rotationZ = false;
    else
        rotationXY = false;
}
export function TakeMouseMove(x, y){
    if(!rotationZ && !rotationXY) {
        return;
    }
    let translationObject = {};
    if(Math.abs(lastX - x) > Math.abs(lastY - y)) {
        translationObject = {
            axisX: true,
            alphaX: lastX - x > 0 ? alpha: - alpha,
        }
    } else {
        translationObject = {
            axisY: true,
            alphaY: lastY - y > 0 ? alpha : - alpha,
        }
    }
    if(rotationZ) {
        translationObject.axisZ = true;
        translationObject.alphaZ = lastY - y > lastX - x ? alpha : - alpha;
    }
    lastX = x;
    lastY = y;
    const translated = Translate(translationObject);
    clearCanvas();
    Draw(translated);
}