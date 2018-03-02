import math from 'mathjs';
import { multiplyMatrices, multiplyVectorAndMatrix, multiplyVectorsScalar, getVectorLength } from '../../MatrixOperations/Multiply/Multiply';
import {getTranslationMatrix, setTranslationPoints, generateTranslation}  from '../Translation/TranslationCenter/TranslationCenter';
import getProjectionMatrix from '../Translation/Projection/Projection';

let a = 1;
let b = 2;
let c = 3;
let Elipsoid;
let a1;
let b1;
let c1;
let cameraZ;
let minSpecular;
let maxSpecular;

let lastTranslationMatrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
];
let centerMatrix;
let cameraVector = [0, 0, -2, 1];

export function getElipsoidZ(x, y) {
    const a2 = a1;
    const b2 = b1  + (centerMatrix[2][0] + centerMatrix[2][0])*x + (centerMatrix[2][1] + centerMatrix[2][1])*y;
    const c2 = (centerMatrix[1][0] + centerMatrix[0][1])* x * y +
        (centerMatrix[3][0] + centerMatrix[0][3]) * x +
        (centerMatrix[1][3] + centerMatrix[3][1]) * y +
        centerMatrix[0][0] * Math.pow(x, 2) +
        centerMatrix[1][1] * Math.pow(y, 2)
        + centerMatrix[3][3];
    const delta = Math.pow(b2, 2) - 4 * a2 * c2;
    if(delta < 0) {
        return undefined;
    }
    const z1 = (-b2 - Math.sqrt(delta))/2*a2;
    const z2 = (-b2 + Math.sqrt(delta))/2*a2;    
    return Math.min(z1 - cameraZ, z2 - cameraZ) ? z1 : z2;
}
function generateCenterMatrix() {
    const diagonal = [
        [a, 0, 0, 0],
        [0, b, 0, 0],
        [0, 0, c, 0],
        [0, 0, 0, -1]
    ];
    centerMatrix = multiplyMatrices(math.transpose(math.inv(lastTranslationMatrix)), diagonal);
    centerMatrix = multiplyMatrices(centerMatrix, math.inv(lastTranslationMatrix));
    centerMatrix = math.inv(centerMatrix);
    const tm = centerMatrix;
    a1 = tm[2][2];
    b1 = tm[2][3] + tm[0][2];

    cameraZ = multiplyVectorAndMatrix(lastTranslationMatrix, cameraVector)[2];
}
export function generateElipsoid(_a, _b, _c){ 
    a = _a;
    b = _b;
    c = _c;
    Elipsoid = [];
    generateCenterMatrix();
    maxSpecular = -1000000000;
    minSpecular = 1000000000;
    const max = Math.max(a, b, c);
    for(let i = 0; i < 1000; i ++) {
        for (let j = 0; j < 700; j ++) {
            const z = getElipsoidZ(i - 400, j - 400);
            if(z !== undefined) {
                const rgb = preparePhongSpecular(i, j, z);
                if(rgb > maxSpecular) {
                    maxSpecular = rgb;
                }
                if(minSpecular > rgb) {
                    minSpecular = rgb;
                }
                Elipsoid.push({x: i, y: j, z: z === z, specular: rgb});
            }
        }
    }
    return Elipsoid;
}
export function TranslateElipsoid(configurationObject) {
    lastTranslationMatrix = getTranslationMatrix(configurationObject, lastTranslationMatrix);
    generateElipsoid(a, b, c);
    return Elipsoid
}
export function getABCElipsoid() {
    return {a: a, b: b, c: c};
}
function getNormalVector(x, y, z) {
    const tm = centerMatrix;
   return [
        2 * x * (tm[0][0] + tm[0][1] + tm[0][2] + tm[0][3]),
        2 * y * (tm[1][0] + tm[1][1] + tm[1][2] + tm[1][3]),
        2 * z * (tm[2][0] + tm[2][1] + tm[2][2] + tm[2][3])
    ];
}
function preparePhongSpecular(x, y, z) {
    const normalVector = getNormalVector(x, y, z);
    const v1Multiv2 = getVectorLength(normalVector)*getVectorLength(cameraVector);
    const result = Math.pow(multiplyVectorsScalar(normalVector, cameraVector), 1);
    return result;
}
export function getMinMaxSpecular() {
    return { min: minSpecular, max: maxSpecular };
}