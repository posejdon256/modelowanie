import { findConnection, findPoint1Array } from "./Connection";
import { getSurfaces } from "../Surface/Surface";
import { DiffPoints, SumPoints, DividePoint, MultiplyPoint } from "../../Helpers/Helpers";
import Redraw from "../Draw/Redraw";
import { countK0AndH0 } from "./Determinant";
import { findAB, findP3, findCenter, findQ, findP1, getPartialGregoryPoints } from "./Helper";

let GregoryVectors = [];
let Gregories = [];
let GregoryPoints = [];
let index = 0;
export function cleanGrzegorzys() {
    GregoryVectors = [];
    Gregories = [];
    GregoryPoints = [];
}
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
export function removeGregory(id) {
    for(let i = 0; i < Gregories.length; i ++) {
        if(id === Gregories[i].id) {
            Gregories.splice(i, 1);
            break;
        }
    }
    Redraw();
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
        //GregoryVectors.push([p2[i], p3[i]]);
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
    vvArrs.push([p2[0], p1[0], p1[1], p2[1], p1[2]]);
    vvArrs.push([p2[1], p1[1], p1[2], p2[2], p1[0]]);
    vvArrs.push([p2[2], p1[2], p1[0], p2[0], p1[1]]);
    const importantArrays2 = [];
    importantArrays2.push(importantArrays[1]);
    importantArrays2.push(importantArrays[2]);
    importantArrays2.push(importantArrays[0]);

    //createSmallPatch(PArrs[0], vvArrs[0], importantArrays[0], importantArrays[1], u, v);
    createSmallPatch(PArrs[1], vvArrs[1], importantArrays[1], importantArrays[2], u, v);
   // createSmallPatch(PArrs[2], vvArrs[2], importantArrays[2], importantArrays[0], u, v);
   // addPoint(vvArrs[2][0].x, vvArrs[2][0].y, vvArrs[2][0].z, 'dfsds');
   // addPoint(vvArrs[2][1].x, vvArrs[2][1].y, vvArrs[2][1].z, 'dfsds');
   // addPoint(vvArrs[2][2].x, vvArrs[2][2].y, vvArrs[2][2].z, 'dfsds');
   // addPoint(vvArrs[2][3].x, vvArrs[2][3].y, vvArrs[2][3].z, 'dfsds');
}
export function createSmallPatch(P, vv, ia1, ia2, u, v) {
    const cPrim = [];
    const dPrim = [];
    const { a, b, aPrim, bPrim, helps } = findAB(ia1, ia2);

    let a0 = DiffPoints(P[1], helps[0]);
    let b0 =  DiffPoints(b[0], P[1]);
    let a3 = DiffPoints(P[2], vv[4]);
    let b3 = DiffPoints(vv[2], P[2]);
    let gs = getGs(a0, b0, a3, b3)
    let cs = getCis(P[2], vv[1], vv[0], P[1]);
    let kh0 = countK0AndH0(gs[0], cs[0], b0);
    let kh1 = countK0AndH0(gs[2], cs[2], b3);
    let dv0 = getDValue(1/3, gs, cs, kh0, kh1);
    let dv1 = getDValue(2/3, gs, cs, kh0, kh1);
   // GregoryVectors.push([vv[0], SumPoints(vv[0], dv0)]);
    cPrim.push(SumPoints(vv[0], dv0));
    dPrim.push(SumPoints(vv[1], dv1));
    // GregoryVectors.push([vv[0], SumPoints(vv[0], dv0)]);
    // GregoryVectors.push([vv[1], SumPoints(vv[1], dv1)]);

    a0 = DiffPoints(P[3], helps[1]);
    b0 =  DiffPoints(b[1], P[3]);
    b3 = DiffPoints(vv[1], P[2]);
    a3 = DiffPoints(P[2], vv[4]);
    gs = getGs(a0, b0, a3, b3)
    cs = getCis(P[2], vv[2], vv[3], P[3]);
    kh0 = countK0AndH0(gs[0], cs[0], b0);
    kh1 = countK0AndH0(gs[2], cs[2], b3);
    dv0 = getDValue(1/3, gs, cs, kh0, kh1);
    dv1 = getDValue(2/3, gs, cs, kh0, kh1);

    cPrim.push(SumPoints(vv[3], dv0));
    dPrim.push(SumPoints(vv[2], dv1));
  //  GregoryVectors.push([vv[3], SumPoints(vv[3], dv0)]);
  GregoryVectors.push([b[0], bPrim[0]]);
  GregoryVectors.push([b[1], bPrim[1]]);
  GregoryVectors.push([a[0], aPrim[0]]);
  GregoryVectors.push([a[1], aPrim[1]]);
   // GregoryVectors.push([vv[2], SumPoints(vv[2], dv1)]);

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
    GregoryPoints = GregoryPoints.concat(getPartialGregoryPoints(preG, aPrim, bPrim, cPrim, dPrim, u, v));
}
function getBezier2(v) {
    const ret = [];
    ret.push(Math.pow(1 - v, 2));
    ret.push(2 * (1 - v) * v);
    ret.push(Math.pow(v, 2));
    return ret;
}
function getGs(a0, b0, a3, b3) {
    const ret = [];
    const g0 = DividePoint(SumPoints(a0, b0), 2);
    const g2 = DividePoint(SumPoints(a3, b3), 2);
    const g1 = DividePoint(SumPoints(g0, g2), 2);
    ret.push(g0);
    ret.push(g1);
    ret.push(g2);
    return ret;
}
function getDValue(v, gs, cs, kh0, kh1) {
    const kv = kh0.k * (1 - v) + kh1.k * v;
    const hv = kh0.h * (1 - v) + kh1.h * v;
    const gv = getGValue(v, gs);
    const cv = getCValue(v, cs);
    return SumPoints(MultiplyPoint(gv, kv), MultiplyPoint(cv, hv));
}
function getGValue(v, gs) {
    const beziers2 = getBezier2(v);
    const sums = [];
    for(let i = 0; i < 3; i ++) {
        sums.push(MultiplyPoint(gs[i],  beziers2[i]));       
    }
    return SumPoints(SumPoints(sums[0], sums[2]), sums[1]);
}
function getCValue(v, cs) {
    const beziers2 = getBezier2(v);
    const sums = [];
    for(let i = 0; i < 3; i ++) {
        sums.push(MultiplyPoint(cs[i],  beziers2[i]));       
    }
    return SumPoints(SumPoints(sums[0], sums[2]), sums[1]);
}
function getCis(P0, P1, P2, P3) {
    return [DiffPoints(P2, P3), DiffPoints(P1, P2), DiffPoints(P0, P1)];
}