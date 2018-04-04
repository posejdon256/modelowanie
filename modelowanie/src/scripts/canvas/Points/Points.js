import { getCursor } from '../Cursor/Cursor';
import Redraw from '../Draw/Redraw';
import { CatchPoint, RemoveCatchPoint } from '../Move/MoveCursor';
import { getAddBezierState } from '../Bezier/Bezier';
import { getSelectedCurveId, addPointToCurve } from '../Bezier/Curve';
import { getAddingC2State } from '../Bezier/BSpline';

const points = [];
let pointNumber = 1;

export function getPoints(){
    return points;
}
export function removePoint(id) {
    for(let i = 0; i < points.length; i ++) {
        if(points[i].id === id) {
            points[i].deleted = true;
            if(points[i].virtualPoints !== undefined) {
                for(let j = 0; j < points[i].virtualPoints.length; j++) {
                    points[i].virtualPoints[j].deleted = true;
                }
            }
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
                RemoveCatchPoint(points[i]);
            }
            points[i].selected = !points[i].selected;
        }
    }
    Redraw();
    return points;
}
export function addPoint(x, y, z) {
    const cursor = x === undefined ? getCursor() : {x: x, y: y, z: z};
    const newPoint = {
        x: cursor.x,
        y: cursor.y,
        z: cursor.z,
        name: "Punkt " + pointNumber,
        id: pointNumber,
        selected: false,
        c2Bezier: x !== undefined ? true : false,
        c2BSpline: getAddingC2State() && x === undefined ? true : false,
        curves: []
    };
    if(newPoint.c2BSpline) {
        newPoint.virtualPoints = [];
    }
    pointNumber ++;
    if((getAddBezierState() || getAddingC2State())) {
        newPoint.curves.push(getSelectedCurveId());
        if(x === undefined)
            addPointToCurve(newPoint);
    }
    points.push(newPoint);
    Redraw();
    return newPoint;
}