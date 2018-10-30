import { getMaterial, getxSize, getySize, updateNormals } from "./Material";
import { getNormalVector } from "../HelperMill";
import { getDrillSpecification } from "../../../Load/ReadMill/ReadMill";

let r;
let typeSphere = false;
let arrW, arrH;
export function settArrayWidthAndHeight(w, h) {
    arrW = w;
    arrH = h;
    typeSphere = getDrillSpecification().k;
}
function prepareStep(point, sphere) {
    const { material2D } = getMaterial();
    const square = {x: point.x - r, y: point.y - r, z: point.z};
    const end = {x: point.x + r, y: point.y + r, z: point.z};
    const indexStart = convertFromPlaceToIndex(square, 1);
    const indexEnd = convertFromPlaceToIndex(end, 0);
    const points = [];
    for(let i = indexStart.x; i <=indexEnd.x; i ++) {
        for(let j = indexStart.y; j <= indexEnd.y; j ++) {
            if(!material2D[i] || !material2D[i][j]) {
                continue;
            }
            const pSearched = convertFromIndexToPlace(i, j, material2D[i][j].z); 
            const len =  get2dvectorLength(point, pSearched);
            if(len <= r) {
                points.push(innerFunction(sphere, i, j, point, len));
            }
        }
    }
    return points;
}
function innerFunction(sphere, i, j, point, len) {
    let newPoint;
    if(!sphere) {
        newPoint = {x: i, y: j, z: point.z};
    } else {
        const diff = r - Math.sqrt(Math.pow(r, 2) - Math.pow(len, 2));
        newPoint = {x: i, y: j, z: point.z + diff};
    }
    return newPoint;
}
export function findCircle(point, _r, sphere) {
    r = _r;
    return prepareStep(point, sphere);

}
function get2dvectorLength(v1, v2) {
    return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
}
export function cut(zCentral, zCentralPrev, _points) {

    const {material, material2D, materialPoints} = getMaterial();
    for(let i = 0; i < _points.length; i ++) {

        if(!material2D[_points[i].x] || !material2D[_points[i].x][_points[i].y]) {
            continue;
        }
        let indMaterial = material2D[_points[i].x][_points[i].y].indMaterial;
        let points = material2D[_points[i].x][_points[i].y].points;

        try{
            if(material[indMaterial][2] > _points[i].z) {
                if(!typeSphere && zCentral < zCentralPrev) {
                    throw Error("Error: Cannot mill down with a flat cutter.");
                }
                material[indMaterial][2] = _points[i].z;
            }
        } catch(e) {
            alert(e);
            return false;
        }

        for(let j = 0; j < points.length; j ++) {
            materialPoints[points[j].p + 2] = Math.min(materialPoints[points[j].p + 2], _points[i].z);
            updateNormals(points[j].p, getNormalVector(points[j].indexes[0], points[j].indexes[1], points[j].indexes[2]));
        }
    }
    return true;
}
export function convertFromIndexToPlace(x, y, z) {

    const sizeX = getxSize() / 10;
    const sizeY = getySize() / 10;
    return {
        x: (x / arrW) * sizeX - (sizeX / 2),
        y: (y / arrH) * sizeY - (sizeY / 2),
        z: z
    };
}
export function convertFromPlaceToIndex(point, floor) {

    const sizeX = getxSize() / 10;
    const sizeY = getySize() / 10;

    let x = floor === 0 ? Math.ceil((point.x + (sizeX / 2)) * arrW  / sizeX) : Math.floor((point.x + (sizeX / 2)) * arrW  / sizeX);
    let y = floor === 0 ? Math.ceil((point.y + (sizeY / 2)) * arrH / sizeY) : Math.floor((point.y + (sizeY / 2)) * arrH / sizeY);
    x === floor === undefined ? parseInt((point.x + (sizeX / 2)) * arrW  / sizeX, 10) : x;
    y === floor === undefined ? parseInt((point.y + (sizeY / 2)) * arrH / sizeY, 10) : y;
    return {
        x: x,
        y: y,
        z: point.z
    };
}