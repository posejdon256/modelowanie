import { getTorusLines, getRAndr } from "../Torus/Torus";


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
export function DrawTorus(points) {
    clearCanvas();
   const lines = getTorusLines();
   if(!stereoscopy) {
        normalDrawTorus(points, lines);
   } else {
        stereoscopyDrawTorus(points, lines);
   }
   _ctx.fillStyle = "rgba(255, 255, 255, 1)";
   _ctx.fillRect( 500, 300, 1, 1 );
}
function normalDrawTorus(points, lines) {
    _ctx.beginPath();
    _ctx.strokeStyle = "rgba("+_r+","+_g+","+_b+","+_a+")";
    const rs = getRAndr();
    lines.forEach(line => {
        if(line[1] < points.length && line[0] < points.length) {
             drawLine(points[line[0]].x * (rs.R + rs.r) + (500), points[line[0]].y * (rs.R + rs.r)+ (300), points[line[1]].x * (rs.R + rs.r)+ (500), points[line[1]].y * (rs.R + rs.r)+ (300));
         }
    });
    _ctx.stroke();
}
function stereoscopyDrawTorus(points, lines) {
    const { left, right } = points;
    const rs = getRAndr();
    _ctxStereo2.beginPath();
    _ctxStereo2.strokeStyle = "rgba(0, 249, 247, 1)";
    lines.forEach(line => {
        if(line[1] < left.length && line[0] < left.length) {
             drawLine(left[line[0]].x * (rs.R + rs.r) + (500), left[line[0]].y * (rs.R + rs.r)+ (300), left[line[1]].x * (rs.R + rs.r)+ (500), left[line[1]].y * (rs.R + rs.r)+ (300), _ctxStereo2);
         }
    });
    _ctxStereo2.stroke();

    _ctxStereo.beginPath();
    _ctxStereo.strokeStyle = "rgba(236, 4, 0, 1)";
    lines.forEach(line => {
        if(line[1] < right.length && line[0] < right.length) {
             drawLine(right[line[0]].x * (rs.R + rs.r) + (500), right[line[0]].y * (rs.R + rs.r)+ (300), right[line[1]].x * (rs.R + rs.r)+ (500), right[line[1]].y * (rs.R + rs.r)+ (300), _ctxStereo);
         }
    });
    _ctxStereo.stroke();

    // mix canvases

    const imgLeft = _ctxStereo2.getImageData(0, 0, _width, _height);
    
    const imgRight = _ctxStereo.getImageData(0, 0, _width, _height);
    const imgNew = _ctx.createImageData(_width, _height);

    for (let i = 0; i < imgRight.data.length; i += 4) {
        imgNew.data[i  ] = Math.min(imgLeft.data[i] + imgRight.data[i], 255);
        imgNew.data[i+1] = Math.min(imgLeft.data[i + 1] + imgRight.data[i + 1], 255);
        imgNew.data[i+2] = Math.min(imgLeft.data[i + 2] + imgRight.data[i + 2], 255);
        imgNew.data[i+3] = 255
        if(imgLeft.data[i] !== 0 || imgLeft.data[i + 1 ] !== 0 || imgLeft.data[i + 2] !== 0) {
            // console.log(imgNew.data[i], imgNew.data[i + 1], imgNew.data[ i + 2]);
        }
    }
    _ctx.putImageData(imgNew, 0, 0);
    
}