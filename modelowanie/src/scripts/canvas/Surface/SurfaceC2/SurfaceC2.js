import { updateCursor, getCursor, setCursor } from "../../Cursor/Cursor";
import { addPoint } from "../../Points/Points";
import { addPointToCurve, selectCurve } from "../../Bezier/Curve";
import { turnOffAllStates } from "../../StatesCenter/StatesCenter";
import { setAddingC2State, addBsplineCurve, rebuildVirtualPoints } from "../../Bezier/BSpline";
import Redraw from "../../Draw/Redraw";

let sinus = 0;
let width;
let r;
let startCursor;
export function makeSurfaceC2(surface) {
    if(surface.cylinder) {
        width = Math.max(3, surface.height);
        r = surface.absoluteWidth;
    } else {
        width = surface.width;
    }
    setAddingC2State(true);
    const curvesCount = surface.cylinder ? 4 + (surface.width - 1) : 4 + (surface.height - 1);
    if(surface.cylinder) {
        sinus = 4 + (surface.height - 1);
    } else {
        sinus = 0;
    }
    surface.pointsMap = [];
    for(let i = 0; i < curvesCount; i ++) {
        surface.pointsMap.push([]);
    }
    let length = surface.absoluteWidth * (width);
    let length2 = surface.absoluteHeight * curvesCount;
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
        let y = startCursor.y;
        let z = startCursor.z;
        let x = startCursor.x;
        const curve = addBsplineCurve({surface: true});
        surface.curves.push(curve);
        for(let j = 0; j < width; j ++) {
            makeFlake(length, j, surface, i);
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
            if(surface.cylinder) {
                updateCursor(length2 / curvesCount, 0, 0);
            } else {
                updateCursor(length2 / curvesCount, - (4 *length) - ((width-1) * length) , 0);
                startCursor = JSON.parse(JSON.stringify(getCursor()));
            }
        } else if(surface.direction === 1) {
            updateCursor(0, length2 / curvesCount, 0);
        } else {
            updateCursor(length2 / curvesCount, 0, 0);
        }
        //updateCursor(0, -(surface.cylinder ? (r * Math.cos(2*Math.PI))/64 : sum) , 0);
    }
    const curvesLen = surface.curves.length;
    for(let i = 0; i < surface.curves[0].pointsBspline.length; i ++) {
        const curve = addBsplineCurve({surface: true});
        for(let j = 0; j < curvesLen; j ++) {
            addPointToCurve(surface.curves[j].pointsBspline[i]);
        }
        surface.curves.push(curve);
    }
    selectCurve(surface.curves[surface.curves.length - 1]);
    rebuildVirtualPoints();
    setAddingC2State(false);
    turnOffAllStates();
}
function makeFlake(_length, j, surface, k) {
    const diff = _length;
    for(let i = 0; i < (j === 0 ? 4 : 1); i ++) {
            const _cursor = getCursor();
            let y = surface.cylinder ? (r * Math.cos((2*((j === 0 ? 0 : 3 + j) + i) * Math.PI) / sinus)) : diff;
            let z = surface.cylinder ? (r * Math.sin((2*((j === 0 ? 0 : 3 + j) + i) * Math.PI) / sinus)) : 0;
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
            //addPointToCurve(point);
            surface.pointsMap[k].push(point);
            if(j === width - 1 && surface.cylinder) {
                //Redraw();
                addPointToCurve(surface.curves[surface.curves.length - 1].pointsBspline[0]);
                addPointToCurve(surface.curves[surface.curves.length - 1].pointsBspline[1]);
                addPointToCurve(surface.curves[surface.curves.length - 1].pointsBspline[2]);
                surface.pointsMap[k].push(surface.curves[surface.curves.length - 1].pointsBspline[0]);
                surface.pointsMap[k].push(surface.curves[surface.curves.length - 1].pointsBspline[1]);
                surface.pointsMap[k].push(surface.curves[surface.curves.length - 1].pointsBspline[2]);
                return;
            }
    }
   // if(j !== width - 1)
     //   updateCursor(0, -2*diff, 0);
}