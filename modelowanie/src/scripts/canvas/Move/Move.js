import Translate from "../Translation/TranslationCenter/TranslationCenter";
import Draw, { clearCanvas } from "../Draw/Draw";


let front = 0;
let left = 0;
let top = 0;
let step = 0.003;

let interval;

function setIntervalForMoving(){
    if(!interval) {
        interval = setInterval(function(){
            const trasnlationObject = {
                front: front,
                left: left,
                top: top
            }
            Translate(trasnlationObject);
            const translated = Translate(trasnlationObject);
            clearCanvas();
            Draw(translated);
        }, 5);
    }
}
function removeIntervalForMoving(){
    if(front === 0 && left === 0 && top === 0) {
        clearInterval(interval);
        interval = undefined;
    }
}
export function MoveToTop(){
    if(top !== 0) return;

    top = step;
    setIntervalForMoving();
}
export function MoveToDown(){
    if(top !== 0) return;

    top = -step;
    setIntervalForMoving();
}
export function MoveToFront(){
    if(front !== 0) return;

    front = 1.01;
    setIntervalForMoving();
}
export function MoveToBack(){
    if(front !== 0) return;

    front = 0.99;
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