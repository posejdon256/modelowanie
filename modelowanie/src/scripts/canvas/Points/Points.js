import { getCursor } from '../Cursor/Cursor';
import Redraw from '../Draw/Redraw';
import { CatchPoint, RemoveCatchPoint } from '../Move/MoveCursor';
import { getAddBezierState } from '../Bezier/Bezier';
import { getSelectedCurveId, addPointToCurve, getCurves } from '../Bezier/Curve';
import { getAddingC2State } from '../Bezier/BSpline';
import { getInterpolationState } from '../Bezier/Interpolation';
import { getAddingSurfaceState } from '../Surface/Surface';
import { TryParseFloat } from '../../Helpers/Helpers';

let points = [];
let pointNumber = 1;

export function getPoints(filter){
    if(points.length > 1000) {
        new Promise(function(resolve, reject) {
            try {
            for(let i = 0; i < points.length; i ++) {
                if(points[i].deleted) {
                    points.splice(i, 1);
                    i --;
                }
            }
            }
            catch(e) {
                reject(e);
            }
            console.log(points.length);
            resolve('wow!');
        });
    } 
    if(filter === "on-scene") {
        return points.filter(x => x.visible !== false && !x.c2Bezier);
    }
    return points;
}
export function removePointWithRedraw(id) {
    removePoint(id);
    Redraw();
    return points;
}
export function removePoint(id) {
    let deleteVirtualPoints = false;
    let deleteFromInterpolation= false;
    let interpolationPoint = undefined;
    for(let i = 0; i < points.length; i ++) {
        if(points[i].id === id) {
            if(points[i].surface) {
                alert("Ten punkt należy do płatka bikubicznego i nie da się go usunąć!");
                return;
            }
            points[i].deleted = true;
            if(points[i].virtualPoints !== undefined) {
                deleteVirtualPoints = true;
            }
            if(points[i].interpolation) {
                deleteFromInterpolation = true;
                interpolationPoint = points[i];
            }
            points.splice(i, 1);
            break;
        }
    }
    if(deleteVirtualPoints) {
        for(let i = 0; i < points.length; i ++) {
            if(points[i].c2Bezier) {
                points.splice(i, 1);
                i --;
            }
            else if(points[i].virtualPoints && points[i].virtualPoints.length > 1) {
                points[i].virtualPoints.forEach(p => {
                    p.deleted = true;
                });
                points[i].virtualPoints = [];
            }
        }
    }
    if(deleteFromInterpolation) {
        const curves = getCurves("C2I");
        for(let i = 0; i < curves.length; i ++) {
            for(let j = 0; j < curves[i].interpolationPoints.length; j ++) {
                if(curves[i].interpolationPoints[j].id === interpolationPoint.id) {
                    curves[i].interpolationPoints.splice(j,1);
                    curves[i].pointsBspline[j].deleted = true;
                    break;
                }
            }
        }
    }
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
export function updateSelectedPoints(x, y, z) {
    const selectedPoints = points.filter(x => x.selected);
    for(let i = 0; i < selectedPoints.length; i ++) {
        selectedPoints[i].x = TryParseFloat(x, selectedPoints[i].x);
        selectedPoints[i].y = TryParseFloat(y, selectedPoints[i].y);
        selectedPoints[i].z = TryParseFloat(z, selectedPoints[i].z);
    }
    Redraw();
    return points;
}
export function addPoint(x, y, z, type) {
    const cursor = type === undefined ? getCursor() : {x: x, y: y, z: z};
    const newPoint = {
        x: cursor.x,
        y: cursor.y,
        z: cursor.z,
        name: "Punkt " + pointNumber,
        id: pointNumber,
        selected: false,
        c2Bezier: type === "C2-bezier" ? true : false,
        c2BSpline: getAddingC2State() && x === undefined ? true : false,
        curves: [],
        type: type
    };
    if(type === "Newton") {
        newPoint.visible = false;
    }
    if(getAddingSurfaceState()) {
        newPoint.surface = true;
    }
    if(getAddingC2State() || getInterpolationState()) {
        newPoint.virtualPoints = [];
    }
    pointNumber ++;
    if((getAddBezierState() || getAddingC2State()) || getInterpolationState()) {
        newPoint.curves.push(getSelectedCurveId());
        if(type !== "C2-bezier" && type !== "C2i-boor") {
            addPointToCurve(newPoint);
        }
    }
    points.push(newPoint);
    return newPoint;
}
export function addPointWithRedraw() {
    const newPoint = addPoint();
    Redraw();
    return newPoint;
}
export function clearPoints() {
    points = [];
    pointNumber = 1;
}