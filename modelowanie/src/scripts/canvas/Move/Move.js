import { DrawElipsoid, DrawTorus, clearCanvas, pseudoDrawElipsoid } from "../Draw/Draw";
import { TranslateElipsoid, PseudoTranslate } from '../Elipsoid/Elipsoid';


let front = 0;
let left = 0;
let top = 0;
let step = 0.001;

let interval;

function setIntervalForMoving(){
    if(!interval) {
        interval = setInterval(function(){
            const trasnlationObject = {
                front: front,
                left: left,
                top: top
            }
            clearCanvas();
            pseudoDrawElipsoid(PseudoTranslate(trasnlationObject, 20, true), 20);
           //DrawElipsoid(TranslateElipsoid(trasnlationObject));
        }, 5);
    }
}
function DrawElipsoidRecurence(i) {
    if(i < 8)
        window.setTimeout(function(){
            DrawElipsoid(TranslateElipsoid({}));
        }, 100);
    else {
        window.setTimeout(function(){
            DrawElipsoidRecurence(i-4);
            clearCanvas();
            // DrawElipsoid(TranslateElipsoid({}));
            pseudoDrawElipsoid(PseudoTranslate({}, i-4), i-4);
        },100);
    }
}
function removeIntervalForMoving(){
    if(front === 0 && left === 0 && top === 0) {
        clearInterval(interval);
        interval = undefined;
        DrawElipsoidRecurence(20);
      //  DrawElipsoid(TranslateElipsoid({}));
    }
}
export function MoveToTop(){
    if(top !== 0) return;

    top = -step;
    setIntervalForMoving();
}
export function MoveToDown(){
    if(top !== 0) return;

    top = step;
    setIntervalForMoving();
}
export function MoveToFront(){
    if(front !== 0) return;

    front = 0.7;
    setIntervalForMoving();
}
export function MoveToBack(){
    if(front !== 0) return;

    front = 1.3;
    setIntervalForMoving();
}
export function MoveToLeft(){
    if(left !== 0) return;    

    left = -step;
    setIntervalForMoving();
}
export function MoveToRight(){
    if(left !== 0) return;

    left = step;
    setIntervalForMoving();
}
export function StopMovingFront(){
    front = 0;
    removeIntervalForMoving();
}
export function StopMovingBack(){
    front = 0;
    removeIntervalForMoving();
}
export function StopMovingLeft(){
    left = 0;
    removeIntervalForMoving();
}
export function StopMovingRight(){
    left = 0;
    removeIntervalForMoving();
}
export function StopMovingTop(){
    top = 0;
    removeIntervalForMoving();
}
export function StopMovingDown(){
    top = 0;
    removeIntervalForMoving();
}