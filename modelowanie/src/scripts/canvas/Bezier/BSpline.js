import { addNewCurve, getCurves } from "./Curve";
import { getBezierPoints, getBezierPointsFromKnots } from "./Bezier";
import { addPoint } from "../Points/Points";
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
export function addBsplineCurve(conf) {
    const curve = {
        objectType: "curve",
        points: [],
        pointsBspline: [],
        pointsBezier: [],
        selected: false,
        type: "C2",
        chain: false,
        spline: true
    };
    if(conf && conf.surface) {
        curve.surface = true;
    }
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
    return rebuildVirtulaPoint(curve, j);
}
function rebuildVirtulaPoint(curve, j) {
    const points = curve.pointsBspline;
    if( j < 1 )
        return curve;
    const a  = addPoint(points[j - 1].x + ((points[j].x - points[j - 1].x) / 3), points[j - 1].y + ((points[j].y - points[j - 1].y) / 3), points[j - 1].z + ((points[j].z - points[j - 1].z) / 3), "C2-bezier");
    const b = addPoint(points[j - 1].x + ((points[j].x - points[j - 1].x) / (3/2)), points[j - 1].y + ((points[j].y - points[j - 1].y) / (3/2)), points[j - 1].z + ((points[j].z - points[j - 1].z) / (3/2)),  "C2-bezier");
    if(j > 1) {
        const c =  addPoint(
                points[j - 2].x + (((points[j-1].x - points[j - 2].x) / (3/2)) + (points[j - 1].x + ((points[j].x - points[j - 1].x) / 3) - (points[j - 2].x + ((points[j-1].x - points[j - 2].x) / (3/2))))/ 2),
                points[j - 2].y + (((points[j-1].y - points[j - 2].y) / (3/2)) + (points[j - 1].y + ((points[j].y - points[j - 1].y) / 3) - (points[j - 2].y + ((points[j-1].y - points[j - 2].y) / (3/2))))/ 2),
                points[j - 2].z + (((points[j-1].z - points[j - 2].z) / (3/2)) + (points[j - 1].z + ((points[j].z - points[j - 1].z) / 3) - (points[j - 2].z + ((points[j-1].z - points[j - 2].z) / (3/2))))/ 2)
                ,"C2-bezier");
            c.bSpline = { id: j, number: 2};
            curve.pointsBspline[j].virtualPoints.push(c);
    }
    a.bSpline = { id: j, number: 0};
    b.bSpline = { id: j, number: 1};
    curve.pointsBspline[j].virtualPoints.push(a);
    curve.pointsBspline[j].virtualPoints.push(b);
    return curve;
}
export function rebuildVirtualPoints() {
    const curves = getCurves("C2").concat(getCurves("C2I"));
    for(let i = 0; i < curves.length; i ++) {
        rebuildVirtualPointsForSingleCurve(curves[i].id);
    }
}
export function rebuildVirtualPointsForSingleCurve(id) {
    const curves = getCurves();
    const curve = curves.find(x => x.id === id);
    for(let j = 0; j < curve.pointsBspline.length; j ++) {
        curve.pointsBspline[j].virtualPoints.forEach(p => {
            p.deleted = true;
        });
        curve.pointsBspline[j].virtualPoints = [];
        rebuildVirtulaPoint(curve, j);
    }
    return curve;
}
export function cutBSpline() {
    const curves = getCurves("C2").concat(getCurves("C2I"));
    for(let i = 0; i < curves.length; i ++) {
        const points = curves[i].pointsBspline;
        if(points.length === 0 || curves[i].surface)
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
function concatVirtualPoints() {
    const curves = getCurves("C2");
    for(let i = 0; i < curves.length; i ++) {
        const points = curves[i].pointsBspline;
        curves[i].points = [];
        for(let j = 0; j < points.length; j ++) {
            curves[i].points =  curves[i].points.concat(points[j].virtualPoints);
        }
    }
    return curves;
}

export function carefullyCutBspline() {
    const curves = concatVirtualPoints();
    for(let i = 0 ; i < curves.length; i ++) {
        const points = curves[i].points;
        if(points.length < 5)
            continue;
        for(let j = 2; j < points.length; j += 3) {
            if(!areC1(points[j - 1], points[j], points[j + 1]) || !areC2(points[j - 2], points[j - 1], points[j + 1], points[j + 2])) {
                if(points[j - 2].selected) {
                    curves[i].pointsBspline[points[j - 1].bSpline.id].x = curves[i].pointsBspline[points[j - 2].bSpline.id - 1].x + (3*(points[j - 2].x - curves[i].pointsBspline[points[j - 2].bSpline.id - 1].x));
                    curves[i].pointsBspline[points[j - 1].bSpline.id].y = curves[i].pointsBspline[points[j - 2].bSpline.id - 1].y + (3*(points[j - 2].y - curves[i].pointsBspline[points[j - 2].bSpline.id - 1].y));
                    curves[i].pointsBspline[points[j - 1].bSpline.id].z = curves[i].pointsBspline[points[j - 2].bSpline.id - 1].z + (3*(points[j - 2].z - curves[i].pointsBspline[points[j - 2].bSpline.id - 1].z));
                    break;
                }
                if(points[j - 1].selected) {
                    curves[i].pointsBspline[points[j - 1].bSpline.id].x = curves[i].pointsBspline[points[j - 1].bSpline.id - 1].x + ((3/2)*(points[j - 1].x - curves[i].pointsBspline[points[j - 2].bSpline.id - 1].x));
                    curves[i].pointsBspline[points[j - 1].bSpline.id].y = curves[i].pointsBspline[points[j - 1].bSpline.id - 1].y + ((3/2)*(points[j - 1].y - curves[i].pointsBspline[points[j - 2].bSpline.id - 1].y));
                    curves[i].pointsBspline[points[j - 1].bSpline.id].z = curves[i].pointsBspline[points[j - 1].bSpline.id - 1].z + ((3/2)*(points[j - 1].z - curves[i].pointsBspline[points[j - 2].bSpline.id - 1].z));
                    break;
                }
                if(points[j].selected) {
                    const cennterPointX = (curves[i].pointsBspline[points[j - 1].bSpline.id - 1].x + curves[i].pointsBspline[points[j - 1].bSpline.id + 1].x) / 2;
                    const cennterPointY = (curves[i].pointsBspline[points[j - 1].bSpline.id - 1].y + curves[i].pointsBspline[points[j - 1].bSpline.id + 1].y) / 2;
                    const cennterPointZ = (curves[i].pointsBspline[points[j - 1].bSpline.id - 1].z + curves[i].pointsBspline[points[j - 1].bSpline.id + 1].z) / 2;
                    curves[i].pointsBspline[points[j - 1].bSpline.id].x = cennterPointX + ((3/2)*(points[j].x - cennterPointX));
                    curves[i].pointsBspline[points[j - 1].bSpline.id].y = cennterPointY + ((3/2)*(points[j].y - cennterPointY));
                    curves[i].pointsBspline[points[j - 1].bSpline.id].z = cennterPointZ + ((3/2)*(points[j].z - cennterPointZ));
                   break;
                }
            }
        }
    }
    return cutBSpline();
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
    clearArray(getCurves("C2"));
    if(!addingC2Type) {
        return getBezierPoints(cutBSpline());
    } else {
        return getBezierPoints(carefullyCutBspline());
    }
}
export function getBSplinePointsFromKnots(knots) {
        const points = knots;
        for(let j = 0; j < points.length; j ++) {
            points[j].virtualPoints = [];
            if( j < 1 )
                continue;
            const a  = addPoint(points[j - 1].x + ((points[j].x - points[j - 1].x) / 3), points[j - 1].y + ((points[j].y - points[j - 1].y) / 3), points[j - 1].z + ((points[j].z - points[j - 1].z) / 3), "C2-bezier");
            const b = addPoint(points[j - 1].x + ((points[j].x - points[j - 1].x) / (3/2)), points[j - 1].y + ((points[j].y - points[j - 1].y) / (3/2)), points[j - 1].z + ((points[j].z - points[j - 1].z) / (3/2)),  "C2-bezier");
            if(j > 1) {
                const c =  addPoint(
                        points[j - 2].x + (((points[j-1].x - points[j - 2].x) / (3/2)) + (points[j - 1].x + ((points[j].x - points[j - 1].x) / 3) - (points[j - 2].x + ((points[j-1].x - points[j - 2].x) / (3/2))))/ 2),
                        points[j - 2].y + (((points[j-1].y - points[j - 2].y) / (3/2)) + (points[j - 1].y + ((points[j].y - points[j - 1].y) / 3) - (points[j - 2].y + ((points[j-1].y - points[j - 2].y) / (3/2))))/ 2),
                        points[j - 2].z + (((points[j-1].z - points[j - 2].z) / (3/2)) + (points[j - 1].z + ((points[j].z - points[j - 1].z) / 3) - (points[j - 2].z + ((points[j-1].z - points[j - 2].z) / (3/2))))/ 2)
                        ,"C2-bezier");
                    c.bSpline = { id: j, number: 2};
                    points[j].virtualPoints.push(c);
            }
            a.bSpline = { id: j, number: 0};
            b.bSpline = { id: j, number: 1};
            points[j].virtualPoints.push(a);
            points[j].virtualPoints.push(b);
        }
        let ret = [];
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
            ret =  ret.concat(points[j].virtualPoints);
        }
       // curves[i].pointsBezier = _finalPoints;
    return getBezierPointsFromKnots(ret, "C2");
}
export function clearArray(curves) {
    let deleted = false;
    for(let i = 0; i < curves.length; i ++) {
        for(let j = 0; j < curves[i].pointsBspline.length; j ++) {
            if(curves[i].pointsBspline[j].deleted) {
                curves[i].pointsBspline.splice(j, 1);
                deleted = true;
                continue;
            }
        }
    }
    if(deleted)
        rebuildVirtualPoints();
}