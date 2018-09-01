import { findObjectToIntersectionAndIntersection, getIntersectionSelectedObjects } from "./FindIntersection";
import { RedrawVisualization, getUVImages } from "../Draw/RedrawVisualisation/RedrawVisualization";
import Redraw from "../Draw/Redraw";

export function trimIsMet(u, v, ops) {
    let isMet = true;
    const { canvas, op, img } = ops;

    const y = parseInt(u * 250, 10);
    const x = parseInt(v * 250, 10);

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
    return isMet;
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
    alert('Done!');
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