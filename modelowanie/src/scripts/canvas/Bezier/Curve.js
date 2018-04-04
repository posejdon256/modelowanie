import Redraw from "../Draw/Redraw";
import { setAddBezierState, getBezierPoints } from "./Bezier";
import { getSplinePoints, getAddingC2State, addBsplinePoint, rebuildVirtualPoints, rebuildVirtualPointsForSingleCurve } from "./BSpline";
import { removePoint } from "../Points/Points";

const curves = [];
let curveCounter = 1;
let selectedCurveId = undefined;

export function getCurves(type){
    switch(type) {
        case "C0":
            return curves.filter(x => x.spline === undefined);
        case "C2":
            return curves.filter(x => x.spline !== undefined);
        default:
            return curves;
    }
}
export function unpinPoint(pointId) {
    const curve = curves.find(x => x.id === selectedCurveId);
    const points = curve.type === "C2" ? curve.pointsBspline : curve.points;
    for(let i = 0; i < points.length; i ++) {
        if(pointId === points[i].id) {
            for(let j = 0; j < points.length; j ++) {
                for(let k = 0; k < points[j].virtualPoints.length; k ++) {
                    removePoint(points[j].virtualPoints[k].id);
                }
                points[j].virtualPoints = [];
            }
            points.splice(i, 1);
            break;
        }
    }
    rebuildVirtualPointsForSingleCurve(curve.id);
    Redraw();
    return getCurvesControlPoints(curve.id);
}
export function updateCurveName(id, name) {
    curves.find(x => x.id === id).name = name;
    return curves;
}
export function getCurveById(id){
    const _id = id ? id : selectedCurveId;
    if(!_id)
        return {points: []};
    return curves.find(x => x.id === _id);
}
export function getCurvesControlPoints(_id) {
    const id = _id !== undefined ? _id : selectedCurveId;
        if(id === undefined)
    return [];
    const curve = curves.find(x => x.id === id);
    if(curve.type === "C2") {
        return curve.pointsBspline;
    }
    return curve.points;

}
export function selectCurve(id) {
    for(let i = 0; i < curves.length; i  ++) {
        if(curves[i].id === id){
            curves[i].selected = !curves[i].selected;
            if(curves[i].selected){
                selectedCurveId = id;
            }
            else {
                setAddBezierState(false);
                selectedCurveId = undefined;
            }
        }
        else {
            curves[i].selected = false;
        }
    }
    Redraw();
    return curves;
}
export function deselectCurve() {
    selectedCurveId = undefined;
}
export function getSelectedCurveId(){
    return selectedCurveId;
}
export function addNewCurve(type, newCurve) {
    newCurve.id = curveCounter;
    switch(type) {
        case "C0":;
            newCurve.name = "Krzywa C0 "+ curveCounter;
            newCurve.type = "C0";
            break;
        case "C2":
            newCurve.name = "Krzywa C2 "+ curveCounter;
            newCurve.type = "C2";
            break;
        default:
            break;
    }
    curves.push(newCurve);
    selectCurve(newCurve.id);
    curveCounter ++
    return newCurve;
}
export function addPointToCurve(point) {
    const selectedCurveId = getSelectedCurveId();
    const curves = getCurves();
    if(selectedCurveId === undefined) 
        throw new Error('Couldnt find a curve');
    let curve = curves.find(x => x.id === selectedCurveId);
    if(curve.points.find(x => x.id === point.id) === undefined) {
        if(!getAddingC2State()){
            curve.points.push(point);
        } else {
            curve = addBsplinePoint(curve, point);
        }
    }
}
export function getCurvesPoints() {
    return getBezierPoints().concat(getSplinePoints());
}