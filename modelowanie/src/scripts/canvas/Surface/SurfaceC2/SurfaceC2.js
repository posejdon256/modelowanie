import { updateCursor, getCursor, setCursor } from "../../Cursor/Cursor";
import { addPoint } from "../../Points/Points";
import { addPointToCurve, selectCurve } from "../../Bezier/Curve";
import { turnOffAllStates } from "../../StatesCenter/StatesCenter";
import { setAddingC2State, addBsplineCurve, rebuildVirtualPoints } from "../../Bezier/BSpline";

const _lengthPrim = 0.05;
let sinus = 0;
let width;
let r;
export function makeSurfaceC2(surface) {
    if(surface.cylinder) {
        width = 4;
        r = surface.width;
    } else {
        width = surface.width;
    }
    setAddingC2State(true);
    const curvesCount = (surface.height * 3) + 1;
    if(surface.cylinder) {
        sinus = width * 4;
    } else {
        sinus = 0;
    }
    surface.pointsMap = [];
    for(let i = 0; i < curvesCount; i ++) {
        surface.pointsMap.push([]);
    }
    let length = _lengthPrim * (width * 4);
    let length2 = _lengthPrim * curvesCount;
    for(let i = 0; i < curvesCount; i ++) {
        const cursorPosition1 = getCursor();
        let y = cursorPosition1.y;
        let z = cursorPosition1.z;
        let x = cursorPosition1.x;
        const curve = addBsplineCurve({surface: true});
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
        setCursor(xPrim, yPrim, zPrim);
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
    const diff = _length/4;
    for(let i = 0; i < 4; i ++) {
        if(j === 0 || i !== 0) {
            if(j === width - 1 && surface.cylinder && i === 3) {
                addPointToCurve(surface.curves[surface.curves.length - 1].pointsBspline[0]);
                addPointToCurve(surface.curves[surface.curves.length - 1].pointsBspline[1]);
                addPointToCurve(surface.curves[surface.curves.length - 1].pointsBspline[2]);
                surface.pointsMap[k].push(surface.curves[surface.curves.length - 1].pointsBspline[0]);
                surface.pointsMap[k].push(surface.curves[surface.curves.length - 1].pointsBspline[1]);
                surface.pointsMap[k].push(surface.curves[surface.curves.length - 1].pointsBspline[2]);
                return;
            }
            let y = surface.cylinder ? (r * Math.cos((2*((j*width) + i) * Math.PI) / sinus)) / 64 : diff;
            let z = surface.cylinder ? (r * Math.sin((2*((j*width) + i) * Math.PI) / sinus)) / 64 : 0;
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
            const point = addPoint();
            updateCursor(x, y, z);
            //addPointToCurve(point);
            surface.pointsMap[k].push(point);
        }
    }
   // if(j !== width - 1)
     //   updateCursor(0, -2*diff, 0);
}