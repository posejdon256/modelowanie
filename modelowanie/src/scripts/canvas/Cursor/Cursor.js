const cursor = {
    x: 0,
    y: 0,
    z: 0
};
export function getCursor() {
    return cursor;
}
export function updateCursor(xDiff, yDiif, zDiff) {
    cursor.x += xDiff;
    cursor.y += yDiif;
    cursor.z += zDiff;
}