import { addInterpolationCurve, setInterpolationState } from "../Bezier/Interpolation";
import { addPoint } from "../Points/Points";

let curves = [];
let numberOfIntersections = 0;
const size = 250.0;
export function cleanCuttingCurves() {
    curves = [];
}
export function addCuttingCurve(iCurve) {
    const intersectionVisualization1 = [];
    const intersectionVisualization2 = [];
    const curve = {
        id: numberOfIntersections,
        name: "Intersection curve " + numberOfIntersections,
        points: [],
        interpolationCurve: iCurve ? iCurve : null,
        intersectionVisualization1: intersectionVisualization1,
        intersectionVisualization2: intersectionVisualization2
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
    let _u = (parseInt(u * size, 10) + size) % size;
    let _v = (parseInt(v * size, 10) + size) % size;
    if(_u < 0 || _v < 0) {
        return;
    }
    curve.intersectionVisualization1.push({u: _u, v: _v});
}
export function updateIn2Visualisation(id, u, v) {
    const curve = curves.find(x => x.id === id);
    if(u.break) {
        curve.intersectionVisualization2.push({break: true});
        return;
    }
    if(u.back) {
        curve.intersectionVisualization2.push({back: true});
        return;
    }
    const _u = (parseInt(u * size, 10) + size) % size;
    const _v = (parseInt(v * size, 10) + size) % size;
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
        alert("Nie wybrałeś krzywej!");
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