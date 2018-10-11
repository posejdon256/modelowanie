import { updateCursor, getCursor } from "../Cursor/Cursor";
import Redraw from '../Draw/Redraw';
import { selectPoints } from "../Mouse/SelectPoint";
import { updatePoint, selectPoint } from "../Points/Points";
import { projectIntersectionPoints } from "../CuttingCurve/Projection";


let front = 0;
let left = 0;
let top = 0;
let step = 0.01;
let catchedPoints = [];
let stillMove = false;

function interval1() {
    if(!stillMove) 
        return;
    updateCursor(left, top, front);
    for(let i = 0; i < catchedPoints.length; i ++)
        updatePoint(catchedPoints[i].id, left, top, front);
    Redraw();
    projectIntersectionPoints();    
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
export function CleanCatchedPoints() {
    catchedPoints = [];
}
export function CatchPoint(point) {
    if(point) {
        const _point = catchedPoints.find(x => x.id === point.id);
        if(_point !== undefined) {
            return;
        }
        catchedPoints.push(point);
        return;
    }
    const cursor = getCursor();
    catchedPoints.push(selectPoints(cursor.x, cursor.y, true, cursor.z));
}
export function RemoveCatchPoint(point) {
    if(!point) {
        selectPoint(catchedPoints[0]);
        return;
    }
    if(catchedPoints.length === 0)
        return;
    for(let i = 0; i < catchedPoints.length; i ++) {
        if(catchedPoints[i].id === point.id) {
            catchedPoints.splice(i, 1);
            return;
        }
    }
}
export function MoveToTopCursor(){
    if(top !== 0) return;

    top = -step;
    setIntervalForMoving();
}
export function MoveToDownCursor(){
    if(top !== 0) return;

    top = step;
    setIntervalForMoving();
}
export function MoveToFrontCursor(){
    if(front !== 0) return;

    front = step;
    setIntervalForMoving();
}
export function MoveToBackCursor(){
    if(front !== 0) return;

    front = -step;
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