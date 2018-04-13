import Redraw from "../Draw/Redraw";
import { setAddBezierState, getBezierPoints, addBezierCurve } from "./Bezier";
import { getSplinePoints, getAddingC2State, addBsplinePoint, rebuildVirtualPointsForSingleCurve, addBsplineCurve } from "./BSpline";
import { removePoint, getPoints } from "../Points/Points";
import { turnOffAllStates } from '../StatesCenter/StatesCenter';
import { addPointToInterpolationCurve, getInterpolationState, getInterpolationPoints } from "./Interpolation";

const curves = [];
let curveCounter = 1;
let selectedCurveId = undefined;

export function getCurves(type){
    switch(type) {
        case "C0":
            return curves.filter(x => x.type === "C0");
        case "C2":
            return curves.filter(x => x.type === "C2");
        case "C2I":
            return curves.filter(x => x.type === "C2I");
        default:
            return curves;
    }
}
export function addCurveBySelectedPoints() {
    const points = getPoints();
    const addingC2State = getAddingC2State();
    if (selectedCurveId === undefined) {
        if(addingC2State) {
            addBsplineCurve();
        } else {
            addBezierCurve();
        }
    }
    for(let i = 0; i < points.length; i ++) {
        if(points[i].selected)
            addPointToCurve(points[i]);
    }
    Redraw();
    return selectedCurveId;
}
export function unpinPoint(pointId) {
    const curve = curves.find(x => x.id === selectedCurveId);
    const points = curve.type === "C2" ? curve.pointsBspline : ( curve.type === "C2I" ? curve.interpolationPoints :curve.points);
    for(let i = 0; i < points.length; i ++) {
        if(pointId === points[i].id) {
            if(curve.type === "C2I") {
                for(let j = 0; j < curve.interpolationPoints.length; j ++) {
                    if(curve.interpolationPoints[j].id === pointId) {
                        curve.pointsBspline.splice(j, 1);
                        break;
                    }
                }
            }
            if(curve.type === "C2" || curve.type === "C2I") {
                const _pointsBSpline = curve.pointsBspline;
                for(let j = 0; j < _pointsBSpline.length; j ++) {
                    for(let k = 0; k < _pointsBSpline[j].virtualPoints.length; k ++) {
                        removePoint(_pointsBSpline[j].virtualPoints[k].id);
                    }
                    _pointsBSpline[j].virtualPoints = [];
                }
            }
            points.splice(i, 1);
            break;
        }
    }
    if(curve.type === "C2" || curve.type === "C2I") {
        rebuildVirtualPointsForSingleCurve(curve.id);
    }
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
    if(curve.type === "C2I") {
        return curve.interpolationPoints;
    }
    return curve.points;

}
export function selectCurve(id) {
    selectCurveWithoutRedraw(id);
    Redraw();
    return curves;
}
export function selectCurveWithoutRedraw(id) {
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
        case "C2I":
            newCurve.name = "Krzywa C2 interpolacyjna  " + curveCounter;
            newCurve.type = "C2I";
            break;
        default:
            break;
    }
    curves.push(newCurve);
    if(newCurve.surface) {
        selectCurveWithoutRedraw(newCurve.id);
    } else {
        selectCurve(newCurve.id);
    }
    curveCounter ++
    return newCurve;
}
export function addPointToCurve(point) {
    const selectedCurveId = getSelectedCurveId();
    const curves = getCurves();
    if(selectedCurveId === undefined) 
        throw new Error('Couldnt find a curve');
    let curve = curves.find(x => x.id === selectedCurveId);
    if(!getAddingC2State() && !getInterpolationState()){
        curve.points.push(point);
    } else if(getAddingC2State() && curve.pointsBspline.find(x => x.id === point.id) === undefined) {
        point.virtualPoints = [];
        point.c2BSpline = true;
        curve = addBsplinePoint(curve, point);
    } else if(curve.interpolationPoints && curve.interpolationPoints.find(x => x.id === point.id) === undefined) {
        point.interpolationPoints = [];
        point.interpolation = true;
        addPointToInterpolationCurve(curve, point);
        
    }
}
export function getCurvesPoints() {
    return getBezierPoints().concat(getSplinePoints()).concat(getInterpolationPoints());
}
export function removeCurve(id) {
    for(let i = 0; i < curves.length; i ++) {
        if(curves[i].id === id) {
            curves.splice(i, 1);
            selectCurve()
            turnOffAllStates();
            break;
        }
    }
    Redraw();
    return curves;
}