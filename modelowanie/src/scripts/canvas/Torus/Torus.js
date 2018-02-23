
const TorusVertices = [];
let _r = 0;
let _R = 0;
/**
 * Tworzy tablice z wierzchołkami torusa
 */
function generateTorus() {
    if(TorusVertices.length !== 0) {
        console.log('Torus already exists!')
        return TorusVertices;
    }
    for(let i = 0.0; i <= 2 * Math.PI ; i += 0.1) {
        for(let j = 0.0; j <= 2 * Math.PI; j += 0.1) {
            TorusVertices.push({
                x: (_R + (_r * Math.cos(j))) * Math.cos(i),
                y: (_R + (_r * Math.cos(j))) * Math.sin(i),
                z: _r * Math.sin(j)
            });
        }
    }
    return TorusVertices;
}
/**
 * Pobiera równieni parametryczne Torusa
 * @param {double} r promień mały
 * @param {double} R promień duży
 */
export default function getTorus(r, R) {
    _r = r;
    _R = R;
    return generateTorus();
}