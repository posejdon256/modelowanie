let r = 0.1;
let type = 1; // 0 - flat, 1 - cylinder
let verticesCylinder = [];
let indicesCylinder = [];
let verticesSphere = [];
let indicesSphere = [];
export function generateMill() {
    const division = 1000;
    verticesCylinder.push({x: 0, y: 0, z: 0});
    verticesCylinder.push({x: 0, y: 0, z: 0.2});
    for(let t = 0; t < 2 * Math.PI; t += (1 / division)) {
        verticesCylinder.push({x: r * Math.cos(t), y: r *  Math.sin(t), z: 0});
        verticesCylinder.push({x: r * Math.cos(t), y: r *  Math.sin(t), z: 0.2});
    }
    for(let i = 2; i < verticesCylinder.length - 2; i ++) {
        indicesCylinder.push(i, i + 1, i + 2);
    }
    for(let i = 2; i < verticesCylinder.length - 3; i += 2) {
         indicesCylinder.push(i, i + 2, 0);
         indicesCylinder.push(i + 1, i + 3, 1);
    }
    if(type === 1) {
        const w = 50;
        for(let teta = 0; teta <= w; teta ++) {
            for(let a = 0; a <= w; a ++) {
                const _teta = teta * 2 * Math.PI / w;
                const _a = a * Math.PI / w;
                verticesSphere.push({x: r * Math.cos(_teta) * Math.sin(_a), y: r * Math.sin(_teta) * Math.sin(_a), z: r* Math.cos(_a)});
            }
        }
        for (let latNumber = 0; latNumber < w; latNumber++) {
            for (let longNumber = 0; longNumber < w; longNumber++) {
                let first = latNumber * (w + 1) + longNumber;
                let second = first + w + 1;
                indicesSphere.push(verticesCylinder.length + first);
                indicesSphere.push(verticesCylinder.length + second);
                indicesSphere.push(verticesCylinder.length + first + 1);

                indicesSphere.push(verticesCylinder.length + second);
                indicesSphere.push(verticesCylinder.length + second + 1);
                indicesSphere.push(verticesCylinder.length + first + 1);
            }
        }
    }
}
export function getMill() {
    return {
        vertices: verticesCylinder.concat(verticesSphere),
        indices: indicesCylinder.concat(indicesSphere)
    };
}
export function removeMill() {
    verticesCylinder = [];
    indicesCylinder = [];
    verticesSphere = [];
    indicesSphere = [];
}