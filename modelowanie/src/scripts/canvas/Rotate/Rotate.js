import { DrawTorus, clearCanvas, DrawElipsoid, pseudoDrawElipsoid } from "../Draw/Draw";
import { TranslateTorus } from '../Torus/Torus';
import { TranslateElipsoid, PseudoTranslate } from "../Elipsoid/Elipsoid";

let lastX;
let lastY;
let rotationXY = false;
let rotationZ = false;
const alpha = 0.15;
export function StartRotation(x, y, isZ){
    lastX = x;
    lastY = y;
    if(isZ)
        rotationZ = true;
    else
        rotationXY = true;
}
function DrawElipsoidRecurence(i) {
    if(i < 8)
        window.setTimeout(function(){
            DrawElipsoid(TranslateElipsoid({}));
        }, 100);
    else {
        window.setTimeout(function(){
            DrawElipsoidRecurence(i-4);
            // DrawElipsoid(TranslateElipsoid({}));
            pseudoDrawElipsoid(PseudoTranslate({}, i-4), i-4);
        },100);
    }
}
export function StopRoatation(isZ){
    lastX = undefined;
    lastY = undefined;
    if(isZ)
        rotationZ = false;
    else
        rotationXY = false;
        DrawElipsoidRecurence(20);
        
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
    clearCanvas();
    pseudoDrawElipsoid(PseudoTranslate(translationObject, 20, true), 20);
}