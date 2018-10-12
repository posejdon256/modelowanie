import { multiplyMatrices, multiplyVectorAndMatrix } from "../../../MatrixOperations/Multiply/Multiply";
import { setShiftVector, getShiftMatrix, ShiftWithRotation, updateShift } from "../Shift/Shift";
import getProjectionMatrix from '../Projection/Projection';
import getScaleMatrix from "../Scale/Scale";
import normalizeVector from "../../../Normalization/Normalize";

let stereoscopy;
let translationPoints = [];
let _front = 1;
export function getFront() {
    return _front;
}
export function setTranslationPoints(_points) {
    translationPoints = _points;
}
let lastTranslation = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
];
export default function Translate(translationObject, type) {
    try{
    const {front, left, top, axisX, axisY, alphaX, alphaY} = translationObject;
    let translationMatrix = lastTranslation;
    //rotation
    if(axisX) {
        translationMatrix = ShiftWithRotation(translationMatrix, 1, alphaX);
    }
    if(axisY) {
        translationMatrix = ShiftWithRotation(translationMatrix, 0, alphaY);
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
        _front = _front * front;
        updateShift(front);
    }
    else
        shiftVector.push(0);
    setShiftVector(shiftVector);
    translationMatrix = multiplyMatrices(getShiftMatrix(), translationMatrix);
    if(type !== "torus")
         lastTranslation = translationMatrix;

    //projection
    if(!stereoscopy)
        return normalTranslation(translationMatrix);
    else
        return stereoscopyTranslation(translationMatrix);

    }
    catch(e) {
        console.log("Ups, coś poszło nie tak...");
        return [];
    }
}
function normalTranslation(translationMatrix) {
    const projectioMatrix = multiplyMatrices(getProjectionMatrix(3), translationMatrix);//3
    return generateTranslation(projectioMatrix);
}
function stereoscopyTranslation(translationMatrix) {
    const leftEye = multiplyMatrices(getProjectionMatrix(4), translationMatrix);
    const rightEye = multiplyMatrices(getProjectionMatrix(5), translationMatrix);

    const leftEyeResult = generateTranslation(leftEye);
    const rightEyeResult = generateTranslation(rightEye);
    return { left: leftEyeResult, right: rightEyeResult };
}
export function setStereoscopyTranslation(_stereoscopy) {
    stereoscopy = _stereoscopy;
}
function generateTranslation(translationMatrix) {
    const result = [];
    translationPoints.forEach(point => {
        //if(point.z > -0.5)
        const _ret = generateTranslatedPoint(point, translationMatrix);
        result.push(_ret.x, _ret.y, _ret.z);
    });
    return result;
}
function generateTranslatedPoint(point, translationMatrix) {
    const pointMatrix = [point.x, point.y, point.z, 1];
    const result = normalizeVector(multiplyVectorAndMatrix(translationMatrix, pointMatrix));
   //console.log(result[2]);
    return {
        x: result[0],
        y: result[1],
        z: result[2]
    };
}