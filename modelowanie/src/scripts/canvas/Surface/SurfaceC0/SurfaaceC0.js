import { updateCursor, getCursor, setCursor } from "../../Cursor/Cursor";
import { setAddBezierState, addBezierCurve } from "../../Bezier/Bezier";
import { addPoint } from "../../Points/Points";
import { addPointToCurve, selectCurve } from "../../Bezier/Curve";
import { turnOffAllStates } from "../../StatesCenter/StatesCenter";

const _lengthPrim = 0.05;
let sinus = 0;
let width;
let r;
let startCursor;
export function makeSurfaceC0(surface) {
    const iterationsX = surface.cylinder ? 4 + (surface.width - 1) * 3 - 1 : 4 + (surface.width - 1) * 3;
    const iterationsY = 4 + (surface.height - 1) * 3;
    const step = surface.cylinder ? 2 * Math.PI / iterationsX : surface.absoluteWidth;
   for(let i = 0; i < iterationsY; i ++) {
       surface.pointsMap.push([]);
       for(let j = 0; j < iterationsX; j ++) {
           const cursor = getCursor();
           const p = addPoint();
           surface.pointsMap[i].push(p);
           updateCursorLocalX(surface, iterationsX, step, j);
       }
       if(surface.cylinder) {
            setCursor(surface.pointsMap[i][0].x, surface.pointsMap[i][0].y, surface.pointsMap[i][0].z);
            const p = addPoint();
            surface.pointsMap[i].push(p);
       }
       updateCursorLocalY(surface, iterationsX);
   }
}
function updateCursorLocalX(surface, iterationsX, step, i) {
    if(surface.cylinder) {
        updateCursor(Math.cos(step * i) * surface.absoluteWidth , 0, Math.sin(step * i) * surface.absoluteWidth);
    } else {
        updateCursor(surface.absoluteWidth, 0, 0);
    }
}
function updateCursorLocalY(surface, iterationsX) {
    if(surface.cylinder) {
        updateCursor(0 , surface.absoluteHeight, 0);
    } else {
        updateCursor(-surface.absoluteWidth * iterationsX , surface.absoluteHeight, 0);
    }
}