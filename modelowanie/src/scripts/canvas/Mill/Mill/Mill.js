import { getDrillSpecification } from "../../../Load/ReadMill/ReadMill";
import Redraw from "../../Draw/Redraw";
import { DiffPointsXYZ, normalize, crossMultiply } from "../../../Helpers/Helpers";

let verticesCylinder = [];
let indicesCylinder = [];
let normalsCylinder = [];
let verticesSphere = [];
let indicesSphere = [];
let normalsSphere = [];
let millPosition = { x: 0, y: 0, z: 0 };
export function generateMill() {
    const type = getDrillSpecification();
    let r = type.mm;
    const division = 1000;
    verticesCylinder.push({x: 0, y: 0, z: 0});
    verticesCylinder.push({x: 0, y: 0, z: 0.2});
    let verticesCylinderAround = [];
    for(let t = 0; t < 2 * Math.PI; t += (1 / division)) {
        verticesCylinder.push({x: r * Math.cos(t), y: r *  Math.sin(t), z: type.k ? r : 0});
        verticesCylinder.push({x: r * Math.cos(t), y: r *  Math.sin(t), z: type.k ? 0.7 + r : 0.7});
        verticesCylinderAround.push({x: r * Math.cos(t), y: r *  Math.sin(t), z: type.k ? r : 0});
        verticesCylinderAround.push({x: r * Math.cos(t), y: r *  Math.sin(t), z: type.k ? 0.7 + r : 0.7});
    }
    pushNormalsForCylinder(getNormalVectorForCylinder(2, 4, 0));
    pushNormalsForCylinder(getNormalVectorForCylinder(3, 5, 1));
    console.log(normalsCylinder.length);
    for(let i = 0; i < verticesCylinderAround.length - 2; i ++) {
        indicesCylinder.push(verticesCylinder.length + i, verticesCylinder.length + i + 1, verticesCylinder.length + i + 2);
        pushNormalsForCylinder(getNormalVectorForCylinderAround(i, i + 1, i + 2, verticesCylinderAround));
    }
    pushNormalsForCylinder(getNormalVectorForCylinderAround(verticesCylinderAround.length - 2, verticesCylinderAround.length - 1, 0, verticesCylinderAround));
    pushNormalsForCylinder(getNormalVectorForCylinderAround(verticesCylinderAround.length - 1, 0, 1, verticesCylinderAround));
    for(let i = 2; i < verticesCylinder.length - 3; i += 2) {
         indicesCylinder.push(i, i + 2, 0);
        // pushNormalsForCylinder(getNormalVectorForCylinder(i, i + 2, 0));
         indicesCylinder.push(i + 1, i + 3, 1);
        // pushNormalsForCylinder(getNormalVectorForCylinder(i + 1, i + 2, 1));
    }
    for(let i = 2; i < verticesCylinder.length - 3; i += 2) {
        pushNormalsForCylinder(getNormalVectorForCylinder(i, i + 2, 0));
        pushNormalsForCylinder(getNormalVectorForCylinder(i + 1, i + 3, 1));
    }
    pushNormalsForCylinder(getNormalVectorForCylinder(verticesCylinder.length - 1, verticesCylinder.length - 3, 0));
    pushNormalsForCylinder(getNormalVectorForCylinder(verticesCylinder.length - 2, verticesCylinder.length - 4, 1));
    verticesCylinder = verticesCylinder.concat(verticesCylinderAround);
    if(type.k) {
        const w = 50;
        for(let teta = 0; teta <= w; teta ++) {
            for(let a = 0; a <= w; a ++) {
                const _teta = teta * 2 * Math.PI / w;
                const _a = a * Math.PI / w;
                const vec = normalize([Math.cos(_teta) * Math.sin(_a), Math.sin(_teta) * Math.sin(_a), Math.cos(_a)]);
                normalsSphere.push(vec[0], vec[1], vec[2] - 1);
                verticesSphere.push({x: r * Math.cos(_teta) * Math.sin(_a), y: r * Math.sin(_teta) * Math.sin(_a), z: (r* Math.cos(_a)) + r});
            }
        }
        for (let latNumber = 0; latNumber < w; latNumber++) {
            for (let longNumber = 0; longNumber < w; longNumber++) {
                let first = latNumber * (w + 1) + longNumber;
                let second = first + w + 1;
                indicesSphere.push(verticesCylinder.length + first);
                indicesSphere.push(verticesCylinder.length + second);
                indicesSphere.push(verticesCylinder.length + first + 1);

              //  pushNormalsForSphere(getNormalVectorForSphere(first, second, first + 1));

                indicesSphere.push(verticesCylinder.length + second);
                indicesSphere.push(verticesCylinder.length + second + 1);
                indicesSphere.push(verticesCylinder.length + first + 1);

             //   pushNormalsForSphere(getNormalVectorForSphere(second, second + 1, first + 1));

            }
        }
    }
    Redraw();
}
function getNormalVectorForCylinder(a, b, c) {
    let vec = crossMultiply(DiffPointsXYZ(verticesCylinder[a], verticesCylinder[b]), DiffPointsXYZ(verticesCylinder[c], verticesCylinder[b]));
    return normalize(vec);
}
function getNormalVectorForCylinderAround(a, b, c, verticesCylinderAround) {
    let vec = crossMultiply(DiffPointsXYZ(verticesCylinderAround[a], verticesCylinderAround[b]), DiffPointsXYZ(verticesCylinderAround[c], verticesCylinderAround[b]));
    return normalize(vec);
}
function pushNormalsForCylinder(norm) {
    for(let j = 0; j < 3; j ++) {
        normalsCylinder.push(norm[j]);
    }
}
function pushNormalsForSphere(norm) {
    for(let j = 0; j < 3; j ++) {
        normalsSphere.push(norm[j]);
    }
}
function getNormalVectorForSphere(a, b, c) {
    let vec = crossMultiply(DiffPointsXYZ(verticesSphere[a], verticesSphere[b]), DiffPointsXYZ(verticesSphere[c], verticesSphere[b]));
    return normalize(vec);
}
export function updateMillPosition(x, y, z) {
    millPosition.x += x;
    millPosition.y += y;
    millPosition.z += z;
    verticesCylinder.forEach(v => {
        v.x += x;
        v.y += y;
        v.z += z;
    });
    verticesSphere.forEach(v => {
        v.x += x;
        v.y += y;
        v.z += z;
    });
}
export function getMillPosition() {
    return millPosition;
}
export function getMill() {
    const _vertices1 = verticesCylinder.concat(verticesSphere);
    const _vertices = [];
    _vertices1.forEach(ver => {
        _vertices.push(ver.x, ver.y, ver.z);
    });
    return {
        vertices: _vertices,
        indices: indicesCylinder.concat(indicesSphere),
        normals : normalsCylinder.concat(normalsSphere)
    };
}
export function removeMill() {
    millPosition = {x: 0, y: 0, z: 0};
    verticesCylinder = [];
    indicesCylinder = [];
    verticesSphere = [];
    indicesSphere = [];
    normalsCylinder = [];
    normalsCylinder = [];
}