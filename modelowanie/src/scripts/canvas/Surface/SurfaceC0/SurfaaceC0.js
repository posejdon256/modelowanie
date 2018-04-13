import { updateCursor, getCursor, setCursor } from "../../Cursor/Cursor";
import { setAddBezierState, addBezierCurve } from "../../Bezier/Bezier";
import { addPoint } from "../../Points/Points";
import { addPointToCurve } from "../../Bezier/Curve";

const length = 0.5;
let sinus = 0;
let width;
let r;
export function makeSurfaceC0(surface) {
    if(surface.cylinder) {
        width = 4;
        r = surface.width;
    } else {
        width = surface.width;
    }
    setAddBezierState(true);
    const curvesCount = surface.height * 4;
    if(surface.cylinder) {
        sinus = width * 4;
    } else {
        sinus = 0;
    }
    surface.pointsMap = [];
    for(let i = 0; i < curvesCount; i ++) {
        surface.pointsMap.push([]);
    }
    for(let i = 0; i < curvesCount; i ++) {
        const cursorPosition1 = getCursor();
        const y = cursorPosition1.y;
        const z = cursorPosition1.z;
        updateCursor(length / curvesCount, 0, 0);
        const curve = addBezierCurve({surface: true});
        surface.curves.push(curve);
        for(let j = 0; j < width; j ++) {
            makeFlake(length / width, j, surface, i);
        }
        const cursorPosition2 = getCursor();
        setCursor(cursorPosition2.x, y, z);
        //updateCursor(0, -(surface.cylinder ? (r * Math.cos(2*Math.PI))/64 : sum) , 0);
    }
    updateCursor(-length, 0, 0);
    const curvesLen = surface.curves.length;
    for(let i = 0; i < surface.curves[0].points.length; i ++) {
        const curve = addBezierCurve({surface: true});
        for(let j = 0; j < curvesLen; j ++) {
            addPointToCurve(surface.curves[j].points[i]);
        }
        surface.curves.push(curve);
    }
    setAddBezierState(false);
    console.log(surface.pointsMap);
}
function makeFlake(_length, j, surface, k) {
    const diff = _length/4;
    for(let i = 0; i < 4; i ++) {
        if(j === 0 || i !== 0) {
            if(j === width - 1 && surface.cylinder && i === 3) {
                addPointToCurve(surface.curves[surface.curves.length - 1].points[0]);
                return;
            }
            const y = surface.cylinder ? (r * Math.cos((2*((j*width) + i) * Math.PI) / sinus)) / 64 : diff;
            const z = surface.cylinder ? (r * Math.sin((2*((j*width) + i) * Math.PI) / sinus)) / 64 : 0;
            updateCursor(0, y, z);
            const point = addPoint();
            addPointToCurve(point);
            surface.pointsMap[k].push(point);
        }
    }
}