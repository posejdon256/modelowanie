
function getXMatrix(alpha) {
    return [
        [1, 0, 0, 0],
        [0, Math.cos(alpha), -Math.sin(alpha), 0],
        [0, Math.sin(alpha), Math.cos(alpha), 0],
        [0, 0, 0, 1]
    ];
}
function getYMatrix(alpha) {
    return [
        [Math.cos(alpha), 0, Math.sin(alpha), 0],
        [0, 1, 0, 0],
        [-Math.sin(alpha), 0, Math.cos(alpha), 0],
        [0, 0, 0, 1]
    ];
}
function getZMatrix(alpha) {
    return [
        [Math.cos(alpha), -Math.sin(alpha), 0, 0],
        [Math.sin(alpha), Math.cos(alpha), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

/**
 * Zwraca tablicę do rotacji
 * @param {int} axis - 0, 1, lub 2 odpowiednio - X, Y, Z
 * @param {int} alpha - kąt obrotu
 */
export default function getRotationArray(axis, alpha) {
    if(axis === 0) {
        return getXMatrix(alpha);
    } else if(axis === 1) {
       return getYMatrix(alpha);
    } else {
       return getZMatrix(alpha);
    }
}