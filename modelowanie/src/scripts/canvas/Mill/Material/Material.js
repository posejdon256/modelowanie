
import Translate, { setTranslationPoints } from '../../Translation/TranslationCenter/TranslationCenter';
import { TryParseInt, getVectorLength, DiffPoints, crossMultiply, DividePoint, normalize } from '../../../Helpers/Helpers';
import Redraw from '../../Draw/Redraw';

let material = [];
let materialTransformed = [];
let xGrid = 4;
let yGrid = 4;
let xSize = 20;
let ySize = 20;
let zSize = 5;
let indices = []
let normals = [];
export function generateMaterial() {
    for(let i = 0; i < xGrid; i ++) {
        for(let j = 0; j < yGrid; j ++) {
            material.push([(i / xGrid ) * (xSize / 10) - (xSize / 20),  (j / yGrid)* (ySize / 10) - (ySize / 20),  zSize / 10]);
        }
    }
    for(let i = 0; i < xGrid; i ++) {
        for(let j = 0; j < yGrid; j ++) {
            material.push([ (i / xGrid) * (xSize / 10) - (xSize / 20),  (j / yGrid) * (ySize / 10) - (ySize / 20), 0]);
        }
    }
    let i = 0;
    for(let k = 0; k < xGrid * 2; k ++) {
        for(let j = 0; j < yGrid - 1; j ++) {
           // indices.push(i, i + 1);
            if(k !== xGrid - 1 && k !== xGrid * 2 - 1) {
                materialTransformed.push(material[i][0], material[i][1], material[i][2]);
                materialTransformed.push(material[i + 1][0], material[i + 1][1], material[i + 1][2]);
                materialTransformed.push(material[i + yGrid][0], material[i + yGrid][1], material[i + yGrid][2]);
                getNormalVector(i, i + 1, i + yGrid);
                materialTransformed.push(material[i + 1][0], material[i + 1][1], material[i + 1][2]);
                materialTransformed.push(material[i +yGrid][0], material[i + yGrid][1], material[i + yGrid][2]);
                materialTransformed.push(material[i + 1 + yGrid][0], material[i + 1 + yGrid][1], material[i + 1 + yGrid][2]);
                getNormalVector(i + 1, i + yGrid, i + 1 + yGrid);
            }
           i ++;
         }
         if(k !== xGrid - 1 && k !== xGrid * 2 - 1) {
           // indices.push(i, i + yGrid);
         }
        i ++
    }
    i = 0;
    for(let k = 0; k < xGrid; k ++) {
        for(let j = 0; j < yGrid; j ++) {
            if(k !== xGrid - 1) {

              materialTransformed.push(material[i][0], material[i][1], material[i][2]);
              materialTransformed.push(material[i + xGrid * yGrid][0], material[i + xGrid * yGrid][1], material[i + xGrid * yGrid][2]);
              materialTransformed.push(material[i + yGrid + xGrid * yGrid][0], material[i + yGrid + xGrid*yGrid][1], material[i + yGrid + xGrid * yGrid][2]);
              getNormalVector(i, i + xGrid * yGrid, i + yGrid + xGrid * yGrid);

              getNormalVector(i, i + xGrid * yGrid + yGrid, i + yGrid);
              materialTransformed.push(material[i][0], material[i][1], material[i][2]);
              materialTransformed.push(material[i + yGrid + xGrid * yGrid][0], material[i + yGrid + xGrid*yGrid][1], material[i + yGrid + xGrid * yGrid][2]);
              materialTransformed.push(material[i + yGrid][0], material[i + yGrid][1], material[i + yGrid][2]);
            }
            if(j !== yGrid - 1) {
   
                materialTransformed.push(material[i][0], material[i][1], material[i][2]);
                materialTransformed.push(material[i + 1][0], material[i + 1][1], material[i + 1][2]);
                materialTransformed.push(material[i + 1 + xGrid * yGrid][0], material[i + 1 + xGrid*yGrid][1], material[i + 1+ xGrid * yGrid][2]);
                getNormalVector(i, i + 1, i + 1 + xGrid * yGrid);

                materialTransformed.push(material[i + xGrid * yGrid][0], material[i + xGrid*yGrid][1], material[i + xGrid * yGrid][2]);
                materialTransformed.push(material[i + 1 + xGrid * yGrid][0], material[i + 1 + xGrid*yGrid][1], material[i + 1 + xGrid * yGrid][2]);
                materialTransformed.push(material[i][0], material[i][1], material[i][2]);

                getNormalVector(i + xGrid * yGrid, i + 1 + xGrid * yGrid, i);
            }
            i ++;
        }
    }
    let ind = 0;
    for(let i = 0; i < materialTransformed.length; i += 3) {
        indices.push(ind);
        ind ++;
    }
} 
function getNormalVector(a, b, c) {
    let vec = crossMultiply(DiffPoints(material[a], material[b]), DiffPoints(material[c], material[b]));
    const norm = normalize(vec);
    normals = normals.concat(norm);
    normals = normals.concat(norm);
    normals = normals.concat(norm);
}
export function _removeMaterial() {
    material = [];
    materialTransformed = [];
    indices = [];
    normals = [];
}
export function getMaterial() {
    return {
        indices: indices,
        materialArray: material,
        materialPoints: materialTransformed,
        normals: normals
    };
}
export function _setXGrid(x) {
    xGrid = TryParseInt(x, xGrid);
}
export function _setYGrid(y) {
    yGrid = TryParseInt(y, yGrid);
}
export function _setXSize(x) {
    xSize = TryParseInt(x, xSize);
}
export function _setYSize(y) {
    ySize = TryParseInt(y, ySize);
}
export function _setZSize(z) {
    zSize = TryParseInt(z, zSize);
}
export function cutCircle(point, r, type) {
    const square = {a: 2 * r, x: point.x - r, y: point.y - r, z: point.z};
    const end = {x: point.x + r, y: point.y + r, z: point.z};
    const indexStart = convertFromPlaceToIndex(square, materialTransformed.length, materialTransformed[0].length, xSize / 10, ySize / 10); // TODO
    const indexEnd = convertFromPlaceToIndex(end, materialTransformed.length, materialTransformed[0].length, xSize / 10, ySize / 10);
    for(let i = indexStart.x; i <indexEnd.x; i ++) {
        for(let j = indexStart.y; j < indexEnd.y; j ++) {
            if(!materialTransformed[i] || !materialTransformed[i][j]) {
                continue;
            }
            const pSearched = convertFromIndexToPlace(i, j, 
                 materialTransformed[i][j].z, materialTransformed.length, materialTransformed[0].length, xSize / 10, ySize / 10);  
                 console.log(pSearched);
            if(get2dvectorLength(point, pSearched) < r * 10) {
                if(type === 0) {
                    materialTransformed[i][j].z = materialTransformed[i][j].z - (Math.max(0, materialTransformed[i][j].z - point.z));
                } else {
                    materialTransformed[i][j].z = materialTransformed[i][j].z - 
                    Math.sqrt(r*10*r -  Math.pow(Math.sqrt(Math.pow(point.x - materialTransformed[i][j].x, 2) + Math.pow(point.y - materialTransformed[i][j].y, 2)),2));
                }
            }
        }
    }
}
function convertFromPlaceToIndex(point, arrW, arrH, sizeX, sizeY) {
    return {
        x: parseInt((point.x + (sizeX / 2)) * arrW  / sizeX, 10),
        y: parseInt((point.y + (sizeY / 2)) * arrH / sizeY, 10)
    };
}
function get2dvectorLength(v1, v2) {
    return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
}
function convertFromIndexToPlace(x, y, z, arrW, arrH, sizeX, sizeY) {
    return {
        x: (x / arrW) * (sizeX / 1) - (sizeX / 2),
        y: (y / arrH) * (sizeY / 1) - (sizeY / 2),
        z: z
    };
}