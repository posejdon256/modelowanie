
import { TryParseInt, DiffPoints, crossMultiply, normalize } from '../../../Helpers/Helpers';
import Redraw from '../../Draw/Redraw';
import { getNormalVector } from '../HelperMill';
import { DrawMaterial } from '../../Draw/DrawMaterial/DrawMaterial';
import { clearGL } from '../../Draw/OpenGL/DrawOpengl';
import { getGLCtx } from '../../Draw/Draw';

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
            material2D[i][j].faces = [];
            material[material.length - 1].material2DIndex = {x: i, y: j};
        }
    }
    generateMaterialOnFace();
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
    for(let i = xGrid * yGrid; i < material.length - 6; i += 3) {
        updateMaterialOnIndexes([i, i + 1, i + 2]);
        pushNormals(getNormalVector(i, i + 1, i + 2));

        // updateMaterialOnIndexes([i + 3, i + 4, i + 5]);
        // pushNormals(getNormalVector(i + 3, i + 4, i + 5));
    }
    updateMaterialOnIndexes([material.length - 5, material.length - 6, material.length - 4]);
    pushNormals(getNormalVector(material.length - 5, material.length - 6, material.length - 4));
    updateMaterialOnIndexes([material.length - 3, material.length - 2, material.length - 1]);
    pushNormals(getNormalVector(material.length - 3, material.length - 2, material.length - 1));
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
        if(material[i].material2DIndex.x !== undefined && material[i].material2DIndex.y !== undefined) {
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
    const gl = getGLCtx();
    material = [];
    materialTransformed = [];
    material2D = []
    indices = [];
    normals = [];
    clearGL(gl);
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
function generateMaterialOnFace() {
    for(let i = 0; i < xGrid - 1; i ++) {
        setMaterialWith2DIndex(((i) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20),  0 - (ySize / 20),  0, i, 0);
        setMaterialWith2DIndex((i / (xGrid - 1) ) * (xSize / 10) - (xSize / 20),  0 - (ySize / 20),  zSize / 10, i, 0);
        setMaterialWith2DIndex(((i + 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20),  0 - (ySize / 20),  zSize / 10,  i + 1, 0);

        // material2D[i][0].faces.push(material.length - 2);
        // material2D[i + 1][0].faces.push(material.length - 1);

        setMaterialWith2DIndex(((i + 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20),  0 - (ySize / 20),  zSize / 10,  i + 1, 0);
        setMaterialWith2DIndex(((i + 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20),  0 - (ySize / 20),  0, i + 1, 0);
        setMaterialWith2DIndex((i / (xGrid - 1) ) * (xSize / 10) - (xSize / 20),  0 - (ySize / 20),  0, i, 0);

        //material2D[i + 1][0].faces.push(material.length - 3);

        setMaterialWith2DIndex(((i) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20),  ((yGrid - 1) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  0, i, yGrid - 1);
        setMaterialWith2DIndex((i / (xGrid - 1) ) * (xSize / 10) - (xSize / 20),  ((yGrid - 1) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  zSize / 10, i, yGrid - 1);
        setMaterialWith2DIndex(((i + 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20),  ((yGrid - 1) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  zSize / 10, i + 1, yGrid - 1);

        setMaterialWith2DIndex(((i + 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20),  ((yGrid - 1) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  zSize / 10, i +1, yGrid - 1);
        setMaterialWith2DIndex(((i + 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20),  ((yGrid - 1) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  0, i + 1, yGrid -1);
        setMaterialWith2DIndex((i / (xGrid - 1) ) * (xSize / 10) - (xSize / 20),  ((yGrid - 1) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  0, i, yGrid - 1);
    }
    for(let i = 0; i < yGrid - 1; i ++) {
        setMaterialWith2DIndex(0 - (xSize / 20), ((i) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  zSize / 10, 0, i);
        setMaterialWith2DIndex(0 - (xSize / 20), ((i + 1) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  zSize / 10, 0, i + 1);
        setMaterialWith2DIndex(0 - (xSize / 20), ((i) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  0, 0, i);

        setMaterialWith2DIndex(0 - (xSize / 20), ((i + 1) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  zSize / 10, 0, i +1);
        setMaterialWith2DIndex(0 - (xSize / 20), ((i + 1) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  0, 0, i + 1);
        setMaterialWith2DIndex(0 - (xSize / 20), ((i) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  0, 0, i);

        setMaterialWith2DIndex(((xGrid - 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20), ((i) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  zSize / 10, xGrid - 1, i);
        setMaterialWith2DIndex(((xGrid - 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20), ((i + 1) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  zSize / 10, xGrid - 1, i +1);
        setMaterialWith2DIndex(((xGrid - 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20), ((i) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  0, xGrid - 1, i);

        setMaterialWith2DIndex(((xGrid - 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20), ((i + 1) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  zSize / 10, xGrid - 1, i + 1);
        setMaterialWith2DIndex(((xGrid - 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20), ((i + 1) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  0, xGrid - 1, i + 1);
        setMaterialWith2DIndex(((xGrid - 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20), ((i) / (yGrid - 1) ) * (ySize / 10) - (ySize / 20),  0, xGrid - 1, i);

     }
    //bottom
    setMaterialWith2DIndex(0 - (xSize / 20), 0 - (ySize / 20), 0);
    setMaterialWith2DIndex(((xGrid - 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20), 0 - (ySize / 20), 0);
    setMaterialWith2DIndex(0 - (xSize / 20), ((yGrid - 1) / (yGrid - 1) )* (ySize / 10) - (ySize / 20), 0);
    setMaterialWith2DIndex(((xGrid - 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20), 0 - (ySize / 20), 0);
    setMaterialWith2DIndex(0 - (xSize / 20), ((yGrid - 1) / (yGrid - 1)) * (ySize / 10) - (ySize / 20), 0);
    setMaterialWith2DIndex(((xGrid - 1) / (xGrid - 1) ) * (xSize / 10) - (xSize / 20), ((yGrid - 1) / (yGrid - 1))* (ySize / 10) - (ySize / 20), 0);
}
function setMaterialWith2DIndex(x, y, z, i, j) {
    material.push([x, y, z]);
    material[material.length - 1].material2DIndex = {x: i, y: j};
}