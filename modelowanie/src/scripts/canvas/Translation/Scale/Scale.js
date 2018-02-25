
export default function getScaleMatrix(front) {
    const scaleMatrix = [
        [front, 0, 0, 0],
        [0, front, 0, 0],
        [0, 0, front, 0],
        [0, 0, 0, 1]
    ];
    return scaleMatrix;
}