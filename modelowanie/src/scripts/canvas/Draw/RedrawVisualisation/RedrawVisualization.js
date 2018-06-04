import { getCuttingCurves, getCuttingCurvesSize } from "../../CuttingCurve/CuttingCurve";

let img1;
let img2;
let canvas1;
let canvas2;
export function setVisualisationCanvases(c1, c2) {
    canvas1 = c1;
    canvas2 = c2;
}
export function RedrawVisualization() {
    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    img1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    img2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    const curve = getCuttingCurves()[0];
    const size = getCuttingCurvesSize();
    for(let i = 0; i < size; i ++) {
        for(let j = 0; j < size; j ++) {
            const col1 = curve.intersectionVisualization1[i][j];
            const col2 = curve.intersectionVisualization2[i][j];
            const rgb1 = {r: col1, g: col1, b: col1};
            const rgb2 = {r: col2, g: col2, b: col2};
            img1 = drawPixel(i, j, img1, ctx1, rgb1);
            img2 = drawPixel(i, j, img2, ctx2, rgb2);
        }
    }
    ctx1.putImageData(img1, 0, 0);  
    ctx2.putImageData(img2, 0, 0);  
}
function drawPixel(x, y, img, ctx, rgb) {
    const place = (parseInt((y), 10)* canvas1.width * 4) + (parseInt(x, 10) * 4);
    img.data[place] = rgb.r;
    img.data[place + 1] = rgb.g;
    img.data[place + 2] = rgb.b;
    img.data[place + 3] = 255
    return img;
   // localContext.fillRect( parseInt(x,10), parseInt(y,10), 1, 1 );
}