import { findObjectToIntersectionAndIntersection, getIntersectionSelectedObjects } from "./FindIntersection";
import { RedrawVisualization, getUVImages } from "../Draw/RedrawVisualisation/RedrawVisualization";

export function trim(op1, op2) {
    if(findObjectToIntersectionAndIntersection()){
        RedrawVisualization();
    }
    const { img1, img2 } = getUVImages();
    if(isTrimmed(img1)) {
        setOptions(img1, op1, 0);
    }
    if(isTrimmed(img2)) {
        setOptions(img2, op2, 1);
    }
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
        img: img,
        op: op
    }
}