let color = {r: 0, g: 0, b: 0, a: 0};
let _ctx;
let _ctxStereo;
let _ctxStereo2;
let _canvas;

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
    _ctx = canvas.getContext("2d");
    _ctx.translate(0.5, 0.5);
    _canvas = canvas;
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
export function drawPixel(x, y, img, ctx) {
    const place = (parseInt((y), 10)* _canvas.width * 4) + (parseInt(x, 10) * 4);
    img.data[place] = 255;
    img.data[place + 1] = 255;
    img.data[place + 2] = 255;
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