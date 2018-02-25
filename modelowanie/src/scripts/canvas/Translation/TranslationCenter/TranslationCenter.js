import { multiplyMatrices, multiplyVectorAndMatrix } from "../../../MatrixOperations/Multiply/Multiply";
import getRotationArray, {getRotationArrayByPoint} from "../Rotation/Rotation";
import { setShiftVector, getShiftMatrix } from "../Shift/Shift";
import getProjectionMatrix from '../Projection/Projection';
import getScaleMatrix from "../Scale/Scale";


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
    //rotation
    if(axisX) {
        translationMatrix = multiplyMatrices(getRotationArray(1, alphaX), translationMatrix);
    }
    if(axisY) {
        translationMatrix = multiplyMatrices(getRotationArray(0, alphaY), translationMatrix);
    }
    if(axisZ) {
        translationMatrix = multiplyMatrices(getRotationArray(2, alphaZ), translationMatrix);
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
        shiftVector.push(1);
        translationMatrix = multiplyMatrices(getScaleMatrix(front), translationMatrix);
    }
    else
        shiftVector.push(0);
    setShiftVector(shiftVector);
    translationMatrix = multiplyMatrices(getShiftMatrix(), translationMatrix);
    lastTranslation = translationMatrix;

    //projection
    const projectioMatrix = multiplyMatrices(getProjectionMatrix(1), translationMatrix);

    return generateTranslation(projectioMatrix);
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