import { initWebGL } from "../OpenGL/Init/InitOpenGL";

let color = {r: 0, g: 0, b: 0, a: 0};
let _ctx;
let _ctxStereo;
let _ctxStereo2;
let _canvas;
let gl;

export function getGLCtx() {
    return gl;
}
export function getContexts() {
    return { ctx: _ctx, ctxS1: _ctxStereo, ctxS2: _ctxStereo2 };
}
export function setPixelColor(r, g, b, a) {
    color = { r: r, g: g, b: b, a: a };
}
export function getPixelColor() {
    return {r: color.r, g: color.g, b: color.g, a: color.a};
}
export function setCanvas(canvas) {
    _ctx = canvas.getContext("webgl");
    _canvas = canvas;
    gl = initWebGL(canvas);      // Initialize the GL context
  
    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
    }
   // _imagedata = _ctx.getImageData(0, 0, canvas.width, canvas.height);
}
export function getCanvas() {
    return _canvas;
}
export function setStereoscopyCanvases(canvas, canvasStero2) {
    _ctxStereo = canvas.getContext("2d");
    _ctxStereo.translate(0.5, 0.5);

    _ctxStereo2 = canvasStero2.getContext("2d");
    _ctxStereo2.translate(0.5, 0.5);
}
export function drawPixel(x, y, img, ctx, rgb) {
    const place = (parseInt((y), 10)* _canvas.width * 4) + (parseInt(x, 10) * 4);
    img.data[place] = rgb.r;
    img.data[place + 1] = rgb.g;
    img.data[place + 2] = rgb.b;
    img.data[place + 3] = 255
    return img;
   // localContext.fillRect( parseInt(x,10), parseInt(y,10), 1, 1 );
}
export function clearCanvas() {
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    _ctxStereo.clearRect(0, 0, _canvas.width, _canvas.height);
    _ctxStereo2.clearRect(0, 0, _canvas.width, _canvas.height);
}
export function drawLine(x1, y1, x2, y2, ctx) {
    let localContext = ctx ? ctx : _ctx;
    localContext.moveTo(x1, y1);
    localContext.lineTo(x2, y2);
}
export function stereoscopyDraw() {
    // mix canvases
    const imgLeft = _ctxStereo2.getImageData(0, 0, _canvas.width, _canvas.height);
    const imgRight = _ctxStereo.getImageData(0, 0, _canvas.width, _canvas.height);
    const imgNew = _ctx.createImageData(_canvas.width, _canvas.height);

    for (let i = 0; i < imgRight.data.length; i += 4) {
        imgNew.data[i  ] = Math.min(imgLeft.data[i] + imgRight.data[i], 255);
        imgNew.data[i+1] = Math.min(imgLeft.data[i + 1] + imgRight.data[i + 1], 255);
        imgNew.data[i+2] = Math.min(imgLeft.data[i + 2] + imgRight.data[i + 2], 255);
        imgNew.data[i+3] = 255
    }
    _ctx.putImageData(imgNew, 0, 0);   
}