import { getCursor } from '../Cursor/Cursor';

const points = [];
let pointNumber = 1;

export function getPoints(){
    return points;
}
export function removePoint(id) {
    for(let i = 0; i < points.length; i ++) {
        if(points[i].id === id) {
            points.splice(i, 1);
            break;
        }
    }
    return points;
}
export function updatePointName(id, newName) {
    for(let i = 0; i < points.length; i ++) {
        if(points[i].id === id) {
            points[i].name = newName;
            break;
        }
    }
    return points;
}
export function addPoint() {
    const cursor = getCursor();
    const newPoint = {
        x: cursor.x,
        y: cursor.y,
        z: cursor.z,
        name: "Punkt " + pointNumber,
        id: pointNumber
    };
    pointNumber ++;
    points.push(newPoint);
}