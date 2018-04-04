import { addNewCurve, getCurves } from "./Curve";
import { getBezierPoints } from "./Bezier";
import { addPoint } from "../Points/Points";
import { updateCursor } from "../Cursor/Cursor";
import Redraw from "../Draw/Redraw";

let addingC2Type = false; //false - b-spline, true - bezier
let addingC2 = false;

export function setAddingC2Type(bezier) {
    addingC2Type = bezier;
    Redraw();
}

export function getAddingC2type() {
    return addingC2Type;
}
export function addBsplineCurve() {
    const curve = {
        objectType: "curve",
        points: [],
        pointsBspline: [],
        pointsBezier: [],
        selected: false,
        chain: false,
        spline: true
    };
    return addNewCurve("C2", curve);
}
export function setAddingC2State(state) {
    addingC2 = state;
}
export function getAddingC2State() {
    return addingC2;
}
export function addBsplinePoint(curve, point) {
    curve.pointsBspline.push(point);
    const points = curve.pointsBspline;
    const j = points.length - 1;
    if( j < 1 )
        return curve;
    const a  = addPoint(points[j - 1].x + ((points[j].x - points[j - 1].x) / 3), points[j - 1].y + ((points[j].y - points[j - 1].y) / 3), points[j - 1].z + ((points[j].z - points[j - 1].z) / 3));
    const b = addPoint(points[j - 1].x + ((points[j].x - points[j - 1].x) / (3/2)), points[j - 1].y + ((points[j].y - points[j - 1].y) / (3/2)), points[j - 1].z + ((points[j].z - points[j - 1].z) / (3/2)));
    if(j > 1) {
       const c =  addPoint(
            points[j - 2].x + (((points[j-1].x - points[j - 2].x) / (3/2)) + (points[j - 1].x + ((points[j].x - points[j - 1].x) / 3) - (points[j - 2].x + ((points[j-1].x - points[j - 2].x) / (3/2))))/ 2),
            points[j - 2].y + (((points[j-1].y - points[j - 2].y) / (3/2)) + (points[j - 1].y + ((points[j].y - points[j - 1].y) / 3) - (points[j - 2].y + ((points[j-1].y - points[j - 2].y) / (3/2))))/ 2),
            points[j - 2].z + (((points[j-1].z - points[j - 2].z) / (3/2)) + (points[j - 1].z + ((points[j].z - points[j - 1].z) / 3) - (points[j - 2].z + ((points[j-1].z - points[j - 2].z) / (3/2))))/ 2)
        );
        curve.pointsBspline[j].virtualPoints.push(c);
    }
    curve.pointsBspline[j].virtualPoints.push(a);
    curve.pointsBspline[j].virtualPoints.push(b);
    return curve;
}
export function cutBSpline() {
    const curves = getCurves("C2");
    for(let i = 0; i < curves.length; i ++) {
        const points = curves[i].pointsBspline;
        if(points.length === 0)
            continue;
        curves[i].points = [];
        for(let j = 0; j < points.length; j ++) {
            if(j < 1 || !points[j].virtualPoints.length)
                continue;
            if(j > 1) {
                points[j].virtualPoints[0].x = points[j - 2].x + (((points[j-1].x - points[j - 2].x) / (3/2)) + (points[j - 1].x + ((points[j].x - points[j - 1].x) / 3) - (points[j - 2].x + ((points[j-1].x - points[j - 2].x) / (3/2))))/ 2);
                points[j].virtualPoints[0].y = points[j - 2].y + (((points[j-1].y - points[j - 2].y) / (3/2)) + (points[j - 1].y + ((points[j].y - points[j - 1].y) / 3) - (points[j - 2].y + ((points[j-1].y - points[j - 2].y) / (3/2))))/ 2);
                points[j].virtualPoints[0].z = points[j - 2].z + (((points[j-1].z - points[j - 2].z) / (3/2)) + (points[j - 1].z + ((points[j].z - points[j - 1].z) / 3) - (points[j - 2].z + ((points[j-1].z - points[j - 2].z) / (3/2))))/ 2);
            }
            const index = j > 1 ? 1 : 0;
            points[j].virtualPoints[index].x = points[j - 1].x + ((points[j].x - points[j - 1].x) / 3);
            points[j].virtualPoints[index].y = points[j - 1].y + ((points[j].y - points[j - 1].y) / 3);
            points[j].virtualPoints[index].z = points[j - 1].z + ((points[j].z - points[j - 1].z) / 3);

            points[j].virtualPoints[index + 1].x = points[j - 1].x + ((points[j].x - points[j - 1].x) / (3/2));
            points[j].virtualPoints[index + 1].y = points[j - 1].y + ((points[j].y - points[j - 1].y) / (3/2));
            points[j].virtualPoints[index + 1].z = points[j - 1].z + ((points[j].z - points[j - 1].z) / (3/2));
            curves[i].points =  curves[i].points.concat(points[j].virtualPoints);
        }
       // curves[i].pointsBezier = _finalPoints;
    }
    return curves;
}

export function carefullyCutBspline() {
    const curves = getCurves();
    for(let i = 0 ; i < curves.length; i ++) {
        const points = curves[i].points;
        for(let j = 2; j < points.length; j += 3) {
            if(!areC1(points[j - 1], points[j], points[j + 1])) {
                if(points[j].selected) {
                    points[j - 1].x = (2 * points[j].x) - points[j + 1].x;
                    points[j - 1].y = (2 * points[j].y) - points[j + 1].y;
                    points[j - 1].z = (2 * points[j].z) - points[j + 1].z;
                } else {
                    points[j].x = (points[j + 1].x + points[j - 1].x) / 2;
                    points[j].y = (points[j + 1].y + points[j - 1].y) / 2;
                    points[j].z = (points[j + 1].z + points[j - 1].z) / 2;
                }
            }
            if(!areC2(points[j - 2], points[j - 1], points[j + 1], points[j + 2])) {
                if(points[j + 2].selected) {
                    points[j + 1].x = points[j - 1].x -  (points[j - 2].x / 2) + (points[j + 2].x / 2);
                    points[j + 1].y = points[j - 1].y -  (points[j - 2].y / 2) + (points[j + 2].y / 2);
                    points[j + 1].z = points[j - 1].z -  (points[j - 2].z / 2) + (points[j + 2].z / 2);

                    points[j].x = (points[j + 1].x + points[j - 1].x) / 2;
                    points[j].y = (points[j + 1].y + points[j - 1].y) / 2;
                    points[j].z = (points[j + 1].z + points[j - 1].z) / 2;
                } else {
                    points[j + 2].x = -(2 * points[j - 1].x) + (2 * points[j + 1].x) + points[j - 2].x;
                    points[j + 2].y = -(2 * points[j - 1].y) + (2 * points[j + 1].y) + points[j - 2].y;
                    points[j + 2].z = -(2 * points[j - 1].z) + (2 * points[j + 1].z) + points[j - 2].z;
                }
            }
        }
    }
    for(let i = 0; i < curves.length; i ++) {
        let ret = [];
        for(let j = 0; j < curves[i].pointsBspline.length; j ++){
            ret = ret.concat(curves[i].pointsBspline[j].virtualPoints);
        }
        curves[i].points = ret;
    }
    return curves;
}
function updateDeBoors(curve){
    const splines = curve.pointsBspline;
    for(let i = 1; i < splines.length; i ++) {
        const a1 = splines[i - 1] - splines[i]
    }
}
function areC1(p1, p2, p3) {
    return (p3.x - p2.x).toFixed(6) === (p2.x - p1.x).toFixed(6) 
    && (p3.y - p2.y).toFixed(6) === (p2.y - p1.y).toFixed(6) 
    && (p3.z - p2.z).toFixed(6) === (p2.z - p1.z).toFixed(6);
}
function areC2(p1, p2, p4, p5) {
    return (p5.x - (2 * p4.x)).toFixed(6) === (p1.x - (2 * p2.x)).toFixed(6) 
    && (p5.y - (2 * p4.y)).toFixed(6) === (p1.y - (2 * p2.y)).toFixed(6) 
    && (p5.z - (2 * p4.z)).toFixed(6) === (p1.z - (2 * p2.z)).toFixed(6);
}
export function getSplinePoints() {
    clearArray(getCurves());
    if(!addingC2Type) {
        return getBezierPoints(cutBSpline());
    } else {
        return getBezierPoints(carefullyCutBspline());
    }
}
function clearArray(curves) {
    for(let i = 0; i < curves.length; i ++) {
        for(let j = 0; j < curves[i].pointsBspline.length; j ++) {
            if(curves[i].pointsBspline[j].deleted)
                curves[i].pointsBspline.splice(j, 1);
        }
    }
}