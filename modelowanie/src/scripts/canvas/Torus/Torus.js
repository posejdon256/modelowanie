
const TorusVertices = [];
const TorusLines = [];
let _r = 0;
let _R = 0;
/**
 * Tworzy tablice z wierzchołkami torusa
 */
export default function generateTorus(r, R) {
    if(TorusVertices.length !== 0) {
        console.log('Torus already exists!')
        return TorusVertices;
    }
    _r = r;
    _R = R;
    const step = 0.3;
    let counter = 0;
    let howMany = 0;
    for(let i = 0.0; i <= 2 * Math.PI ; i += step) {
        howMany ++;
    }
    for(let i = 0.0; i <= 2 * Math.PI ; i += step) {
        for(let j = 0.0; j <= 2 * Math.PI; j += step) {
            TorusVertices.push({
                x: (_R + (_r * Math.cos(j))) * Math.cos(i),
                y: (_R + (_r * Math.cos(j))) * Math.sin(i),
                z: _r * Math.sin(j)
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
    for(let i = 0.0; i <= 2 * Math.PI; i += step) {
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