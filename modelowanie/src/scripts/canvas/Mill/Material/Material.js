
import Translate, { setTranslationPoints } from '../../Translation/TranslationCenter/TranslationCenter';
import { TryParseInt } from '../../../Helpers/Helpers';
import Redraw from '../../Draw/Redraw';

let material = [];
let materialTransformed = [];
let materialTransformedBottom = [];
let xGrid = 4;
let yGrid = 4;
let height = 1;
let indices = []
export function generateMaterial() {
    for(let i = 0; i < xGrid; i ++) {
        material.push([]);
        for(let j = 0; j < yGrid; j ++) {
            material[i].push(height);
            materialTransformed.push({x: i / xGrid, y: j / yGrid, z: 0.2});
            materialTransformedBottom.push({x: i / xGrid, y: j / yGrid, z: 0});
        }
    }
    let i = 0;
    let m = 0;
    for(let k = 0; k < xGrid * 2; k ++) {
        // if(i >= xGrid * yGrid) {
        //     //i += xGrid;
        //     i += yGrid;
        //     continue;
        // }
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
    Redraw();
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