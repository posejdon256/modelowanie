const lines = [];
export function getLines() {
    return lines;
}
export function addLine(p1, p2, color) {
    const _p1 = {x: parseFloat(p1.x) / 10, y: -parseFloat(p1.y) / 10, z: parseFloat(p1.z) / 10, color: color};
    const _p2 = {x: parseFloat(p2.x) / 10, y: -parseFloat(p2.y) / 10, z: parseFloat(p2.z) / 10};
    lines.push(_p1);
    lines.push(_p2);
}