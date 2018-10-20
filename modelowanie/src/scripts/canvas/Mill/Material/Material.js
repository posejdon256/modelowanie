
import { TryParseInt, DiffPoints, crossMultiply, normalize } from '../../../Helpers/Helpers';

let material = [];
let materialTransformed = [];
let material2D = [];
let xGrid = 4;
let yGrid = 4;
let xSize = 20;
let ySize = 20;
let zSize = 5;
let indices = []
let normals = [];
export function generateMaterial() {
    for(let i = 0; i < xGrid; i ++) {
        material2D.push([]);
        for(let j = 0; j < yGrid; j ++) {
            material.push([(i / xGrid ) * (xSize / 10) - (xSize / 20),  (j / yGrid)* (ySize / 10) - (ySize / 20),  zSize / 10]);
            material2D[i].push({indMaterial: material.length - 1});
            material2D[i][j].points = [];
            material[material.length - 1].material2DIndex = {x: i, y: j};
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
                updateMaterialOnIndexes([i, i + 1, i + yGrid]);
                pushNormals(getNormalVector(i, i + 1, i + yGrid));
                
                updateMaterialOnIndexes([i + 1, i + yGrid, i + 1 + yGrid]);
                pushNormals(getNormalVector(i + 1, i + yGrid, i + 1 + yGrid));
            }
           i ++;
         }
        i ++
    }
    i = 0;
    for(let k = 0; k < xGrid; k ++) {
        for(let j = 0; j < yGrid; j ++) {
            if(k !== xGrid - 1) {
              pushNormals(getNormalVector(i, i + xGrid * yGrid, i + yGrid + xGrid * yGrid));
              updateMaterialOnIndexes([i, i + xGrid * yGrid, i + yGrid + xGrid * yGrid]);

              pushNormals(getNormalVector(i, i + xGrid * yGrid + yGrid, i + yGrid));
              updateMaterialOnIndexes([i, i + xGrid * yGrid + yGrid, i + yGrid]);
             }
            if(j !== yGrid - 1) {
                updateMaterialOnIndexes([i, i + 1, i + 1 + xGrid * yGrid]);
                pushNormals(getNormalVector(i, i + 1, i + 1 + xGrid * yGrid));

                updateMaterialOnIndexes([i + xGrid * yGrid, i + 1 + xGrid * yGrid, i]);
                pushNormals(getNormalVector(i + xGrid * yGrid, i + 1 + xGrid * yGrid, i));
            }
            i ++;
        }
    }
    let ind = 0;
    for(let i = 0; i < materialTransformed.length; i += 3) {
        if(ind === 60000) {
            ind = 0;
        }
        indices.push(ind);
        ind ++;
    }
} 
function updateMaterialOnIndexes(indexes) {
    indexes.forEach(i => {
        materialTransformed.push(material[i][0], material[i][1], material[i][2]);
        if(i < xGrid * yGrid) {
            material2D[material[i].material2DIndex.x][material[i].material2DIndex.y].points.push({p: materialTransformed.length - 3, indexes: indexes});
            
        }
    });
}
export function getNormalVector(a, b, c) {
    let vec = crossMultiply(DiffPoints(material[a], material[b]), DiffPoints(material[c], material[b]));
    return normalize(vec);
}
function pushNormals(norm) {
    normals.push(norm[0], norm[1], norm[2],norm[0], norm[1], norm[2], norm[0], norm[1], norm[2]);
}
export function updateNormals(i, norm) {
    for(let j = 0; j < 9; j ++) {
        normals[i + j] = norm[j] % 3;
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