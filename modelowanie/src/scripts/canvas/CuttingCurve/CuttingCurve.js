const curves = [];
export function addCuttingCurve() {

}
export function removeCuttingCurve() {

}
export function getCuttingCurves() {
    return curves;
}
export function updateCuttingCurveName(id, name) {
    curves.find(x => x.id === id).name = name;
    return curves;
}