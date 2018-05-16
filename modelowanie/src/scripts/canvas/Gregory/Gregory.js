import { findConnection, findPoint1Array } from "./Connection";
import { getSurfaces } from "../Surface/Surface";
import { DiffPoints, SumPoints, DividePoint, MultiplyPoint, UpdatePointsForCanvas } from "../../Helpers/Helpers";
import { addPoint } from "../Points/Points";
import { DrawGregoryVector } from "../Draw/DrawGregory/DrawGregory";
import { countBerstainNAfterI, getBezierPoints } from "../Bezier/Bezier";
import { multiplyVectorAndMatrix } from "../../MatrixOperations/Multiply/Multiply";
import { deCastiljau } from "../Bezier/DeCastiljau";
import Redraw from "../Draw/Redraw";
import { getContexts, drawLine } from "../Draw/Draw";
import Translate, { setTranslationPoints } from "../Translation/TranslationCenter/TranslationCenter";

let GregoryVectors = [];
const Gregories = [];
let GregoryPoints = [];
let index = 0;
export function getGregoryVectors() {
    return GregoryVectors;
}
export function getGregoryPoints() {
    return GregoryPoints;
}
export function selectGrzegorz(id) {
    const greg = Gregories.find(x => x.id === id);
    greg.selected = !greg.selected;
    return Gregories;
}
export function getGrzegorzys() {
    return Gregories;
}
export function setGregoryName(id, name) {
    Gregories.find(x => x.id === id).name = name;
    return Gregories;
}
export function turnOnNormals(id) {
    const greg = Gregories.find(x => x.id === id);
    greg.normals = !greg.normals;
    Redraw();
    return Gregories;
}
export function MakeGregory() {
    const points = findConnection();
    if(!points) {
        return;
    }
    GregoryPoints = [];
    const surfaces = getSurfaces("C0").filter(x => x.selected);
    const importantArrays = [];
    importantArrays.push(findPoint1Array(surfaces, points[0], points[1]));
    importantArrays.push(findPoint1Array(surfaces, points[1], points[2]));
    importantArrays.push(findPoint1Array(surfaces, points[2], points[0]));
    RebuildGregory(importantArrays, points, 4, 4);
    Gregories.push({
        name: "Gregory " + index,
        importantArrays: importantArrays,
        points: points,
        normals: false,
        u: 4,
        v: 4
    });
    index ++;

}
export function RebuildGregory(importantArrays, points, u, v) {

    GregoryPoints = [];
    GregoryVectors = [];
    const p3 = [];
    const p2 = [];
    for(let i = 0; i < 3; i ++) {
        const help = findP3(importantArrays[i]);
        p3.push(help.P3);
        p2.push(help.P2);
        GregoryVectors.push([p2[i], p3[i]]);
    }
    const q = [];
    for(let i = 0; i < 3; i ++) {
        q.push(findQ(p2[i], p3[i]));
    }
    const p = findCenter(q[0], q[1], q[2]);
    const p1 = [];
    for(let i = 0; i < 3; i ++) {
        p1.push(findP1(q[i], p));
        // GregoryVectors.push([p2[i], p1[i]]);
        // GregoryVectors.push([p1[i], p]);
    }
    
    const PArrs = [];
    PArrs.push([points[1], p3[0], p, p3[1]]);
    PArrs.push([points[2], p3[1], p, p3[2]]);
    PArrs.push([points[0], p3[2], p, p3[0]]);

    const vvArrs = [];
    vvArrs.push([p2[0], p1[0], p1[1], p2[1]]);
    vvArrs.push([p2[1], p1[1], p1[2], p2[2]]);
    vvArrs.push([p2[2], p1[2], p1[0], p2[0]]);
    const importantArrays2 = [];
    importantArrays2.push(importantArrays[1]);
    importantArrays2.push(importantArrays[2]);
    importantArrays2.push(importantArrays[0]);

    createSmallPatch(PArrs[0], vvArrs[0], importantArrays[0], importantArrays[1], u, v);
    createSmallPatch(PArrs[1], vvArrs[1], importantArrays[1], importantArrays[2], u, v);
    createSmallPatch(PArrs[2], vvArrs[2], importantArrays[2], importantArrays[0], u, v);
}
export function createSmallPatch(P, vv, ia1, ia2, u, v) {
    const cPrim = [];
    const dPrim = [];
    const { a, b, aPrim, bPrim } = findAB(ia1, ia2);

    GregoryVectors.push([P[1], b[0]]);
    GregoryVectors.push([b[0], a[0]]);
    GregoryVectors.push([a[0], P[0]]);
    GregoryVectors.push([P[0], a[1]]);
    GregoryVectors.push([a[1], b[1]]);
    GregoryVectors.push([b[1], P[3]]);

    cPrim.push(SumPoints(findCPrim(DiffPoints(b[0], P[1]), DiffPoints(vv[2], P[2]), 2/3, 1/3), vv[0]));
    cPrim.push(SumPoints(findCPrim(DiffPoints(b[1], P[3]), DiffPoints(vv[1], P[2]), 2/3, 1/3), vv[3]));
    
    GregoryVectors.push([aPrim[0], a[0]]);
    GregoryVectors.push([aPrim[1], a[1]]);

    GregoryVectors.push([bPrim[0], b[0]]);
    GregoryVectors.push([bPrim[1], b[1]]);

   dPrim.push(SumPoints(findCPrim(DiffPoints(b[0], P[1]), DiffPoints(vv[2], P[2]), 1/3, 2/3), vv[1]));
   dPrim.push(SumPoints(findCPrim(DiffPoints(b[1], P[3]), DiffPoints(vv[1], P[2]), 1/3, 2/3), vv[2]));

    //  GregoryVectors.push([cPrim[0], vv[0]]);
    //  GregoryVectors.push([cPrim[1], vv[3]]);

    //  GregoryVectors.push([dPrim[0], vv[1]]);
    //  GregoryVectors.push([dPrim[1], vv[2]]);

    const preG = [];
    for(let i = 0; i < 4; i ++) {
        preG.push([]);
    }
    preG[0].push(P[0]);
    preG[0].push(a[1]);
    preG[0].push(b[1]);
    preG[0].push(P[3]);
    preG[1].push(a[0]);
    preG[1].push(undefined);
    preG[1].push(undefined);
    preG[1].push(vv[3]);
    preG[2].push(b[0]);
    preG[2].push(undefined);
    preG[2].push(undefined);
    preG[2].push(vv[2]);
    preG[3].push(P[1]);
    preG[3].push(vv[0]);
    preG[3].push(vv[1]);
    preG[3].push(P[2]);
    GregoryPoints = GregoryPoints.concat(getPoints(preG, aPrim, bPrim, cPrim, dPrim, u, v));
}
function getPoints(preG, aPrim, bPrim, cPrim, dPrim, _u, _v) {
    let ret = [];
    const Gx = [], Gy = [], Gz = [];
    for(let i = 0; i < 4; i ++) {
        Gx.push([]);
        Gy.push([]);
        Gz.push([]);
    }
    for(let i = 0; i < 4; i ++) {
        for(let j = 0; j < 4; j ++) {
            if(preG[i][j] === undefined) {
                Gx[i].push(undefined);
                Gy[i].push(undefined);
                Gz[i].push(undefined);
                continue;
            }
            Gx[i].push(preG[i][j].x);
            Gy[i].push(preG[i][j].y);
            Gz[i].push(preG[i][j].z);
        }
    }
    const { ctx } = getContexts();
    let i = 0;
    for(let u = 0; u <= 1.02; u += (1.0 / _u)) {
        ctx.beginPath()
        for(let v = 0; v <= 1.02; v += 0.02) {
            const p = {};
            p.x = getQuv(Gx, u, v, aPrim, bPrim, cPrim, dPrim, "X");
            p.y = getQuv(Gy, u, v, aPrim, bPrim, cPrim, dPrim, "Y");
            p.z = getQuv(Gz, u, v, aPrim, bPrim, cPrim, dPrim, "Z");
            setTranslationPoints([p]);
            ret.push(UpdatePointsForCanvas(Translate({}))[0]);
            if(v !== 0) {
                drawLine(ret[i].x, ret[i].y, ret[i - 1].x, ret[i - 1].y, ctx);
            }
            i ++;
        }
        ctx.stroke();
    }
    i = 0;
    ret = [];
    for(let v = 0; v <= 1.02; v += (1.0 / _v)) {
        ctx.beginPath()
        for(let u = 0; u <= 1.02; u += 0.02) {
            const p = {};
            p.x = getQuv(Gx, u, v, aPrim, bPrim, cPrim, dPrim, "X");
            p.y = getQuv(Gy, u, v, aPrim, bPrim, cPrim, dPrim, "Y");
            p.z = getQuv(Gz, u, v, aPrim, bPrim, cPrim, dPrim, "Z");
            setTranslationPoints([p]);
            ret.push(UpdatePointsForCanvas(Translate({}))[0]);
            if(u !== 0) {
                drawLine(ret[i].x, ret[i].y, ret[i - 1].x, ret[i - 1].y, ctx);
            }
            i ++;
        }
        ctx.stroke();
    }
    return ret;
}
function getQuv(G, u, v, aPrim, bPrim, cPrim, dPrim, axis) {
    // GregoryPoints.push(bPrim[0]);
    // GregoryPoints.push(cPrim[0]);
    if(axis === "X") {
        G[1][1] = getF0(aPrim[1], aPrim[0], u, v).x;
        G[1][2] = getF1(bPrim[0], cPrim[0], u, v).x;
        G[2][1] = getF2(dPrim[0], dPrim[1], u, v).x;
        G[2][2] = getF3(cPrim[1], bPrim[1], u, v).x;
    } else if(axis === "Y") {
        G[1][1] = getF0(aPrim[1], aPrim[0], u, v).y;
        G[1][2] = getF1(bPrim[0], cPrim[0], u, v).y;
        G[2][1] = getF2(dPrim[0], dPrim[1], u, v).y;
        G[2][2] = getF3(cPrim[1], bPrim[1], u, v).y;
    } else if(axis === "Z") {
        G[1][1] = getF0(aPrim[1], aPrim[0], u, v).z;
        G[1][2] = getF1(bPrim[0], cPrim[0], u, v).z;
        G[2][1] = getF2(dPrim[0], dPrim[1], u, v).z;
        G[2][2] = getF3(cPrim[1], bPrim[1], u, v).z;
    }
    const vec = multiplyVectorAndMatrix(G, getBezierVector(v));
    const bezierV = getBezierVector(u);
    return vec[0] * bezierV[0] + vec[1] * bezierV[1] + vec[2] * bezierV[2] + vec[3] * bezierV[3];
}
function getBezierVector(number) {
    const ret = [];
    ret.push(Math.pow((1 - number), 3));
    ret.push(3 * Math.pow((1 - number), 2) * number);
    ret.push(3 * (1 - number) * Math.pow(number, 2));
    ret.push(Math.pow(number, 3));
    return ret;
}
function getF0(f0, f1, u, v) {
    return DividePoint(SumPoints(MultiplyPoint(f1, u), MultiplyPoint(f0, v)), u + v !== 0 ? u + v : 0.0001);
}
function getF1(f0, f1, u, v) {
    return DividePoint(SumPoints(MultiplyPoint(f0, 1 - u), MultiplyPoint(f1, v)), (1 - u + v) === 0 ? + 0.0001 : (1 - u + v));
}
function getF2(f0, f1, u, v){
    return DividePoint(SumPoints(MultiplyPoint(f1, 1 - u), MultiplyPoint(f0, 1 - v)), 2 - u - v === 0 ? 0.0001 : 2 - u - v);
}
function getF3(f0, f1, u, v){
    return DividePoint(SumPoints(MultiplyPoint(f0, u), MultiplyPoint(f1, 1 - v)), 1 + u - v === 0 ? 0.0001 : 1 + u - v);
}
function findCPrim(p1, center, prom1, prom2) {
    return SumPoints(MultiplyPoint(p1, prom1), MultiplyPoint(center, prom2));
}
function findP1(q, center) {
    return DividePoint(SumPoints(MultiplyPoint(q, 2), center), 3);
}
function findCenter(q1, q2, q3) {
    return DividePoint(SumPoints(SumPoints(q1, q2), q3), 3);
}
function findP3(importantArray) {

    const firstCut = [];
    const secondCut = [];
    for(let i = 0; i < 2; i ++) {
        firstCut.push([]);
        secondCut.push([]);
    }

    for(let i = 0; i < 3; i ++) {
        for(let j = 0; j < 2; j ++) {
            firstCut[j].push(DividePoint(SumPoints(importantArray[j][i], importantArray[j][i + 1]), 2));
        }
    }

    for(let i = 0; i < 2; i ++) {
        for(let j = 0; j < 2; j ++) {
            secondCut[j].push(DividePoint(SumPoints(firstCut[j][i], firstCut[j][i + 1]), 2));
        }
    }
    const P3 = DividePoint(SumPoints(secondCut[0][0], secondCut[0][1]), 2);
    return {
        P3: P3,
        P2: SumPoints(P3, DiffPoints(P3, DividePoint(SumPoints(secondCut[1][0], secondCut[1][1]), 2))),
    }
}
function findAB(importantArray1, importantArray2) {
    const firstCut1 = [];
    const secondCut1 = [];
    const firstCut2 = [];
    const secondCut2 = [];
    for(let i = 0; i < 2; i ++) {
        firstCut1.push([]);
        secondCut1.push([]);
        firstCut2.push([]);
        secondCut2.push([]);
    }

    for(let i = 0; i < 3; i ++) {
        for(let j = 0; j < 2; j ++) {
            firstCut1[j].push(DividePoint(SumPoints(importantArray1[j][i], importantArray1[j][i + 1]), 2));
            firstCut2[j].push(DividePoint(SumPoints(importantArray2[j][i], importantArray2[j][i + 1]), 2));
        }
    }

    for(let i = 0; i < 2; i ++) {
        for(let j = 0; j < 2; j ++) {
            secondCut1[j].push(DividePoint(SumPoints(firstCut1[j][i], firstCut1[j][i + 1]), 2));
            secondCut2[j].push(DividePoint(SumPoints(firstCut2[j][i], firstCut2[j][i + 1]), 2));
        }
    }
    const a = [];
    const b = [];
    const aPrim = [];
    const bPrim = [];
    a.push(firstCut1[0][2]);
    a.push(firstCut2[0][0]);
    b.push(secondCut1[0][1]);
    b.push(secondCut2[0][0]);
    aPrim.push(SumPoints(DiffPoints(a[0],firstCut1[1][2]), a[0]));
    aPrim.push(SumPoints(DiffPoints(a[1],firstCut2[1][0]), a[1]));
    bPrim.push(SumPoints(DiffPoints(b[0],secondCut1[0][1]), b[0]));
    bPrim.push(SumPoints(DiffPoints(b[1],secondCut2[0][0]), b[1]));
    return {a: a, b: b, aPrim: aPrim, bPrim: bPrim};
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
function findvectorOnBack(importArray, place1, place2, prom1, prom2) {
    let vector = {};
    const helpVector1 = DiffPoints(importArray[0][place2], importArray[1][place2]);
    const helpVector2 = DiffPoints(importArray[0][place1], importArray[1][place1]);
    vector = SumPoints(MultiplyPoint(helpVector1, prom1) , MultiplyPoint(helpVector2, prom2)); 
    return vector;
}
function findPointInImportantArray(importArray, place1, place2, prom1, prom2) {
    return SumPoints(MultiplyPoint(importArray[0][place1], prom1) , MultiplyPoint(importArray[0][place2], prom2)); 
}