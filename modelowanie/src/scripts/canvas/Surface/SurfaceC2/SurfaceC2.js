import { updateCursor, getCursor, setCursor } from "../../Cursor/Cursor";
import { setAddBezierState, addBezierCurve } from "../../Bezier/Bezier";
import { addPoint } from "../../Points/Points";
import { addPointToCurve, selectCurve } from "../../Bezier/Curve";
import { turnOffAllStates } from "../../StatesCenter/StatesCenter";
import { setAddingSurfaceState } from "../Surface";
import { setAddingC2State, addBsplineCurve } from "../../Bezier/BSpline";

const _lengthPrim = 0.05;
let sinus = 0;
let width;
let r;
let startCursor;
export function makeSurfaceC2(surface, direction) {
    const iterationsX = surface.cylinder ? 4 + (surface.width - 1) - 1 : 4 + (surface.width - 1);
    const iterationsY = 4 + (surface.height - 1);
    const step = surface.cylinder ? 2 * Math.PI / iterationsX : surface.absoluteWidth;
    let cursorStart = getCursor();
    cursorStart = {x: cursorStart.x, y: cursorStart.y, z: cursorStart.z};
    updateCursorOnStart(surface, iterationsX, iterationsY, direction);
   for(let i = 0; i < iterationsY; i ++) {
       surface.pointsMap.push([]);
       for(let j = 0; j < iterationsX; j ++) {
           const cursor = getCursor();
           const p = addPoint();
           surface.pointsMap[i].push(p);
           updateCursorLocalX(surface, iterationsX, step, j, direction);
       }
       if(surface.cylinder) {
           for(let j = 0; j < 3; j ++) {
            setCursor(surface.pointsMap[i][j].x, surface.pointsMap[i][j].y, surface.pointsMap[i][j].z);
            const p = addPoint();
            surface.pointsMap[i].push(p);
           }
           setCursor(surface.pointsMap[i][0].x, surface.pointsMap[i][0].y, surface.pointsMap[i][0].z);
       }
       updateCursorLocalY(surface, iterationsX, direction);
   }
   addCurveC2OnPointsMap(surface);
   setCursor(cursorStart.x, cursorStart.y, cursorStart.z);
}
function updateCursorLocalX(surface, iterationsX, step, i, direction) {
    if(surface.cylinder) {
        if(direction === "X") {
            updateCursor(Math.cos(step * i) * surface.absoluteWidth , 0, Math.sin(step * i) * surface.absoluteWidth);
        } else if(direction === "Y") {
            updateCursor(Math.cos(step * i) * surface.absoluteWidth, Math.sin(step * i) * surface.absoluteWidth , 0);
        } else {
            updateCursor( 0, Math.cos(step * i) * surface.absoluteWidth, Math.sin(step * i) * surface.absoluteWidth);
        }
    } else {
        if(direction === "X") {
            updateCursor(surface.absoluteWidth, 0, 0);
        } else if(direction === "Y") {
            updateCursor(0, surface.absoluteWidth, 0);
        } else {
            updateCursor(0, 0 , surface.absoluteWidth);
        }
    }
}
function updateCursorLocalY(surface, iterationsX, direction) {
    if(surface.cylinder) {
        if(direction === "X") {
            updateCursor(0, surface.absoluteHeight, 0);
        } else if(direction === "Y") {
            updateCursor(0, 0 , surface.absoluteHeight);
        } else {
            updateCursor(surface.absoluteHeight, 0, 0);
        }
    } else {
        if(direction === "X") {
            updateCursor(-surface.absoluteWidth * iterationsX , surface.absoluteHeight, 0);
        } else if(direction === "Y") {
            updateCursor(0, -surface.absoluteWidth * iterationsX, surface.absoluteHeight);
        } else {
            updateCursor(surface.absoluteHeight, 0 , -surface.absoluteWidth * iterationsX);
        }
    }
}
function updateCursorOnStart(surface, iterationsX, iterationsY, direction) {
    if(surface.cylinder) {
        if(direction === "X") {
            updateCursor( 0, -surface.absoluteHeight * iterationsY / 2,  0);
        } else if(direction === "Y") {
            updateCursor(0, 0 , -surface.absoluteHeight * iterationsY / 2);
        } else {
            updateCursor(-surface.absoluteHeight * iterationsY / 2, 0, 0);
        }
    } else {
        if(direction === "X") {
            updateCursor( - (iterationsX - 1) * surface.absoluteWidth / 2, - surface.absoluteHeight * (iterationsY - 1) / 2,  0);
        } else if(direction === "Y") {
            updateCursor(0, - (iterationsX - 1) * surface.absoluteWidth / 2, - surface.absoluteHeight * (iterationsY - 1) / 2);
        } else {
            updateCursor(- (iterationsX - 1) * surface.absoluteWidth / 2, 0, - surface.absoluteHeight * (iterationsY - 1) / 2);
        } 
    }
}
export function addCurveC2OnPointsMap(surface) {
    setAddingSurfaceState(true);
    setAddingC2State(true);
    for(var i = 0; i < surface.pointsMap.length; i ++) {
        const curve = addBsplineCurve({surface: true});
        surface.curves.push(curve);
        for(var j = 0; j < surface.pointsMap[0].length; j ++) {
            addPointToCurve(surface.pointsMap[i][j]);
        }
    }
    for(var i = 0; i < surface.pointsMap[0].length; i ++) {
        const curve = addBsplineCurve({surface: true});
        surface.curves.push(curve);
        for(var j = 0; j < surface.pointsMap.length; j ++) {
            addPointToCurve(surface.pointsMap[j][i]);
        }
    }
    setAddingSurfaceState(false);
    setAddingC2State(false);
}
