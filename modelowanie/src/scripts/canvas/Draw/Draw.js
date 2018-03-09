import { getTorusLines, getRAndr } from "../Torus/Torus";
import { getABCElipsoid, getMinMaxSpecular } from "../Elipsoid/Elipsoid";


let _r = 0;
let _g = 0;
let _b = 0;
let _a = 0;
let _ctx;
let _canvas;
let _imagedata;
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
export function setCanvas(canvas) {
    _ctx = canvas.getContext("2d");
    _ctx.translate(0.5, 0.5);
    _canvas = canvas;
   // _imagedata = _ctx.getImageData(0, 0, canvas.width, canvas.height);
}
export function drawPixel(x, y, I) {
    _ctx.fillStyle = "rgba("+1*I+","+1*I+","+0*I+","+1+")";
    _ctx.fillRect( parseInt(x,10), parseInt(y,10), 1, 1 );
}
export function clearCanvas() {
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
}
function drawLine(x1, y1, x2, y2) {
    _ctx.moveTo(x1, y1);
    _ctx.lineTo(x2, y2);
}
export function DrawElipsoid(points) {
    let _imagedata = _ctx.createImageData(_canvas.width, _canvas.height);
    for(let i = 0; i < points.length; i ++) {
         const pixelIndex = ((points[i].y * _canvas.width) + points[i].x) * 4;
         _imagedata.data[pixelIndex] = parseInt(255 *points[i].specular, 10);
         _imagedata.data[pixelIndex + 1] = parseInt(255 *points[i].specular, 10);
         _imagedata.data[pixelIndex + 2] = 0;
         _imagedata.data[pixelIndex + 3] = 255;
       // drawPixel(points[i].x * max, points[i].y * max, parseInt(255 *(points[i].specular - specular.min)/(specular.max - specular.min), 10));
    }
    _ctx.putImageData(_imagedata, 0, 0);
}
export function pseudoDrawElipsoid(points, pseudo) {
    for(let i = 0; i < points.length; i ++) {
        _r = parseInt(255 * points[i].specular, 10);
        _g = parseInt(255 * points[i].specular, 10);
        _b = 0;
        _ctx.fillStyle = "rgba("+1*parseInt(_r, 10)+","+1*parseInt(_g, 10)+","+0+","+1+")";
        _ctx.fillRect(points[i].x ,points[i].y, pseudo, pseudo );
      // drawPixel(points[i].x * max, points[i].y * max, parseInt(255 *(points[i].specular - specular.min)/(specular.max - specular.min), 10));
   }
}
export function DrawTorus(points) {
   const lines = getTorusLines();
   _ctx.beginPath();
   _ctx.strokeStyle = "rgba("+_r+","+_g+","+_b+","+_a+")";
   const rs = getRAndr();
   lines.forEach(line => {
       if(line[1] < points.length && line[0] < points.length) {
            drawLine(points[line[0]].x * (rs.R + rs.r) + (500), points[line[0]].y * (rs.R + rs.r)+ (300), points[line[1]].x * (rs.R + rs.r)+ (500), points[line[1]].y * (rs.R + rs.r)+ (300));
        }
   });
   _ctx.stroke();
   _ctx.fillStyle = "rgba(255, 255, 255, 1)";
   _ctx.fillRect( 500, 300, 1, 1 );
}