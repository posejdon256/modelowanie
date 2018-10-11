import { DiffPoints, SumPoints, DividePoint, MultiplyPoint, UpdatePointsForCanvas } from "../../Helpers/Helpers";
import { getContexts, drawLine } from "../Draw/Draw";
import { multiplyVectorAndMatrix } from "../../MatrixOperations/Multiply/Multiply";
import Translate, { setTranslationPoints } from "../Translation/TranslationCenter/TranslationCenter";
export function findAB(importantArray1, importantArray2) {
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
    const helps = [];
    helps.push(secondCut1[0][0]);
    helps.push(secondCut2[0][1]);
    a.push(firstCut1[0][2]);
    a.push(firstCut2[0][0]);
    b.push(secondCut1[0][1]);
    b.push(secondCut2[0][0]);
    aPrim.push(SumPoints(MultiplyPoint(DiffPoints(a[0],firstCut1[1][2]), 0.5), a[0]));
    aPrim.push(SumPoints(MultiplyPoint(DiffPoints(a[1],firstCut2[1][0]), 0.5), a[1]));
    bPrim.push(SumPoints(MultiplyPoint(DiffPoints(b[0],secondCut1[1][1]), 0.5), b[0]));
    bPrim.push(SumPoints(MultiplyPoint(DiffPoints(b[1],secondCut2[1][0]), 0.5), b[1]));
    return {a: a, b: b, aPrim: aPrim, bPrim: bPrim, helps: helps};
}
export function findP1(q, center) {
    return DividePoint(SumPoints(MultiplyPoint(q, 2), center), 3);
}
export function findCenter(q1, q2, q3) {
    return DividePoint(SumPoints(SumPoints(q1, q2), q3), 3);
}
export function findQ(p2, p3) {
    return DividePoint(DiffPoints(MultiplyPoint(p2, 3), p3), 2);
}
export function getPartialGregoryPoints(preG, aPrim, bPrim, cPrim, dPrim, _u, _v) {
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
    for(let u = 0; u <= 1.0; u += (1.0 / (_u - 1))) {
        ctx.beginPath()
        for(let v = 0; v <= 1.0; v += 0.02) {
            const p = {};
            p.x = getQuv(Gx, u, v, aPrim, bPrim, cPrim, dPrim, "X");
            p.y = getQuv(Gy, u, v, aPrim, bPrim, cPrim, dPrim, "Y");
            p.z = getQuv(Gz, u, v, aPrim, bPrim, cPrim, dPrim, "Z");
            setTranslationPoints([p]);
            ret.push(UpdatePointsForCanvas(Translate({}))[0]);
            if(v !== 0) {
                drawLine(ret[i].x, ret[i].y, ret[i - 1].x, ret[i - 1].y, ctx);
            }
            if(v + 0.02 > 1.0 && v + 0.02 !== 1.0 && v !== 1) {
                v = 1.0;
                i ++;
                const p = {};
                p.x = getQuv(Gx, u, v, aPrim, bPrim, cPrim, dPrim, "X");
                p.y = getQuv(Gy, u, v, aPrim, bPrim, cPrim, dPrim, "Y");
                p.z = getQuv(Gz, u, v, aPrim, bPrim, cPrim, dPrim, "Z");
                setTranslationPoints([p]);
                ret.push(UpdatePointsForCanvas(Translate({}))[0]);
                if(u !== 0) {
                    drawLine(ret[i].x, ret[i].y, ret[i - 1].x, ret[i - 1].y, ctx);
                }
            }
            i ++;
        }
        ctx.stroke();
    }
    i = 0;
    ret = [];
    for(let v = 0; v <= 1.00; v += (1.0 / (_v - 1))) {
        ctx.beginPath()
        for(let u = 0; u <= 1.00; u += 0.02) {
            const p = {};
            p.x = getQuv(Gx, u, v, aPrim, bPrim, cPrim, dPrim, "X");
            p.y = getQuv(Gy, u, v, aPrim, bPrim, cPrim, dPrim, "Y");
            p.z = getQuv(Gz, u, v, aPrim, bPrim, cPrim, dPrim, "Z");
            setTranslationPoints([p]);
            ret.push(UpdatePointsForCanvas(Translate({}))[0]);
            if(u !== 0) {
                drawLine(ret[i].x, ret[i].y, ret[i - 1].x, ret[i - 1].y, ctx);
            }
            if(u + 0.02 > 1.0 && u + 0.02 !== 1.0 && u !== 1.0) {
                u = 1.0;
                i ++;
                const p = {};
                p.x = getQuv(Gx, u, v, aPrim, bPrim, cPrim, dPrim, "X");
                p.y = getQuv(Gy, u, v, aPrim, bPrim, cPrim, dPrim, "Y");
                p.z = getQuv(Gz, u, v, aPrim, bPrim, cPrim, dPrim, "Z");
                setTranslationPoints([p]);
                ret.push(UpdatePointsForCanvas(Translate({}))[0]);
                if(u !== 0) {
                    drawLine(ret[i].x, ret[i].y, ret[i - 1].x, ret[i - 1].y, ctx);
                }
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
        G[2][1] = getF1(bPrim[0], cPrim[0], u, v).x;
        G[2][2] = getF2(dPrim[0], dPrim[1], u, v).x;
        G[1][2] = getF3(cPrim[1], bPrim[1], u, v).x;
    } else if(axis === "Y") {
        G[1][1] = getF0(aPrim[1], aPrim[0], u, v).y;
        G[2][1] = getF1(bPrim[0], cPrim[0], u, v).y;
        G[2][2] = getF2(dPrim[0], dPrim[1], u, v).y;
        G[1][2] = getF3(cPrim[1], bPrim[1], u, v).y;
    } else if(axis === "Z") {
        G[1][1] = getF0(aPrim[1], aPrim[0], u, v).z;
        G[2][1] = getF1(bPrim[0], cPrim[0], u, v).z;
        G[2][2] = getF2(dPrim[0], dPrim[1], u, v).z;
        G[1][2] = getF3(cPrim[1], bPrim[1], u, v).z;
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
export function getF0(f0, f1, u, v) {
    return DividePoint(SumPoints(MultiplyPoint(f1, u), MultiplyPoint(f0, v)), u + v !== 0 ? u + v : 0.0001);
}
export function getF1(f0, f1, u, v) {
    return DividePoint(SumPoints(MultiplyPoint(f0, 1 - u), MultiplyPoint(f1, v)), (1 - u + v) === 0 ? + 0.0001 : (1 - u + v));
}
export function getF2(f0, f1, u, v){
    return DividePoint(SumPoints(MultiplyPoint(f1, 1 - u), MultiplyPoint(f0, 1 - v)), 2 - u - v === 0 ? 0.0001 : 2 - u - v);
}
export function getF3(f0, f1, u, v){
    return DividePoint(SumPoints(MultiplyPoint(f0, u), MultiplyPoint(f1, 1 - v)), 1 + u - v === 0 ? 0.0001 : 1 + u - v);
}
export function findP3(importantArray) {
    
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
            P2: SumPoints(P3, MultiplyPoint(DiffPoints(P3, DividePoint(SumPoints(secondCut[1][0], secondCut[1][1]), 2)), 0.5)),
        }
    }