
import Translate, { setTranslationPoints } from '../../Translation/TranslationCenter/TranslationCenter';
import { TryParseInt, getVectorLength } from '../../../Helpers/Helpers';
import Redraw from '../../Draw/Redraw';

let material = [];
let materialTransformed = [];
let materialTransformedBottom = [];
let xGrid = 4;
let yGrid = 4;
let xSize = 20;
let ySize = 20;
let zSize = 5;
let indices = []
export function generateMaterial() {
    for(let i = 0; i < xGrid; i ++) {
        materialTransformed.push([]);
        materialTransformedBottom.push([]);
        for(let j = 0; j < yGrid; j ++) {
            materialTransformed[i].push((i / xGrid ) * (xSize / 10) - (xSize / 20),  (j / yGrid)* (ySize / 10) - (ySize / 20),  zSize / 10);
            materialTransformedBottom[i].push( (i / xGrid) * (xSize / 10) - (xSize / 20),  (j / yGrid) * (ySize / 10) - (ySize / 20), 0);
        }
    }
    let i = 0;
    for(let k = 0; k < xGrid * 2; k ++) {
        for(let j = 0; j < yGrid - 1; j ++) {
            indices.push(i, i + 1);
            if(k !== xGrid - 1 && k !== xGrid * 2 - 1) {
                indices.push(i, i + yGrid);
            }
           i ++;
         }
         if(k !== xGrid - 1 && k !== xGrid * 2 - 1) {
            indices.push(i, i + yGrid);
         }
        i ++
    }
    i = 0;
    for(let k = 0; k < yGrid; k ++) {
        for(let j = 0; j < xGrid; j ++) {
            indices.push(i, i + xGrid * yGrid);
            i ++;
        }
    }
} 
export function _removeMaterial() {
    material = [];
    materialTransformed = [];
    materialTransformedBottom = [];
    indices = [];
}
export function getMaterial() {
    return {
        indices: indices,
        materialArray: material,
        materialPoints: materialTransformed,
        materialTransformedBottom: materialTransformedBottom
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