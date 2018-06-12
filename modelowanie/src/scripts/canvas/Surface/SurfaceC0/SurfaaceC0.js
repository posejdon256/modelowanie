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
    }
    startCursor = JSON.parse(JSON.stringify(getCursor()));
    for(let i = 0; i < curvesCount; i ++) {
        const curve = addBezierCurve({surface: true}); 
        surface.curves.push(curve);
        for(let j = 0; j < width; j ++) {
            makeFlake(length, j, surface, i);
        }
       // setCursor(xPrim, yPrim, zPrim);
        if(surface.direction === 0) {
            if(surface.cylinder) {
                updateCursor(length2 / curvesCount, 0, 0);
            } else {
                updateCursor(length2 / curvesCount, - ((3 *length * width) + length)  , 0);
                startCursor = JSON.parse(JSON.stringify(getCursor()));
            }
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
    const diff = _length;
    let counter = 0;
    for(let i = 0; i < 4; i ++) {
        if(j === 0 || i !== 0) {
            if(j === width - 1 && surface.cylinder && i === 3) {
                addPointToCurve(surface.curves[surface.curves.length - 1].points[0]);
                surface.pointsMap[k].push(surface.curves[surface.curves.length - 1].points[0]);
                return;
            }
            const _cursor = getCursor();
            let y = surface.cylinder ? (r * Math.cos((2*((j*3) + counter) * Math.PI) / sinus)) : diff;
            let z = surface.cylinder ? (r * Math.sin((2*((j*3) + counter) * Math.PI) / sinus)) : 0;
             let x = 0;
            if(surface.direction === 1) {
                let temp = x;
                x = y + startCursor.x;
                y = temp + _cursor.y;
                z += startCursor.z;
            } else if(surface.direction === 2) {
                let temp = x;
                x = z + startCursor.x;
                z = temp + _cursor.z;
                y += startCursor.y;
            } else {
                x += _cursor.x;
                if(!surface.cylinder) {
                    y += _cursor.y;
                } else {
                    y += startCursor.y;
                }
                z += startCursor.z;
            }
            setCursor(x, y, z);
            const point = addPoint();
            //updateCursor(x, y, z);
            //addPointToCurve(point);
            surface.pointsMap[k].push(point);
            counter ++;
        }
    }
}