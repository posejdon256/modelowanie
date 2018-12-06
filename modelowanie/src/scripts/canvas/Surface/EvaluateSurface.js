import { getSurfaces } from "./Surface";
import { deCastiljau, deCastiljau3 } from "../Bezier/DeCastiljau";
import { MultiplyPoint, DiffPoints, longVectorScalar } from "../../Helpers/Helpers";
import { multiplyVectorAndMatrix } from "../../MatrixOperations/Multiply/Multiply";

function CurveC2Evaluate(x) {
    const ret = [];
    const ix = 1 - x;
    ret.push(ix * ix * ix / 6);
    ret.push((3 * x - 6) * x * x + 4);
    ret[1] /= 6;
    ret.push(ix * 3 * x * x + 3 * x + 1);
    ret[2] /= 6;
    ret.push(x * x * x / 6);
    return ret;
}
function CurveC2EvaluateDerivative(x) {
    const ret = [];
    const ix = 1 - x;
    ret.push(- 3 * ix * ix / 6);
    ret.push(3 * x * (3 * x - 4));
    ret[1] /= 6;
    ret.push(- 9 * x * x + 6 * x + 3);
    ret[2] /= 6;
    ret.push(3 * x * x / 6);
    return ret;
}
export function EvaluateSurface(id, u, v, debug) {
    const surfaces = getSurfaces();
    const s = surfaces.find(x => x.id === id);
    const {_u, _v, _u1, _v1, _false} = getUVForC0(id, u, v, debug);
    if(_false) {
        return getUVForC0(id, u, v);
    }
    const knots = [];
    for(let i = 0; i < 4; i ++) {
        knots.push(deCastiljau(_v1, s.pointsMap[_u + i][_v + 0], s.pointsMap[_u + i][_v + 1], s.pointsMap[_u + i][_v + 2], s.pointsMap[_u + i][_v + 3]));
    }
  //  if(debug)
    //    console.log( deCastiljau(_v1, knots[0], knots[1], knots[2], knots[3]));
    return deCastiljau(_u1, knots[0], knots[1], knots[2], knots[3]);
}
export function EvaluateSurfaceDU(id, u, v) {
    const surfaces = getSurfaces();
    const s = surfaces.find(x => x.id === id);
    const {_u, _v, _u1, _v1, _false} = getUVForC0(id, u, v);
    if(_false) {
        return getUVForC0(id, u, v);
    }
    const knots = [];
    for(let i = 0; i < 4; i ++) {
        knots.push(deCastiljau(_v1, s.pointsMap[_u + i][_v + 0], s.pointsMap[_u + i][_v + 1], s.pointsMap[_u + i][_v + 2], s.pointsMap[_u + i][_v + 3]));
    }
    const derKnots = [];
    for(let i = 0; i <3; i++) {
        derKnots.push(MultiplyPoint(DiffPoints(knots[i + 1] , knots[i]), 3));
    }
    return deCastiljau3(_u1, derKnots[0], derKnots[1], derKnots[2]);
}
export function EvaluateSurfaceDV(id, u, v) {
    const surfaces = getSurfaces();
    const s = surfaces.find(x => x.id === id);
    const {_u, _v, _u1, _v1, _false} = getUVForC0(id, u, v);
    if(_false) {
        return getUVForC0(id, u, v);
    }
    const knots = [];
    for(let i = 0; i < 4; i ++) {
        knots.push(deCastiljau(_u1, s.pointsMap[_u + 0][_v + i], s.pointsMap[_u + 1][_v + i], s.pointsMap[_u + 2][_v + i], s.pointsMap[_u + 3][_v + i]));
    }
    const derKnots = [];
    for(let i = 0; i <3; i++) {
        derKnots.push(MultiplyPoint(DiffPoints(knots[i + 1] , knots[i]), 3));
    }
    return deCastiljau3(_v1, derKnots[0], derKnots[1], derKnots[2]);
}
export function EvaluateSurfaceC2(id, u, v) {
    const {_u, _v, _u1, _v1} = getUVForC2(id, u, v);
    const s = getSurfaces("C2").find(x => x.id === id);

    const bu = CurveC2Evaluate(_u1);
    const bv = CurveC2Evaluate(_v1);
    const arrX = [];
    const arrY = [];
    const arrZ = [];
    const map = s.pointsMap;
    for(let i = 0; i < 4; i ++) {
        arrX.push([]);
        arrY.push([]);
        arrZ.push([]);
        for(let j = 0; j < 4; j ++) {
            arrX[i].push(map[j + _u][i + _v].x);
            arrY[i].push(map[j + _u][i + _v].y);
            arrZ[i].push(map[j + _u][i + _v].z);
        }
    }
    const x = multiplyVectorAndMatrix(arrX, bu);
    const y = multiplyVectorAndMatrix(arrY, bu);
    const z = multiplyVectorAndMatrix(arrZ, bu);

    const ret = {
        x: longVectorScalar(x, bv),
        y: longVectorScalar(y, bv),
        z: longVectorScalar(z, bv),
    };
    return ret;
}
export function EvaluateSurfaceC2DV(id, u, v) {
    const {_u, _v, _u1, _v1} = getUVForC2(id, u, v);
    const s = getSurfaces("C2").find(x => x.id === id);

    const bv = CurveC2Evaluate(_u1);
    const bu = CurveC2EvaluateDerivative(_v1);
    const arrX = [];
    const arrY = [];
    const arrZ = [];
    const map = s.pointsMap;
    for(let i = 0; i < 4; i ++) {
        arrX.push([]);
        arrY.push([]);
        arrZ.push([]);
        for(let j = 0; j < 4; j ++) {
            arrX[i].push(map[j + _u][i + _v].x);
            arrY[i].push(map[j + _u][i + _v].y);
            arrZ[i].push(map[j + _u][i + _v].z);
        }
    }
    const x = multiplyVectorAndMatrix(arrX, bv);
    const y = multiplyVectorAndMatrix(arrY, bv);
    const z = multiplyVectorAndMatrix(arrZ, bv);

    const ret = {
        x: longVectorScalar(x, bu),
        y: longVectorScalar(y, bu),
        z: longVectorScalar(z, bu),
    };
    return ret;
}
export function EvaluateSurfaceC2DU(id, u, v) {
    const {_u, _v, _u1, _v1} = getUVForC2(id, u, v);
    const s = getSurfaces("C2").find(x => x.id === id);

    const bu = CurveC2EvaluateDerivative(_u1);
    const bv = CurveC2Evaluate(_v1);
    const arrX = [];
    const arrY = [];
    const arrZ = [];
    const map = s.pointsMap;
    for(let i = 0; i < 4; i ++) {
        arrX.push([]);
        arrY.push([]);
        arrZ.push([]);
        for(let j = 0; j < 4; j ++) {
            arrX[i].push(map[j + _u][i + _v].x);
            arrY[i].push(map[j + _u][i + _v].y);
            arrZ[i].push(map[j + _u][i + _v].z);
        }
    }
    const x = multiplyVectorAndMatrix(arrX, bu);
    const y = multiplyVectorAndMatrix(arrY, bu);
    const z = multiplyVectorAndMatrix(arrZ, bu);

    const ret = {
        x: longVectorScalar(x, bv),
        y: longVectorScalar(y, bv),
        z: longVectorScalar(z, bv),
    };
    return ret;
}
function getUVForC0(id, u, v, debug) {
    const _u = Math.floor(u) * 3;
    const _v = Math.floor(v) * 3;
    const _u1 =  u - Math.floor(u);
    const _v1 = v - Math.floor(v);
    //console.log(u, v, uNew, vNew, _u, _v);
    //if(debug)
      //  console.log(_u, _v, u, v);
    return {_u: _u, _v: _v, _u1 : _u1, _v1: _v1};
}
function getUVForC2(id, u, v) {
    const _u = Math.floor(u);
    const _v = Math.floor(v);
    const _u1 = u - Math.floor(u);
    const _v1 = v - Math.floor(v) ;
    return {_u: _u, _v: _v, _u1 : _u1, _v1: _v1};
}