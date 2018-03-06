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
let m;
let rgbArray={};

let lastTranslationMatrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
];
let temporary;
let centerMatrix;
let cameraVector = [0, 0, -1, 0];

export function setABC(_a, _b, _c, _m) {
    a = _a;
    b = _b;
    c = _c;
    m = _m;
}
export function PseudoTranslate(configurationObject, pseudo, clear) {
    Elipsoid = [];
    lastTranslationMatrix = getTranslationMatrix(configurationObject, lastTranslationMatrix);
    generateCenterMatrix();
    maxSpecular = -1000000000;
    minSpecular = 1000000000;
    const max = Math.max(a, b, c);
    if(!Object.keys(rgbArray).length === 0 || rgbArray.constructor !== Object) {
        for (let property in rgbArray) {
            if (rgbArray.hasOwnProperty(property)) {
                const cutted = property.split('_');
                const i = parseInt(cutted[0], 10);
                const j = parseInt(cutted[1], 10);
                Elipsoid.push({x: i, y: j, z: rgbArray[property].z, specular: rgbArray[property].specular});
                const z2 = getElipsoidZ((i + pseudo - 400)/max, (j - 400)/max);
                const z3 = getElipsoidZ((i - 400)/max, (j + pseudo - 400)/max);

                rgbArray[i+pseudo+'_'+j]={};
                rgbArray[i+pseudo+'_'+j].specular = preparePhongSpecular(i+pseudo, j, z2);
                rgbArray[i+pseudo+'_'+j].z = z2;

                Elipsoid.push({x: i+pseudo, y: j, z: z2, specular: rgbArray[i+pseudo+'_'+j].specular});

                rgbArray[i+'_'+j+pseudo]={};
                rgbArray[i+'_'+j+pseudo].specular = preparePhongSpecular(i, j+pseudo, z3);
                rgbArray[i+'_'+j+pseudo].z = z3;
                Elipsoid.push({x: pseudo, y: j + pseudo, z: z2, specular: rgbArray[i+'_'+j+pseudo].specular});
            }
        }
    } else {
        for(let i = 0; i + pseudo < 1000; i += pseudo) {
            for (let j = 0; j + pseudo < 700; j += pseudo) {
                const z = getElipsoidZ((i - 400)/max, (j - 400)/max);
                if(z !== undefined) {

                    rgbArray[i+'_'+j]={};
                    rgbArray[i+'_'+j].specular = preparePhongSpecular(i, j, z);
                    rgbArray[i+'_'+j].z = z;

                    const finalRgb = rgbArray[i+'_'+j].specular;
                    if(finalRgb > maxSpecular) {
                        maxSpecular = finalRgb;
                    }
                    if(minSpecular > finalRgb) {
                        minSpecular = finalRgb;
                    }
                    Elipsoid.push({x: i, y: j, z: z, specular: finalRgb});
                }
            }
        }
    }
    if(clear) 
     rgbArray = {};
    return Elipsoid;
}
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
        [1/Math.pow(a,2), 0, 0, 0],
        [0,1/Math.pow(b,2), 0, 0],
        [0, 0,1/Math.pow(c,2), 0],
        [0, 0, 0, -1]
    ];
    centerMatrix = multiplyMatrices(math.transpose(math.inv(lastTranslationMatrix)), diagonal);
    centerMatrix = multiplyMatrices(centerMatrix, math.inv(lastTranslationMatrix));
    const tm = centerMatrix;
    a1 = tm[2][2];
    b1 = tm[2][3] + tm[0][2];

    cameraZ = multiplyVectorAndMatrix(lastTranslationMatrix, cameraVector)[2];
    rgbArray = {};
}
export function generateElipsoid(){ 
    Elipsoid = [];
    generateCenterMatrix();
    maxSpecular = -1000000000;
    minSpecular = 1000000000;
    const max = Math.max(a, b, c);
    for(let i = 0; i < 1000; i ++) {
        for (let j = 0; j < 700; j ++) {
            const z = getElipsoidZ((i-400)/max, (j-400)/max);
            if(z !== undefined) {
                const rgb = preparePhongSpecular(i, j, z);
                if(rgb > maxSpecular) {
                    maxSpecular = rgb;
                }
                if(minSpecular > rgb) {
                    minSpecular = rgb;
                }
                Elipsoid.push({x: i, y: j, z: z*max, specular: rgb});
            }
        }
    }
    //lastTranslationMatrix = temporary;
    return Elipsoid;
}
export function TranslateElipsoid(configurationObject) {
    lastTranslationMatrix = getTranslationMatrix(configurationObject, lastTranslationMatrix);
    generateElipsoid();
    return Elipsoid
}
export function getABCElipsoid() {
    return {a: a, b: b, c: c};
}
function getNormalVector(x, y, z) {
    const tm = centerMatrix;
   const ret = [
        (2 * tm[0][0] * x) + (tm[0][1] * y) + (tm[0][2] * z) + tm[0][3] + (tm[1][0] * y) + (tm[2][0] * z) + tm[3][0],
        (2 * tm[1][1] * y) + (tm[0][1] * x) + (tm[1][0] * x) + (tm[1][2] * z) + tm[1][3] + (tm[2][1] * z) + tm[3][1],
        (2 * tm[2][2] * z) + (tm[0][2] * x) + (tm[1][2] * y) * (tm[2][0] * x) + (tm[2][1] * y) + tm[2][3] + tm[3][2]
    ];
    const length = getVectorLength(ret);
    return [ret[0] / length, ret[1] /length, ret[2] / length];
}
function preparePhongSpecular(x, y, z) {
    const normalVector = getNormalVector(x, y, z);
    const result = Math.pow(multiplyVectorsScalar(normalVector, cameraVector), 1);
    return result;
}
export function getMinMaxSpecular() {
    return { min: minSpecular, max: maxSpecular };
}