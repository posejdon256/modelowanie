import { turnOffAllStates } from "../StatesCenter/StatesCenter";
import { selectPoint, getPoints } from "../Points/Points";
import Translate, { setTranslationPoints } from "../Translation/TranslationCenter/TranslationCenter";
import { getStereoscopy } from "../Stereoscopy/Stereoscopy";

let rectangleSelectionState = false;
let position;
export function setRectangleSelectionState(state) {
    turnOffAllStates();
    rectangleSelectionState = state;
}
export function getRectangleSelectionRectangle() {
    return rectangleSelectionState;
}
export function setStartSelectionRectangle(x, y) {
    position = {x1: x, y1: y};
}
export function selectPointsByRectangle(x, y) {
    try{
        position.x2 = x;
        position.y2 = y;
        select(position);

    } catch(e) {
        console.log('Problem in selecting rectangle.')
    }
}
function select(p) {
    const points = getPoints("on-scene");
    setTranslationPoints(points);
    let translatedPoints = Translate({});
    translatedPoints = getStereoscopy() ? translatedPoints.left : translatedPoints;
    for(let i = 0; i < points.length; i ++) {
        const px = (translatedPoints[i].x + 1) * 500;
        const py = (translatedPoints[i].y + 1) * 350;
        if(px > p.x1 && px < p.x2 && py > p.y1 && py < p.y2) {
            selectPoint(points[i].id);
        }
    }
}