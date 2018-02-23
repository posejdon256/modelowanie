import Translate from "../Translation/TranslationCenter/TranslationCenter";
import Draw, { clearCanvas } from "../Draw/Draw";



let lastX;
let lastY;
let rotationXY = false;
let rotationZ = false;
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
            alphaX: lastX - x > 0 ? 0.1: - 0.1,
        }
    } else {
        translationObject = {
            axisY: true,
            alphaY: lastY - y > 0 ? 0.1 : - 0.1,
        }
    }
    if(rotationZ) {
        translationObject.axisZ = true;
        translationObject.alphaZ = lastY - y > lastX - x ? 0.1 : - 0.1;
    }
    lastX = x;
    lastY = y;
    const translated = Translate(translationObject);
    clearCanvas();
    Draw(translated);
}