import { getMaterial, getxSize, getySize, getNormalVector, updateNormals } from "./Material";
let indexes;
let r;
export function createBananaFirstStep(point, _r, sphere) {
    r = _r;
    indexes = [];
    const { material2D } = getMaterial();
    const xSize = getxSize();
    const ySize = getySize();
    const square = {a: 2 * r, x: point.x - r, y: point.y - r, z: point.z};
    const end = {x: point.x + r, y: point.y + r, z: point.z};
    const pointIndex = convertFromPlaceToIndex(point, material2D.length, material2D[0].length, xSize / 10, ySize / 10);
    const indexStart = convertFromPlaceToIndex(square, material2D.length, material2D[0].length, xSize / 10, ySize / 10, 1);
    const indexEnd = convertFromPlaceToIndex(end, material2D.length, material2D[0].length, xSize / 10, ySize / 10, 0);
     for(let i = indexStart.x; i <indexEnd.x; i ++) {
         for(let j = indexStart.y; j < indexEnd.y; j ++) {
             if(!material2D[i] || !material2D[i][j]) {
                 continue;
             }
             const pSearched = convertFromIndexToPlace(i, j, 
                material2D[i][j].z, material2D.length, material2D[0].length, xSize / 10, ySize / 10); 
            const len =  get2dvectorLength(point, pSearched);
             if(len <= r * 10) {
                 if(!sphere) {
                    indexes.push({x: i, y: j, z: point.z});
                 } else {
                     const diff = r * 10 - Math.sqrt(Math.pow(r * 10, 2) - Math.pow(len, 2));
                     indexes.push({x: i, y: j, z: point.z + diff});
                 }
             }
            }
        }

}
function get2dvectorLength(v1, v2) {
    return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
}
export function createBananaSecondStep(point, sphere) {
    const { material2D } = getMaterial();
    const xSize = getxSize();
    const ySize = getySize();
    let indexes2 = [];
     const square = {a: 2 * r, x: point.x - r, y: point.y - r, z: point.z};
     const end = {x: point.x + r, y: point.y + r, z: point.z};
     const pointIndex = convertFromPlaceToIndex(point, material2D.length, material2D[0].length, xSize / 10, ySize / 10);
     const indexStart = convertFromPlaceToIndex(square, material2D.length, material2D[0].length, xSize / 10, ySize / 10, 1); // TODO
     const indexEnd = convertFromPlaceToIndex(end, material2D.length, material2D[0].length, xSize / 10, ySize / 10, 0);
     for(let i = indexStart.x; i <indexEnd.x; i ++) {
         for(let j = indexStart.y; j < indexEnd.y; j ++) {
             if(!material2D[i] || !material2D[i][j]) {
                 continue;
             }
             const pSearched = convertFromIndexToPlace(i, j, 
                material2D[i][j].z, material2D.length, material2D[0].length, xSize / 10, ySize / 10);  
            const len =  get2dvectorLength(point, pSearched);
             if(len <= r * 10) {
                 if(!sphere) {
                    indexes2.push({x: i, y: j, z: point.z});
                 } else {
                    const diff = r * 10 - Math.sqrt(Math.pow(r * 10, 2) - Math.pow(len, 2));
                    indexes2.push({x: i, y: j, z: point.z + diff});
                }
             }
            }
        }
        const final = [];
        for(let i = 0; i < indexes2.length; i ++) {
            let same = false;
            for(let j = 0; j < indexes.length; j ++) {
                if(indexes2[i].x === indexes[j].x && indexes2[i].y === indexes[j].y) {
                    if(!sphere || indexes[i].z < indexes2[j].z) {
                        same = true;
                    }
                }
                if(!same && j === indexes.length - 1) {
                    final.push({x: indexes2[i].x - indexStart.x, y: indexes2[i].y - indexStart.y, z: indexes2[i].z})
                }
            }
        }
        indexes = final;
}
export function cut(x, y) {

    const {material, material2D, materialPoints} = getMaterial();
    for(let i = 0; i < indexes.length; i ++) {

        let indMaterial = material2D[x + indexes[i].x][y + indexes[i].y].indMaterial;
        let points = material2D[x + indexes[i].x][y + indexes[i].y].points;

        material[indMaterial][2] = Math.min(material[indMaterial][2], indexes[i].z);

        for(let j = 0; j < points.length; j ++) {
            materialPoints[points[j].p + 2] = Math.min(materialPoints[points[j].p + 2], indexes[i].z);
            updateNormals(points[j].p, getNormalVector(points[j].indexes[0], points[j].indexes[1], points[j].indexes[2]));
        }
    }
}
export function convertFromIndexToPlace(x, y, z, arrW, arrH, sizeX, sizeY) {
    return {
        x: (x / arrW) * (sizeX / 1) - (sizeX / 2),
        y: (y / arrH) * (sizeY / 1) - (sizeY / 2),
        z: z
    };
}
export function convertFromPlaceToIndex(point, arrW, arrH, sizeX, sizeY, floor) {
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