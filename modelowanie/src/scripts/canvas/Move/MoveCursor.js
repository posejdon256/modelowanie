import Translate from "../Translation/TranslationCenter/TranslationCenter";
import { DrawPoints, clearCanvas } from "../Draw/Draw";
import { updateCursor } from "../Cursor/Cursor";
import Redraw from '../Draw/Redraw';


let front = 0;
let left = 0;
let top = 0;
let step = 0.0007;

let interval;

function setIntervalForMoving(){
    if(!interval) {
        interval = setInterval(function(){
            updateCursor(left, top, 0);
            Redraw();
        }, 5);
    }
}
function removeIntervalForMoving(){
    if(front === 0 && left === 0 && top === 0) {
        clearInterval(interval);
        interval = undefined;
    }
}
export function MoveToTopCursor(){
    if(top !== 0) return;

    top = -step * (5/3);
    setIntervalForMoving();
}
export function MoveToDownCursor(){
    if(top !== 0) return;

    top = step*(5/3);
    setIntervalForMoving();
}
export function MoveToFrontCursor(){
    if(front !== 0) return;

    front = 1.01;
    setIntervalForMoving();
}
export function MoveToBackCursor(){
    if(front !== 0) return;

    front = 0.99;
    setIntervalForMoving();
}
export function MoveToLeftCursor(){
    if(left !== 0) return;    

    left = -step;
    setIntervalForMoving();
}
export function MoveToRightCursor(){
    if(left !== 0) return;

    left = step;
    setIntervalForMoving();
}
export function StopMovingFrontCursor(){
    front = 0;
    removeIntervalForMoving();
}
export function StopMovingBackCursor(){
    front = 0;
    removeIntervalForMoving();
}
export function StopMovingLeftCursor(){
    left = 0;
    removeIntervalForMoving();
}
export function StopMovingRightCursor(){
    left = 0;
    removeIntervalForMoving();
}
export function StopMovingTopCursor(){
    top = 0;
    removeIntervalForMoving();
}
export function StopMovingDownCursor(){
    top = 0;
    removeIntervalForMoving();
}