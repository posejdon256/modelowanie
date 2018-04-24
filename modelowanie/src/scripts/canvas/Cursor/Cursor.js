import Redraw from "../Draw/Redraw";

const cursor = {
    x: 0,
    y: 0,
    z: 0,
    screenX: 500,
    screenY: 350
};
export function getCursor() {
    return cursor;
}
export function updateCursor(xDiff, yDiif, zDiff) {
    cursor.x += xDiff;
    cursor.y += yDiif;
    cursor.z += zDiff;
}
export function setScreenPlace(x, y) {
    cursor.screenX = x;
    cursor.screenY = y;
}
export function setCursor(xDiff, yDiif, zDiff, redraw) {
    cursor.x = xDiff;
    cursor.y = yDiif;
    cursor.z = zDiff;
    if(redraw) {
        Redraw();
    }
}