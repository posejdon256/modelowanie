const curves = [];
let numberOfIntersections = 0;
const size = 250.0;
export function addCuttingCurve(iCurve) {
    const intersectionVisualization1 = [];
    const intersectionVisualization2 = [];
    for(let i = 0; i < size; i ++) {
        intersectionVisualization1.push([]);
        intersectionVisualization2.push([]);
        for(let j = 0; j < size; j ++) {
            intersectionVisualization1[i].push(0);
            intersectionVisualization2[i].push(0);
        }
    }
    const curve = {
        id: numberOfIntersections,
        name: "Intersection curve " + numberOfIntersections,
        interpolationCurve: iCurve ? iCurve : null,
        intersectionVisualization1: intersectionVisualization1,
        intersectionVisualization2: intersectionVisualization2
    }
    curves.push(curve);
    return curve;
}
export function updateIn1Visualisation(id, u, v) {
    const curve = curves.find(x => x.id === id);
    const _u = (parseInt(u * size, 10) + size) % size;
    const _v = (parseInt(v * size, 10) + size) % size;
    if(_u < 0 || _v < 0) {
        console.log(u, v);
        return;
    }
    curve.intersectionVisualization1[_u][_v] = size;
}
export function updateIn2Visualisation(id, u, v) {
    const curve = curves.find(x => x.id === id);
    const _u = (parseInt(u * size, 10) + size) % size;
    const _v = (parseInt(v * size, 10) + size) % size;
    if(_u < 0 || _v < 0){
        console.log(u, v);
        return;
    }
    curve.intersectionVisualization2[_u][_v] = size;
}
export function removeCuttingCurve() {

}
export function getCuttingCurves() {
    return curves;
}
export function getCuttingCurvesSize() {
    return size;
}
export function updateCuttingCurveName(id, name) {
    curves.find(x => x.id === id).name = name;
    return curves;
}