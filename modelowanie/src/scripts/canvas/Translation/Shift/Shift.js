import {multiplyVectorAndMatrix, multiplyMatrices} from '../../../MatrixOperations/Multiply/Multiply';
import getRotationArray from '../Rotation/Rotation';
let _wsMatrix;
const sumShift = [0, 0, 0];

export default function shiftPointsArrayByVector(pointsArray) {
    const result = [];
    pointsArray.forEach(point => {
        const shiftedPoint = shiftPoint(point);
        result.push({
            x: shiftedPoint[0],
            y: shiftedPoint[1],
            z: shiftedPoint[2]}
        );
    });
    return result;
}
export function setShiftVector(tVector) {
    if(tVector.length !== 3) {
        throw new Error('Translation vector lenght has to be 3');
    }
    sumShift[0] += tVector[0];
    sumShift[1] += tVector[1];
    sumShift[2] += tVector[2];

    _wsMatrix = [
        [1, 0, 0, tVector[0]],
        [0, 1, 0, tVector[1]],
        [0, 0, 1, tVector[2]],
        [0, 0, 0, 1]
    ];
}
export function getShiftMatrix() {
    return _wsMatrix;
}
export function shiftPoint(point) {
    const pointMatrix = [point.x, point.y, point.z, 1];
    return multiplyVectorAndMatrix(_wsMatrix, pointMatrix);
}
export function ShiftWithRotation(translationMatrix, axis, alpha) {
    let rotationArray = getRotationArray(axis, alpha);
    const left = [
        [1, 0, 0, sumShift[0]],
        [0, 1, 0, sumShift[1]],
        [0, 0, 1, sumShift[2]],
        [0, 0, 0, 1]
    ];
    const right = [
        [1, 0, 0, -sumShift[0]],
        [0, 1, 0, -sumShift[1]],
        [0, 0, 1, -sumShift[2]],
        [0, 0, 0, 1]
    ];
    rotationArray = multiplyMatrices(left, rotationArray);
    rotationArray = multiplyMatrices(rotationArray, right);
    return multiplyMatrices(rotationArray, translationMatrix);
}