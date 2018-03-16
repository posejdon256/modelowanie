import { getTorusLines, getRAndr, getTorusVisibility } from "../Torus/Torus";


let _r = 0;
let _g = 0;
let _b = 0;
let _a = 0;
let _ctx;
let _ctxStereo;
let _ctxStereo2;
let _canvas;
let stereoscopy = false;
let _height;
let _width;
/**
 * Ustawia kolor rysowania
 * @param {int} r - color dla r od 0 do 255
 * @param {int} g - color dla g od 0 do 255
 * @param {int} b - color dla b od 0 do 255
 * @param {int} a - przepływ alpha od 0.0 do 1.0
 */
export function setPixelColor(r, g, b, a) {
    _r = r;
    _g = g;
    _b = b;
    _a = a;
}
export function setStereoscopyDraw(_stereoscopy) {
    stereoscopy = _stereoscopy;
}
export function setCanvas(canvas) {
    _ctx = canvas.getContext("2d");
    _ctx.translate(0.5, 0.5);
    _canvas = canvas;

    _height = canvas.height;
    _width = canvas.width;
}
export function setStereoscopyCancas(canvas, canvasStero2) {
    _ctxStereo = canvas.getContext("2d");
    _ctxStereo.translate(0.5, 0.5);

    _ctxStereo2 = canvasStero2.getContext("2d");
    _ctxStereo2.translate(0.5, 0.5);
}
export function drawPixel(x, y) {
    _ctx.fillStyle = "rgba("+_r+","+_g+","+_b+","+_a+")";
    _ctx.fillRect( parseInt(x,10), parseInt(y,10), 1, 1 );
}
export function clearCanvas() {
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    _ctxStereo.clearRect(0, 0, _width, _height);
    _ctxStereo2.clearRect(0, 0, _canvas.width, _canvas.height);
}
function drawLine(x1, y1, x2, y2, ctx) {
    let localContext = _ctx;
    if(ctx) {
        localContext = ctx;
    }
    localContext.moveTo(x1, y1);
    localContext.lineTo(x2, y2);
}
export function Draw(points) {
    clearCanvas();
    const torusVisible = getTorusVisibility();
    if(torusVisible) {
        torusDraw(points);
    }
    if(stereoscopy){
        stereoscopyDraw();
    }
   _ctx.fillStyle = "rgba(255, 255, 255, 1)";
   _ctx.fillRect( 500, 300, 1, 1 );
}
function torusDraw(points){
    const lines = getTorusLines();
    if(!stereoscopy) {
        _ctx.strokeStyle = "rgba("+_r+","+_g+","+_b+","+_a+")";
        drawTorusLines(lines, _ctx, points);
    } else {
        const { left, right } = points;
        
        _ctxStereo.strokeStyle = "rgba(236, 4, 0, 1)";
        _ctxStereo2.strokeStyle = "rgba(0, 249, 247, 1)";
        if(drawTorusLines) {
            drawTorusLines(lines, _ctxStereo2, left);
            drawTorusLines(lines, _ctxStereo, right);
        }
    }
}
function stereoscopyDraw() {
    // mix canvases
    const imgLeft = _ctxStereo2.getImageData(0, 0, _width, _height);
    
    const imgRight = _ctxStereo.getImageData(0, 0, _width, _height);
    const imgNew = _ctx.createImageData(_width, _height);

    for (let i = 0; i < imgRight.data.length; i += 4) {
        imgNew.data[i  ] = Math.min(imgLeft.data[i] + imgRight.data[i], 255);
        imgNew.data[i+1] = Math.min(imgLeft.data[i + 1] + imgRight.data[i + 1], 255);
        imgNew.data[i+2] = Math.min(imgLeft.data[i + 2] + imgRight.data[i + 2], 255);
        imgNew.data[i+3] = 255
    }
    _ctx.putImageData(imgNew, 0, 0);   
}
function drawTorusLines(lines, ctx, points) {
    const rs = getRAndr();
    ctx.beginPath();
    lines.forEach(line => {
        let bla = 10;
        let blaZ = 100;
        if(line[1] < points.length && line[0] < points.length && points[line[0]].z < 1 && points[line[0]].z > -blaZ && points[line[0]].x < bla && points[line[0]].x > -bla
            && points[line[0]].y < bla  && points[line[0]].y > -bla && points[line[1]].z < 1 && points[line[1]].z > -blaZ && points[line[1]].x < bla && points[line[1]].x > -bla
            && points[line[1]].y < bla && points[line[1]].y > -bla) {
            //console.log(points[line[0]].z, points[line[1]].x);
             drawLine(points[line[0]].x * (rs.R + rs.r) + (500), points[line[0]].y * (rs.R + rs.r)+ (300), points[line[1]].x * (rs.R + rs.r)+ (500), points[line[1]].y * (rs.R + rs.r)+ (300), ctx);
         }
    });
    ctx.stroke();
}