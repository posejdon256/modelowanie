import Redraw from '../Draw/Redraw';
import { updateMillPosition } from '../Mill/Mill/Mill';


let front = 0;
let left = 0;
let top = 0;
let step = 0.01;
let stillMove = false;

function interval1() {
    if(!stillMove) 
        return;
    updateMillPosition(left, top, front);
    Redraw();
    setTimeout(function(){
        requestAnimationFrame(interval1);
    }, 50);
}
async function setIntervalForMoving(){
    stillMove = true;
    interval1();
}
function removeIntervalForMoving(){
    if(front === 0 && left === 0 && top === 0) {
        //clearInterval(interval);
        stillMove = false;
    }
}
export function MoveToTopMill(){
    if(top !== 0) return;

    top = -step;
    setIntervalForMoving();
}
export function MoveToDownMill(){
    if(top !== 0) return;

    top = step;
    setIntervalForMoving();
}
export function MoveToFrontMill(){
    if(front !== 0) return;

    front = step;
    setIntervalForMoving();
}
export function MoveToBackMill(){
    if(front !== 0) return;

    front = -step;
    setIntervalForMoving();
}
export function MoveToLeftMill(){
    if(left !== 0) return;    

    left = -step;
    setIntervalForMoving();
}
export function MoveToRightMill(){
    if(left !== 0) return;

    left = step;
    setIntervalForMoving();
}
export function StopMovingFrontMill(){
    front = 0;
    removeIntervalForMoving();
}
export function StopMovingBackMill(){
    front = 0;
    removeIntervalForMoving();
}
export function StopMovingLeftMill(){
    left = 0;
    removeIntervalForMoving();
}
export function StopMovingRightMill(){
    left = 0;
    removeIntervalForMoving();
}
export function StopMovingTopMill(){
    top = 0;
    removeIntervalForMoving();
}
export function StopMovingDownMill(){
    top = 0;
    removeIntervalForMoving();
}