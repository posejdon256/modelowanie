import { getCuttingCurves } from "../../CuttingCurve/CuttingCurve";

let canvas1;
let canvas2;
export function setVisualisationCanvases(c1, c2) {
    canvas1 = c1;
    canvas2 = c2;
}
export function clearVisualization() {
    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
}
export function RedrawVisualization() {
    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    clearVisualization();
    ctx1.beginPath();
    ctx2.beginPath();
    ctx1.strokeStyle="#FF0000";
    ctx2.strokeStyle="#FF0000";
    const curves = getCuttingCurves();
    const curve = curves[curves.length - 1];
    ctx1.moveTo(curve.intersectionVisualization1[0].u, curve.intersectionVisualization1[0].v);
    ctx2.moveTo(curve.intersectionVisualization2[0].u, curve.intersectionVisualization2[0].v);
    for(let i = 1; i < curve.intersectionVisualization1.length; i ++) {
        if(curve.intersectionVisualization1[i].break && i < curve.intersectionVisualization1.length - 1) {
            ctx1.moveTo(curve.intersectionVisualization1[i + 1].u, curve.intersectionVisualization1[i + 1].v);
        }
        else if(curve.intersectionVisualization1[i].back && i < curve.intersectionVisualization1.length - 1) {
            ctx1.moveTo(curve.intersectionVisualization1[0].u, curve.intersectionVisualization1[0].v);
            ctx1.lineTo(curve.intersectionVisualization1[i + 1].u, curve.intersectionVisualization1[i + 1].v);
        } else {
            ctx1.lineTo(curve.intersectionVisualization1[i].u, curve.intersectionVisualization1[i].v);
        }
    }
    for(let i = 1; i < curve.intersectionVisualization2.length; i ++) {
        if(curve.intersectionVisualization2[i].break && i < curve.intersectionVisualization2.length - 1) {
            ctx2.moveTo(curve.intersectionVisualization2[i + 1].u, curve.intersectionVisualization2[i + 1].v);
        } else if(curve.intersectionVisualization2[i].back && i < curve.intersectionVisualization2.length - 1) {
            ctx2.moveTo(curve.intersectionVisualization2[0].u, curve.intersectionVisualization2[0].v);
            ctx2.lineTo(curve.intersectionVisualization2[i + 1].u, curve.intersectionVisualization2[i + 1].v);
        }else {
            ctx2.lineTo(curve.intersectionVisualization2[i].u, curve.intersectionVisualization2[i].v);
        }
    }

    // ctx1.lineTo(curve.intersectionVisualization1[0].u, curve.intersectionVisualization1[0].v);
    // ctx2.lineTo(curve.intersectionVisualization2[0].u, curve.intersectionVisualization2[0].v);
    ctx1.stroke();
    ctx2.stroke();
}
// export function RedrawVisualization() {
//     const ctx1 = canvas1.getContext("2d");
//     const ctx2 = canvas2.getContext("2d");
//     let img1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
//     let img2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
//     const curves = getCuttingCurves();
//     const curve = curves[curves.length - 1];
//     for(let i = 0; i < curve.intersectionVisualization1.length; i ++) {
//         const rgb = {r: 255, g: 0, b: 0};
//         img1 = drawPixel(curve.intersectionVisualization1[i].u, curve.intersectionVisualization1[i].v, img1, ctx1, rgb);
//     }
//     for(let i = 0; i < curve.intersectionVisualization2.length; i ++) {
//         const rgb = {r: 255, g: 0, b: 0};
//         img2 = drawPixel(curve.intersectionVisualization2[i].u, curve.intersectionVisualization2[i].v, img2, ctx2, rgb);
//     }
//     ctx1.putImageData(img1, 0, 0);  
//     ctx2.putImageData(img2, 0, 0);  
// }
function drawPixel(x, y, img, ctx, rgb) {
    const place = (parseInt((y), 10)* canvas1.width * 4) + (parseInt(x, 10) * 4);
    img.data[place] = rgb.r;
    img.data[place + 1] = rgb.g;
    img.data[place + 2] = rgb.b;
    img.data[place + 3] = 255
    return img;
   // localContext.fillRect( parseInt(x,10), parseInt(y,10), 1, 1 );
}