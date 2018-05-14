import { findConnection, findPoint1Array } from "./Connection";
import { getSurfaces } from "../Surface/Surface";
import { DiffPoints, SumPoints, DividePoint, MultiplyPoint } from "../../Helpers/Helpers";
import { addPoint } from "../Points/Points";

export function MakeGregory() {
    const points = findConnection();
    if(!points) {
        return;
    }
    const surfaces = getSurfaces("C0").filter(x => x.selected);

    const importantArrays = [];
    importantArrays.push(findPoint1Array(surfaces, points[0], points[1]));
    importantArrays.push(findPoint1Array(surfaces, points[1], points[2]));
    importantArrays.push(findPoint1Array(surfaces, points[2], points[0]));

    const vecs = [];
    const p3 = [];
    for(let i = 0; i < 3; i ++) {
        vecs.push(findVector(importantArrays[i], 1/2));
        p3.push(findP3(importantArrays[i]));
    }
    const p2 = [];
    for(let i = 0; i < 3; i ++) {
        p2.push(SumPoints(p3[i], vecs[i]));
        //addPoint(p2)
    }
    const q = [];
    for(let i = 0; i < 3; i ++) {
        q.push(findQ(p2[i], p3[i]));
    }
    const p = findCenter(q[0], q[1], q[2]);
    const p1 = [];
    for(let i = 0; i < 3; i ++) {
        p1.push(findP1(q[i], p));
    }
     for(let i = 0; i < 3; i ++) {
         addPoint(p1[i].x, p1[i].y, p1[i].z, "Greg");
         addPoint(p2[i].x, p2[i].y, p2[i].z, "Greg");
         addPoint(p3[i].x, p3[i].y, p3[i].z, "Greg");
     }
    addPoint(p.x, p.y, p.z);

    const PArrs = [];
    PArrs.push([points[0], p3[0], p, p3[2]]);
    PArrs.push([points[1], p3[1], p, p3[0]]);
    PArrs.push([points[2], p3[2], p, p3[1]]);

    const vvArrs = [];
    vvArrs.push([p2[0], p1[0], p1[2], p2[2]]);
    vvArrs.push([p2[1], p1[1], p1[0], p2[0]]);
    vvArrs.push([p2[2], p1[2], p1[1], p2[1]]);

    createSmallPatch(PArrs[0], vvArrs[0], importantArrays[0], importantArrays[1]);
    createSmallPatch(PArrs[1], vvArrs[1], importantArrays[1], importantArrays[2]);
    createSmallPatch(PArrs[2], vvArrs[2], importantArrays[2], importantArrays[0]);
}
function createSmallPatch(P, vv, ia1, ia2) {
    const a1 = SumPoints(findPointInImportantArray(ia1, 1/6), findVector(ia1, 1/6));
    const a2 = findVector(ia2, 5/6);

    const b1 = findVector(ia1, 2/6);
    const b2 = findVector(ia2, 4/6);

    addPoint(a1.x, a1.y, a1.z, "Greg");


    //const a1 = findVector(surface, P[0], P[1], 1/3);
}
function findP1(q, center) {
    return DividePoint(SumPoints(MultiplyPoint(q, 2), center), 3);
}
function findCenter(q1, q2, q3) {
    return DividePoint(SumPoints(SumPoints(q1, q2), q3), 3);
}
function findP3(importantArray) {
    return DividePoint(SumPoints(importantArray[0][parseInt(importantArray[0].length / 2)], importantArray[0][parseInt(importantArray[0].length / 2) - 1]), 2);
}
function findQ(p2, p3) {
    return DividePoint(DiffPoints(MultiplyPoint(p2, 3), p3), 2);
}
function findVector(importArray, place) {
    let vector = {};
    const place1 = parseInt(importArray[0].length  * place, 10) === 0 ? 1 : parseInt(importArray[0].length  * place, 10);
    const place2 = parseInt(importArray[0].length  * place, 10) === 0 ? 0 : parseInt(importArray[0].length  * place, 10) - 1;
    const helpVector1 = DiffPoints(importArray[0][place2], importArray[1][place2]);
    const helpVector2 = DiffPoints(importArray[0][place1], importArray[1][place1]);
    vector = DividePoint(SumPoints(helpVector1, helpVector2), 2);
    return vector;
}
function findPointInImportantArray(importArray, place) {
    const place1 = parseInt(importArray[0].length  * place, 10) === 0 ? 1 : parseInt(importArray[0].length  * place, 10);
    const place2 = parseInt(importArray[0].length  * place, 10) === 0 ? 0 : parseInt(importArray[0].length  * place, 10) - 1;
    return DividePoint(SumPoints(importArray[0][place1], importArray[0][place2]), 2); 
}