export function multiplyMatrices(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}
export function multiplyVectorAndMatrix(matrix, vector) {
    const result =[];
    for(let i = 0; i < vector.length; i ++) {
        result.push(0);
        for(let j = 0; j < matrix[i].length; j ++) {
            result[i] += vector[j] * matrix[i][j];
        }
    }
    return result;
}
export function multiplyVectorsScalar(v1, v2) {
    return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
}
export function getVectorLength(v) {
    return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[1], 2));
}