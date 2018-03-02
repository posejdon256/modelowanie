
const fov = Math.PI/4;
const f =0.4;
const e = 1/Math.tan(fov);
const n = 0.1;
const a = 1;

const l = -1;
const t = 1;
const b = -1;
const r = 1;
const projectMatrix1 = [
    [e, 0, 0, 0],
    [0, e/a, 0, 0],
    [0, 0, f/(f-n), 1],
    [0, 0, -f*n/(f-n), 1]
];
const projectMatrixAnia = [
    [1, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
];
const projectMatrix2 = [
    [2 * n / (r - l), 0, (r + l) / (r - l), 0],
    [0, 2 * n / (t - b), (t + b) / (t - b), 0],
    [0, 0, - (f + n)/ (f - n), -2 * f * n/ (f - n)],
    [0, 0, -1, 1]
];

export default function getProjectionMatrix(number) {
    if(number === 1) {
        return projectMatrix1;
    } else if (number === 2) {
        return projectMatrix2;
    } else if( number === 3) {
        return projectMatrixAnia;
    }
}