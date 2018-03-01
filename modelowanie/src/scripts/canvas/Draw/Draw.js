import { getTorusLines, getRAndr } from "../Torus/Torus";


let _r = 0;
let _g = 0;
let _b = 0;
let _a = 0;
let _ctx;
let _canvas;
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
}
export function drawPixel(x, y) {
    _ctx.fillStyle = "rgba("+_r+","+_g+","+_b+","+_a+")";
    _ctx.fillRect( parseInt(x,10), parseInt(y,10), 1, 1 );
}
export function clearCanvas() {
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
}
function drawLine(x1, y1, x2, y2) {
    _ctx.moveTo(x1, y1);
    _ctx.lineTo(x2, y2);
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