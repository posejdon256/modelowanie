<<<<<<< HEAD
import { DrawTorus, clearCanvas, DrawElipsoid, pseudoDrawElipsoid } from "../Draw/Draw";
import { TranslateTorus } from '../Torus/Torus';
import { TranslateElipsoid, PseudoTranslate } from "../Elipsoid/Elipsoid";
=======
import Translate from "../Translation/TranslationCenter/TranslationCenter";
import { RedrawWithoutChangingScene } from "../Draw/Redraw";
>>>>>>> 3d_torus

let lastX;
let lastY;
let rotationXY = false;
let rotationZ = false;
<<<<<<< HEAD
const alpha = 0.15;
=======
const alpha = 0.10;
>>>>>>> 3d_torus
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
        for(let i = 20; i > 4; i -=4) {
          //  clearCanvas();
            pseudoDrawElipsoid(PseudoTranslate({}, i), i);
        }
        DrawElipsoid(TranslateElipsoid({}));
        
}
export function TakeMouseMove(x, y){
    if((!rotationZ && !rotationXY) || (lastX === x && lastY === y)) {
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
<<<<<<< HEAD
    clearCanvas();
    pseudoDrawElipsoid(PseudoTranslate(translationObject, 20, true), 20);
=======
    Translate(translationObject);
    RedrawWithoutChangingScene();
>>>>>>> 3d_torus
}