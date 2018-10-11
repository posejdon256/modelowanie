import { getCuttingCurves } from "../../CuttingCurve/CuttingCurve";

let canvas1;
let canvas2;
let ob1;
let ob2;
let img;
export function setVisualisationCanvases(c1, c2) {
    canvas1 = c1;
    canvas2 = c2;
}
export function getUVImages() {
    return { 
        canvas1: canvas1,
        canvas2: canvas2
    };
}
export function setVisualisationObjects(_ob1, _ob2) {
    ob1 = _ob1;
    ob2 = _ob2;
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
        } else {
            ctx2.lineTo(curve.intersectionVisualization2[i].u, curve.intersectionVisualization2[i].v);
        }
    }
    ctx1.stroke();
    ctx2.stroke();
    trimVisualisation();
}
export function trimVisualisation() {
    let stack = [];
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    img = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    let startX = parseInt(Math.random() * 500, 10);
    let startY = parseInt(Math.random() * 500, 10);
    while (getPixelColor(canvas1, startX, startY) !== "Black") {
        startX = parseInt(Math.random() * 500, 10);
        startY = parseInt(Math.random() * 500, 10);
    }
    stack.push({canvas: canvas1, x: startX, y: startY});
    while(stack.length > 0) {
        //const problem = stack[stack.length - 1];
        recurence(stack, ob1);
    }
    ctx1.putImageData(img, 0, 0);  
    img = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    while (getPixelColor(canvas2, startX, startY) !== "Black") {
        startX = parseInt(Math.random() * 255, 10);
        startY = parseInt(Math.random() * 255, 10);
    }
    stack.push({canvas: canvas2, x: startX, y: startY});
    while(stack.length > 0) {
        //const problem = stack[stack.length - 1];
        recurence(stack, ob2);
    }
    ctx2.putImageData(img, 0, 0); 
}
function recurence(stack, ob) {
    const problem = stack[stack.length - 1];
    let {x, y, canvas} = problem;
    stack.splice(stack.length - 1, 1);
    if(x < 0) {
        if(ob.WrappedU) {
            x = 499;
        } else {
            return;
        }
    }
    if(y < 0) {
        if(ob.WrappedV) {
            y = 499;
        } else {
            return;
        }
    }
    if(x >= 500) {
        if(ob.WrappedU) {
            x = 0;
        } else {
            return;
        }
    }
    if(y >= 500) {
        if(ob.WrappedV) {
            y = 0;
        } else {
            return;
        }
    }
    if(getPixelColor(canvas, x, y) === "Red" || getPixelColor(canvas, x, y) === "White") {
        return;
    }
    colourPixelOnWhite(canvas, x, y);
    stack.push({canvas: canvas, x: x - 1, y: y});
    stack.push({canvas: canvas, x: x + 1, y: y});
    stack.push({canvas: canvas, x: x, y: y - 1});
    stack.push({canvas: canvas, x: x, y: y + 1});
}
function getPixelColor(canvas, x, y){
    const place = (parseInt((y), 10)* canvas.width * 4) + (parseInt(x, 10) * 4);
    if(img.data[place] === 0 && img.data[place + 1] === 0 && img.data[place + 2] === 0) {
        return "Black";
    } else if(img.data[place] === 255 && img.data[place + 1] === 255 && img.data[place + 2] === 255) {
        return "White";
    } else if(img.data[place] === 255 && img.data[place + 1] === 0 && img.data[place + 2] === 0) {
        return "Red";
    }
    console.log("Problem with colors");
}
function colourPixelOnWhite(canvas, x, y) {
    const place = (parseInt((y), 10)* canvas.width * 4) + (parseInt(x, 10) * 4);
    img.data[place] = 255;
    img.data[place + 1] = 255;
    img.data[place + 2] = 255;
    img.data[place + 3] = 255
}