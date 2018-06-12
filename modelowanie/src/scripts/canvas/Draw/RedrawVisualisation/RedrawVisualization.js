import { getCuttingCurves } from "../../CuttingCurve/CuttingCurve";

let canvas1;
let canvas2;
export function setVisualisationCanvases(c1, c2) {
    canvas1 = c1;
    canvas2 = c2;
}
export function RedrawVisualization() {
    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx1.beginPath();
    ctx2.beginPath();
    ctx1.strokeStyle="#FF0000";
    ctx2.strokeStyle="#FF0000";
    const curve = getCuttingCurves()[0];
    ctx1.moveTo(curve.intersectionVisualization1[0].u, curve.intersectionVisualization1[0].v);
    ctx2.moveTo(curve.intersectionVisualization2[0].u, curve.intersectionVisualization2[0].v);
    for(let i = 1; i < curve.intersectionVisualization1.length; i ++) {
        if(curve.intersectionVisualization1[i].break) {
            ctx1.moveTo(curve.intersectionVisualization1[0].u, curve.intersectionVisualization1[0].v);
        } else {
            ctx1.lineTo(curve.intersectionVisualization1[i].u, curve.intersectionVisualization1[i].v);
        }
    }
    for(let i = 1; i < curve.intersectionVisualization2.length; i ++) {
        if(curve.intersectionVisualization1[i].break) {
            ctx2.moveTo(curve.intersectionVisualization2[0].u, curve.intersectionVisualization2[0].v);
        } else {
            ctx2.lineTo(curve.intersectionVisualization2[i].u, curve.intersectionVisualization2[i].v);
        }
    }
    ctx1.lineTo(curve.intersectionVisualization1[0].u, curve.intersectionVisualization1[0].v);
    ctx2.lineTo(curve.intersectionVisualization2[0].u, curve.intersectionVisualization2[0].v);
    ctx1.stroke();
    ctx2.stroke();
}