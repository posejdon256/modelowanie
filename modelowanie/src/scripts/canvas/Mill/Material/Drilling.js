import { getMaterial, getxSize, getySize, updateNormals } from "./Material";
import { getNormalVector } from "../HelperMill";
let indexes;
let indexes2;
let r;
let final = [];
let arrW, arrH;
export function settArrayWidthAndHeight(w, h) {
    arrW = w;
    arrH = h;
}
function prepareStep(point, step, sphere) {
    final = [];
    const { material2D } = getMaterial();
    const eps = 0.01;
    const square = {x: point.x - (r + eps), y: point.y - (r + eps), z: point.z};
    const end = {x: point.x + (r + eps), y: point.y + (r + eps), z: point.z};
    const indexStart = convertFromPlaceToIndex(square, 1);
    const indexEnd = convertFromPlaceToIndex(end, 0);
    for(let i = indexStart.x; i <=indexEnd.x; i ++) {
        for(let j = indexStart.y; j <= indexEnd.y; j ++) {
            if(!material2D[i] || !material2D[i][j]) {
                continue;
            }
            const pSearched = convertFromIndexToPlace(i, j, material2D[i][j].z); 
            const len =  get2dvectorLength(point, pSearched);
            if(len <= r) {
                innerFunction(step, sphere, i, j, point, len);
            }
        }
    }
}
function innerFunction(step, sphere, i, j, point, len) {
    const indexPoint = convertFromPlaceToIndex(point);
    if(step === 1) {
        if(!sphere) {
            indexes.push({x: i, y: j, z: point.z});
            final.push({x: i - indexPoint.x, y: j - indexPoint.y, z: point.z});
         } else {
             const diff = r - Math.sqrt(Math.pow(r, 2) - Math.pow(len, 2));
             indexes.push({x: i, y: j, z: point.z + diff});
             final.push({x: i - indexPoint.x, y: j - indexPoint.y, z: point.z + diff});
         }
    } else {
        if(!sphere) {
            indexes2.push({x: i, y: j, z: point.z});
        } else {
            const diff = r - Math.sqrt(Math.pow(r, 2) - Math.pow(len, 2));
            indexes2.push({x: i, y: j, z: point.z + diff});
        }
    }

}
export function createBananaFirstStep(point, _r, sphere) {
    r = _r;
    indexes = [];
    prepareStep(point, 1, sphere);

}
// export function createBananaSecondStep(point, sphere) {
//     indexes2 = [];
//     const indexPoint = convertFromPlaceToIndex(point);
//     for(let i = 0; i < indexes2.length; i ++) {
//         let same = false;
//         for(let j = 0; j < indexes.length; j ++) {
//             if(indexes2[i].x === indexes[j].x && indexes2[i].y === indexes[j].y) {
//                 if(!sphere || indexes[j].z < indexes2[i].z) {
//                     //same = true;
//                 }
//             }
//             if(!same && j === indexes.length - 1) {
//                 final.push({x: indexes2[i].x - indexPoint.x, y: indexes2[i].y - indexPoint.y, z: indexes2[i].z})
//             }
//         }
//     }
// }
function get2dvectorLength(v1, v2) {
    return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
}
export function cut(x, y) {

    const {material, material2D, materialPoints} = getMaterial();
    for(let i = 0; i < final.length; i ++) {

        if(!material2D[x + final[i].x] || !material2D[x + final[i].x][y + final[i].y]) {
            continue;
        }
        let indMaterial = material2D[x + final[i].x][y + final[i].y].indMaterial;
        let points = material2D[x + final[i].x][y + final[i].y].points;

        material[indMaterial][2] = Math.min(material[indMaterial][2], final[i].z);

        for(let j = 0; j < points.length; j ++) {
            materialPoints[points[j].p + 2] = Math.min(materialPoints[points[j].p + 2], final[i].z);
            updateNormals(points[j].p, getNormalVector(points[j].indexes[0], points[j].indexes[1], points[j].indexes[2]));
        }
    }
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
        x: Math.min(Math.max(x, 0), arrW - 1),
        y: Math.min(Math.max(y, 0), arrH - 1),
        z: point.z
    };
}