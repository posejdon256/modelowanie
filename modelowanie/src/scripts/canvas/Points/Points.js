import { getCursor } from '../Cursor/Cursor';
import Redraw from '../Draw/Redraw';
import { CatchPoint, RemoveCatchPoint } from '../Move/MoveCursor';
import { getAddCurveState, addPointToCurve, getSelectedCurveId } from '../Bezier/Bezier';

const points = [];
let pointNumber = 1;

export function getPoints(){
    return points;
}
export function removePoint(id) {
    for(let i = 0; i < points.length; i ++) {
        if(points[i].id === id) {
            points[i].deleted = true;
            points.splice(i, 1);
            break;
        }
    }
    Redraw();
    return points;
}
export function updatePointName(id, newName) {
    for(let i = 0; i < points.length; i ++) {
        if(points[i].id === id) {
            points[i].name = newName;
            break;
        }
    }
    return points;
}
export function updatePoint(id, xDiff, yDiif, zDiff) {

    for(let i = 0; i < points.length; i ++ ){
        if(points[i].id === id) {
            points[i].x += xDiff;
            points[i].y += yDiif;
            points[i].z += zDiff;
            break;
        }
    }
}
export function selectPoint(id) {
    for(let i = 0; i < points.length; i ++) {
        if(points[i].id === id) {
            if(!points[i].selected === true) {
                CatchPoint(points[i]);
            } else {
                RemoveCatchPoint();
            }
            points[i].selected = !points[i].selected;
        }
    }
    Redraw();
    return points;
}
export function addPoint() {
    const cursor = getCursor();
    const newPoint = {
        x: cursor.x,
        y: cursor.y,
        z: cursor.z,
        name: "Punkt " + pointNumber,
        id: pointNumber,
        selected: false,
        curves: []
    };
    pointNumber ++;
    if(getAddCurveState()) {
        newPoint.curves.push(getSelectedCurveId());
        addPointToCurve(newPoint);
    }
    points.push(newPoint);
    Redraw();
}