
let TorusVertices = [];
let TorusLines = [];
let _r = 0;
let _R = 0;
let _gridX = 0.3;
let _gridY = 0.3;
/**
 * Tworzy tablice z wierzchołkami torusa
 */
function setTorusParameters(r, R, gridX, gridY) {
    _r = r;
    _R = R;
    _gridX = gridX;
    _gridY = gridY;
}
export default function generateTorus(r, R, gridX, gridY) {
    if(TorusVertices.length !== 0 && gridX === _gridX && gridY === _gridY) {
        console.log('Torus already exists!')
        return TorusVertices;
    }
    setTorusParameters(r, R, gridX, gridY);
    const stepX = 6 / _gridX;
    const stepY = 6/ _gridY;
    let counter = 0;
    let howMany = 0;
    for(let i = 0.0; i <= 2 * Math.PI ; i += stepX) {
        howMany ++;
    }
    TorusVertices = [];
    TorusLines = [];
    for(let i = 0.0; i <= 2 * Math.PI ; i += stepY) {
        for(let j = 0.0; j <= 2 * Math.PI; j += stepX) {
            TorusVertices.push({
                x: (_R + (_r * Math.cos(j))) * Math.cos(i) / (_R + _r),
                y: (_R + (_r * Math.cos(j))) * Math.sin(i) / (_R + _r),
                z: _r * Math.sin(j) / (_R + _r)
            });
            if(counter % howMany + 1 === howMany) {
                TorusLines.push([counter, counter - howMany + 1])
            } else {
                TorusLines.push([counter, counter + 1]);
            }
            TorusLines.push([counter, counter + howMany]);
            counter ++;
        }
    }
    counter = 0;
    for(let i = 0.0; i <= 2 * Math.PI; i += stepX) {
        TorusLines.push([counter, TorusVertices.length - howMany + counter]);
        counter ++;
    }
}
export function getTorusVertices() {
    return TorusVertices;
}
export function getTorusLines() {
    return TorusLines;
}
export function getRAndr() {
    return { r: _r, R: _R };
}