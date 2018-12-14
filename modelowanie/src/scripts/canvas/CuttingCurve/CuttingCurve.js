import { addInterpolationCurve, setInterpolationState } from "../Bezier/Interpolation";
import { addPoint } from "../Points/Points";
import { evaluate, evaluateDU, evaluateDV } from "./FindIntersection";
import { crossMultiply, SumPoints, MultiplyPoint } from "../../Helpers/Helpers";

let curves = [];
let numberOfIntersections = 0;
const size = 501.0;
export function cleanCuttingCurves() {
    curves = [];
    numberOfIntersections = 0;
}
export function addCuttingCurve(iCurve, ob1, ob2) {
    const intersectionVisualization1 = [];
    const intersectionVisualization2 = [];
    const curve = {
        id: numberOfIntersections,
        name: "Intersection curve " + numberOfIntersections,
        points: [],
        u1: [],
        v1: [],
        u2: [],
        v2: [],
        interpolationCurve: iCurve ? iCurve : null,
        intersectionVisualization1: intersectionVisualization1,
        intersectionVisualization2: intersectionVisualization2,
        ob1: ob1,
        ob2: ob2
    }
    numberOfIntersections++;
    curves.push(curve);
    return curve;
}
export function updateIn1Visualisation(id, u, v) {
    const curve = curves.find(x => x.id === id);
    if(u.break) {
        curve.intersectionVisualization1.push({break: true});
        return;
    }
    if(u.back) {
        curve.intersectionVisualization1.push({back: true});
        return;
    }
    let _u = (parseInt(u * size, 10)) % size;
    let _v = (parseInt(v * size, 10)) % size;
    if(_u < 0 || _v < 0) {
        return;
    }
    curve.intersectionVisualization1.push({u: _u, v: _v});
}
export function updateIn2Visualisation(ob, id, u, v, u2, v2, ob_id) {
    const curve = curves.find(x => x.id === id);
    if(u.break) {
        curve.intersectionVisualization2.push({break: true});
        return;
    }
    if(u.back) {
        curve.intersectionVisualization2.push({back: true});
        return;
    }
    let _u = (parseInt((u) * size, 10)) % size;
    let _v = (parseInt((v) * size, 10)) % size;
    if(ob_id === 7) {
       // const p = evaluate(ob, u, v);
        const pu = evaluateDU(ob, u2, v2);
        const pv = evaluateDV(ob, u2, v2);
        const cross = MultiplyPoint(crossMultiply(pu, pv), 0.5);
        _u = (parseInt((u + cross.x) * size, 10)) % size;
        _v = (parseInt((v + cross.y) * size, 10)) % size;
    }
    if(_u < 0 || _v < 0){
        return;
    }
    curve.intersectionVisualization2.push({u: _u, v: _v});
}
export function removeCuttingCurve(id) {
    for(let i = 0; i < curves.length; i ++){
        if(curves[i].id === id) {
            curves.splice(i, 1);
            break;
        }
    }
    return curves;
}
export function getCuttingCurves() {
    return curves;
}
export function getCuttingCurvesSize() {
    return size;
}
export function selectCuttingCurve(id) {
    for(let i = 0; i < curves.length; i ++){
        if(curves[i].id === id) {
            curves[i].selected = !curves[i].selected;
        }
    }
    return curves;
}
export function updateCuttingCurveName(id, name) {
    curves.find(x => x.id === id).name = name;
    return curves;
}
export function convertToInterpolationCurve() {
    const curve = curves.find(x => x.selected === true);
    if(!curve) {
        alert("Please select a curve");
        return curves;
    }
    addInterpolationCurve();
    setInterpolationState(true);
    addPoint(curve.points[0].x, curve.points[0].y, curve.points[0].z, "Newton");
    addPoint(curve.points[0].x, curve.points[0].y, curve.points[0].z, "Newton");
    curve.points.forEach(p => {
        addPoint(p.x, p.y, p.z, "Newton");
    });
    addPoint(curve.points[curve.points.length - 1].x, curve.points[curve.points.length - 1].y, curve.points[curve.points.length - 1].z, "Newton");
    addPoint(curve.points[curve.points.length - 1].x, curve.points[curve.points.length - 1].y, curve.points[curve.points.length - 1].z, "Newton");
    setInterpolationState(false);
    for(let i = 0; i < curves.length; i ++){
        if(curves[i].id === curve.id) {
            curves.splice(i, 1);
            break;
        }
    }
    return curves;
}