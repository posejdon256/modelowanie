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
    const result = [];
    for(let i = 0; i < vector.length; i ++) {
        result.push(0);
        for(let j = 0; j < matrix[i].length; j ++) {
            result[i] += vector[j] * matrix[i][j];
        }
    }
    return result;
}