import {multiplyVectorAndMatrix} from '../../../MatrixOperations/Multiply/Multiply';
let _wsMatrix;

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