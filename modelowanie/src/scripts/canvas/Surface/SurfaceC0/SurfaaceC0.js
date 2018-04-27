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
    if(surface.cylinder) {
        width = Math.max(3, surface.height);
        r = surface.absoluteWidth;
    } else {
        width = surface.width;
    }
    setAddBezierState(true);
    const curvesCount = (surface.height * 3) + 1;
    if(surface.cylinder) {
        sinus = (width * 3) - 1;
    } else {
        sinus = 0;
    }
    surface.pointsMap = [];
    for(let i = 0; i < curvesCount; i ++) {
        surface.pointsMap.push([]);
    }
    let length = surface.absoluteWidth * (width);
    let length2 = _lengthPrim * curvesCount;
    if(!surface.cylinder) {
        if(surface.direction === 0)
            updateCursor(- 3 * length / 8, -  3 * length / 8, 0);
        else if(surface.direction === 1) {
            updateCursor(- 3 * length / 8, 0, -  3 * length / 8);
        } else if(surface.direction === 2) {
            updateCursor(0, -  3 * length / 8, - 3 * length / 8);
        }
    } else {
         if(surface.direction === 0)
             updateCursor(- 3 * length2 / 8, 0,  0);
        // else if(surface.direction === 1) {
        //     updateCursor(- r, - 3 * length2 / 8,  - r);
        // } else if(surface.direction === 2) {
        //     updateCursor(-r, -r,  - 3 * length2 / 8);
        // }
    }
    startCursor = JSON.parse(JSON.stringify(getCursor()));
    for(let i = 0; i < curvesCount; i ++) {
        const cursorPosition1 = getCursor();
        let y = startCursor.y;
        let z = startCursor.z;
        let x = startCursor.x;
        const curve = addBezierCurve({surface: true});
        surface.curves.push(curve);
        for(let j = 0; j < width; j ++) {
            makeFlake(length / width, j, surface, i);
        }
        const cursorPosition2 = getCursor();
        let xPrim = cursorPosition2.x;
        let yPrim = cursorPosition2.y;
        let zPrim = cursorPosition2.z;
        if(surface.direction === 1) {
            xPrim = x;
            zPrim = z;
        } else if(surface.direction === 2) {
            xPrim = x;
            yPrim = y;
        } else if(surface.direction === 0) {
            yPrim = y;
            zPrim = z;
        }
       // setCursor(xPrim, yPrim, zPrim);
        if(surface.direction === 0) {
            updateCursor(length2 / curvesCount, 0, 0);
        } else if(surface.direction === 1) {
            updateCursor(0, length2 / curvesCount, 0);
        } else {
            updateCursor(0, 0, length2 / curvesCount);
        }
        //updateCursor(0, -(surface.cylinder ? (r * Math.cos(2*Math.PI))/64 : sum) , 0);
    }
    const curvesLen = surface.curves.length;
    for(let i = 0; i < surface.curves[0].points.length; i ++) {
        const curve = addBezierCurve({surface: true});
        for(let j = 0; j < curvesLen; j ++) {
            addPointToCurve(surface.curves[j].points[i]);
        }
        surface.curves.push(curve);
    }
    selectCurve(surface.curves[surface.curves.length - 1]);
    setAddBezierState(false);
    turnOffAllStates();
}
function makeFlake(_length, j, surface, k) {
    const diff = _length/4;
    let counter = 0;
    for(let i = 0; i < 4; i ++) {
        if(j === 0 || i !== 0) {
            if(j === width - 1 && surface.cylinder && i === 3) {
                addPointToCurve(surface.curves[surface.curves.length - 1].points[0]);
                surface.pointsMap[k].push(surface.curves[surface.curves.length - 1].points[0]);
                return;
            }
            let y = surface.cylinder ? (r * Math.cos((2*((j*3) + counter) * Math.PI) / sinus)) : diff;
            let z = surface.cylinder ? (r * Math.sin((2*((j*3) + counter) * Math.PI) / sinus)) : 0;
            let x = 0;
            if(surface.direction === 1) {
                let temp = x;
                x = y;
                y = temp;
            } else if(surface.direction === 2) {
                let temp = x;
                x = z;
                z = temp;
            }
            const _cursor = getCursor();
            setCursor(_cursor.x, startCursor.y + y,startCursor.z +z);
            const point = addPoint();
            //updateCursor(x, y, z);
            //addPointToCurve(point);
            surface.pointsMap[k].push(point);
            counter ++;
        }
    }
}