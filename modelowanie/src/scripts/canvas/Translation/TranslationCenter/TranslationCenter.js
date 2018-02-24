import { multiplyMatrices, multiplyVectorAndMatrix } from "../../../MatrixOperations/Multiply/Multiply";
import getRotationArray from "../Rotation/Rotation";
import { setShiftVector, getShiftMatrix, shiftPoint } from "../Shift/Shift";


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
export default function Translate(translationObject) {
    const {front, left, top, axisX, axisY, alphaX, alphaY, alphaZ, axisZ} = translationObject;
    let translationMatrix = lastTranslation;
    if(axisX) {
        translationMatrix = multiplyMatrices(translationMatrix, getRotationArray(1, alphaX));
    }
    if(axisY) {
        translationMatrix = multiplyMatrices(translationMatrix, getRotationArray(0, alphaY));
    }
    if(axisZ) {
        translationMatrix = multiplyMatrices(translationMatrix, getRotationArray(2, alphaZ));
    }
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
        let scaleMatrix = [
            [front, 0, 0, 0],
            [0, front, 0, 0],
            [0, 0, front, 0],
            [0, 0, 0, 1]
        ];
        translationMatrix = multiplyMatrices(translationMatrix, scaleMatrix);
    }
    shiftVector.push(0);
    setShiftVector(shiftVector);
    translationMatrix = multiplyMatrices(translationMatrix, getShiftMatrix());
    lastTranslation = translationMatrix;
    const fov = Math.PI/6;
    const f = 100;
    const e = Math.tan(fov);
    const n = 0.001;
    const a = 700 / 1000;
    const projection = [
        [e, 0, 0, 0],
        [0, e/a, 0, 0],
        [0, 0, f/(f-n), 1],
        [0, 0, -f*n/(f-n), 1]
    ];
    const help = multiplyMatrices(translationMatrix, projection);
    return generateTranslation(help);
}

function generateTranslation(translationMatrix) {
    const result = [];
    translationPoints.forEach(point => {
        result.push(generateTranslatedPoint(point, translationMatrix));
    });
    return result;
}
function generateTranslatedPoint(point, translationMatrix) {
    const pointMatrix = [point.x, point.y, point.z, 1];
    const result = multiplyVectorAndMatrix(translationMatrix, pointMatrix);
    return {
        x: result[0],
        y: result[1],
        z: result[2]
    };
}