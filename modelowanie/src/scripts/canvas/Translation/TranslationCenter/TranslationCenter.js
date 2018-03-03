import { multiplyMatrices, multiplyVectorAndMatrix } from "../../../MatrixOperations/Multiply/Multiply";
import getRotationArray, {getRotationArrayByPoint} from "../Rotation/Rotation";
import { setShiftVector, getShiftMatrix, ShiftWithRotation, updateShift } from "../Shift/Shift";
import getProjectionMatrix from '../Projection/Projection';
import getScaleMatrix from "../Scale/Scale";
import math from 'mathjs';
import normalizeVector from "../../../Normalization/Normalize";


let translationPoints = [];
export function setTranslationPoints(_points) {
    translationPoints = _points;
}
let lastTranslation = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
];
export function getTranslationMatrix(translationObject, lastTranslation) {
    const {front, left, top, axisX, axisY, alphaX, alphaY, alphaZ, axisZ} = translationObject;
    let translationMatrix = lastTranslation;
    //rotation
    if(axisX) {
        translationMatrix = ShiftWithRotation(translationMatrix, 1, alphaX);
    }
    if(axisY) {
        translationMatrix = ShiftWithRotation(translationMatrix, 0, alphaY);
    }
    if(axisZ) {
        translationMatrix = ShiftWithRotation(translationMatrix, 2, alphaZ);
    }
    //shift
    const shiftVector = [];
    if(left !== undefined && left !== 0) {
        shiftVector.push(left);
    } else {
        shiftVector.push(0);
    }
    if(top !== undefined && top !== 0) {
        shiftVector.push(top);
    } else  {
        shiftVector.push(0);
    }
    if(front !== undefined && front !== 0) {
        shiftVector.push(0);
        translationMatrix = multiplyMatrices(getScaleMatrix(front), translationMatrix);
        updateShift(front);
    }
    else
        shiftVector.push(0);
    setShiftVector(shiftVector);
    translationMatrix = multiplyMatrices(getShiftMatrix(), translationMatrix);
    return translationMatrix;
}
export function generateTranslation(translationMatrix) {
    const result = [];
    translationPoints.forEach(point => {
        if(point.z !== undefined)
            result.push(generateTranslatedPoint(point, translationMatrix));
    });
    return result;
}
function generateTranslatedPoint(point, translationMatrix) {
    const pointMatrix = [point.x, point.y, point.z, 1];
    const result = normalizeVector(multiplyVectorAndMatrix(translationMatrix, pointMatrix));
    return {
        x: result[0],
        y: result[1],
        z: result[2]
    };
}