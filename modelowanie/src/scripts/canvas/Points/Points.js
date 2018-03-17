import { getCursor } from '../Cursor/Cursor';
import Redraw from '../Draw/Redraw';

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
    Redraw();
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
export function updatePoint(id, xDiff, yDiif, zDiff) {

    for(let i = 0; i < points.length; i ++ ){
        if(points[i].id === id) {
            points[i].x += xDiff;
            points[i].y += yDiif;
            points[i].z += zDiff;
            break;
        }
    }
}
export function selectPoint(id) {
    for(let i = 0; i < points.length; i ++) {
        if(points[i].id === id) {
            points[i].selected = !points[i].selected;
        } else if(points[i].selected) {
             points[i].selected = false;
        }
    }
    Redraw();
    return points;
}
export function addPoint() {
    const cursor = getCursor();
    const newPoint = {
        x: cursor.x,
        y: cursor.y,
        z: cursor.z,
        name: "Punkt " + pointNumber,
        id: pointNumber,
        selected: false
    };
    pointNumber ++;
    points.push(newPoint);

    Redraw();
}