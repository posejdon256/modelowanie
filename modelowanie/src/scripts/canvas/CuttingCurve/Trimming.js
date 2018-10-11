import { findObjectToIntersectionAndIntersection, getIntersectionSelectedObjects } from "./FindIntersection";
import { RedrawVisualization, getUVImages } from "../Draw/RedrawVisualisation/RedrawVisualization";
import Redraw from "../Draw/Redraw";

export function trimIsMet(u, v, ops) {
    let isMet = true;
    const { canvas, op, img } = ops;

    let y = parseInt(u * 500, 10);
    let x = parseInt(v * 500, 10);
    y = y === 500 ? 499: y;
    x = x === 500 ? 499 : x;

    const place = (parseInt((y), 10)* canvas.width * 4) + (parseInt(x, 10) * 4);

    if(op === "left") {
        if(img.data[place] === 255 && img.data[place] === 255 && img.data[place] === 255) {
            isMet = false;
        }
    }
    if(op === "right") {
        if(img.data[place] === 0 && img.data[place] === 0 && img.data[place] === 0) {
            isMet = false;
        }
    }
    if(op === "all") {
        isMet = true;
    }
    return isMet;
}
export function findTorusBoundryToTrim(u1, v1, u2, v2, ops) {
    const division = 100;
    const diff1 = Math.abs(u2 - u1) < 0.5 ? (u2 - u1) / division : (1 - u1 - u2) / division;
    const diff2 = Math.abs(v2 - v1) < 0.5 ? (v2 - v1) / division : (1 - v1 - v2) / division;
    let loopU = u1;
    let loopV = v1;
    let loopPrevU = u1;
    let loopPrevV = v1;
    const { canvas, op, img } = ops;
    for(let i = 0; i < division; i ++) {
        loopU += diff1;
        loopV += diff2;
        if(loopV < 0) {
            loopU = 0.99999;
        }
        if(loopU > 1) {
            loopU = 0;
        }

        let y = parseInt(loopU * 500, 10);
        let x = parseInt(loopV * 500, 10);
        y = y === 500 ? 499 : y;
        x = x === 500 ? 499 : x;
        if(Math.abs(u2 - u1) > 0.5 || Math.abs(v2 - v1) > 0.5) {
            console.log(x, y);
        }
        const place1 = (parseInt((y), 10)* canvas.width * 4) + (parseInt(x, 10) * 4);

        y = parseInt(loopPrevU * 500, 10);
        x = parseInt(loopPrevV * 500, 10);
        y = y === 500 ? 499 : y;
        x = x === 500 ? 499 : x;
        if(Math.abs(u2 - u1) > 0.5 || Math.abs(v2 - v1) > 0.5) {
            console.log(parseInt(v2 * 500, 10), parseInt(u2 * 500, 10));
        }

        if(op === "left") {
            if((img.data[place1] === 255 && img.data[place1] === 255 && img.data[place1] === 255)
            || (img.data[place1] === 255 && img.data[place1] === 0 && img.data[place1] === 0)) {
                break;
            }
        }
        if(op === "right") {
            if((img.data[place1] === 0 && img.data[place1] === 0 && img.data[place1] === 0)
            || (img.data[place1] === 255 && img.data[place1] === 0 && img.data[place1] === 0)) {
                break;
            }
        }
        if(op === "all") {
            return {u: u2, v: v2};
        }
        loopPrevU = loopU;
        loopPrevV = loopV;
    }
    if(parseInt(500 * loopPrevU  - 500 * u1, 10) > 200 || parseInt(500 * loopPrevV - 500 * v2, 10) > 200) {
        console.log(u1, u2, v1, v2);
    }
    const ret = {u: loopPrevU, v: loopPrevV};
    return ret;

}
export function trim(op1, op2) {
    if(findObjectToIntersectionAndIntersection()){
        RedrawVisualization();
    }
    const { canvas1, canvas2 } = getUVImages();

    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');

    const img1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    const img2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);

    if(isTrimmed(img1)) {
        setOptions(canvas1, op1, 0);
    }
    if(isTrimmed(img2)) {
        setOptions(canvas2, op2, 1);
    }
    Redraw();
}
function isTrimmed(img) {
    for(let i = 0; i < img.data.length; i += 4) {
        if(img.data[i] === 0 && img.data[i + 1] === 0 && img.data[i + 2] === 0) {
            return true;
        }
    }
    return false;
}
function setOptions(img, op, num) {
    const selectedObjects = getIntersectionSelectedObjects();
    if(selectedObjects.length !== 2) {
        alert("Wrong number of selected objects");
        return;
    }
    selectedObjects[num].trim = true;
    selectedObjects[num].trimOptions = {
        canvas: img,
        op: op
    }
}