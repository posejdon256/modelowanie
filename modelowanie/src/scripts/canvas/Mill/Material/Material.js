
import { TryParseInt, DiffPoints, crossMultiply, normalize } from '../../../Helpers/Helpers';
import Redraw from '../../Draw/Redraw';
import { getNormalVector } from '../HelperMill';

let material = [];
let materialTransformed = [];
let material2D = [];
let xGrid = 100;
let yGrid = 100;
let xSize = 15;
let ySize = 15;
let zSize = 5;
let indices = []
let normals = [];
export function generateMaterial() {
    for(let i = 0; i < xGrid; i ++) {
        material2D.push([]);
        for(let j = 0; j < yGrid; j ++) {
            material.push([(i / (xGrid - 1) ) * (xSize / 10) - (xSize / 20),  (j / (yGrid - 1))* (ySize / 10) - (ySize / 20),  zSize / 10]);
            material2D[i].push({indMaterial: material.length - 1});
            material2D[i][j].points = [];
            material[material.length - 1].material2DIndex = {x: i, y: j};
        }
    }
    let i = 0;
    for(let k = 0; k < xGrid; k ++) {
        for(let j = 0; j < yGrid - 1; j ++) {
           // indices.push(i, i + 1);
            if(k !== xGrid - 1 && k !== xGrid * 2 - 1) {
                updateMaterialOnIndexes([i, i + 1, i + yGrid]);
                pushNormals(getNormalVector(i, i + 1, i + yGrid));
                
                updateMaterialOnIndexes([i + yGrid,i + 1,  i + 1 + yGrid]);
                pushNormals(getNormalVector(i + yGrid,i + 1,  i + 1 + yGrid));
            }
           i ++;
         }
        i ++
    }
    let ind = 0;
    for(let i = 0; i < materialTransformed.length; i += 3) {
        // if(ind === 60000) {
        //     ind = 0;
        // }
        indices.push(ind);
        ind ++;
    }
    Redraw();
    Redraw();
} 
function updateMaterialOnIndexes(indexes) {
    indexes.forEach(i => {
        materialTransformed.push(material[i][0], material[i][1], material[i][2]);
        if(i < xGrid * yGrid) {
            material2D[material[i].material2DIndex.x][material[i].material2DIndex.y].points.push({p: materialTransformed.length - 3, indexes: indexes});
            
        }
    });
}
function pushNormals(norm) {
    normals.push(norm[0], norm[1], norm[2],norm[0], norm[1], norm[2], norm[0], norm[1], norm[2]);
}
export function updateNormals(i, norm) {
    for(let j = 0; j < 9; j ++) {
        normals[i + j] = norm[j % 3];
    }
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
        material: material,
        materialPoints: materialTransformed,
        material2D: material2D,
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
export function getxSize() {
    return xSize;
}
export function getySize() {
    return ySize;
}