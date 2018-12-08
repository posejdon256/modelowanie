import { evaluateDU, evaluateDV, evaluate } from "./FindIntersection";
import { MultiplyPoint, crossMultiply, normalize, scalarMultiply, DiffPoints } from "../../Helpers/Helpers";
import math from "mathjs";
import { multiplyVectorAndMatrix } from "../../MatrixOperations/Multiply/Multiply";
import { getMillState } from "../../Save/GeneratePaths/FInalCut/Third";
import { evaluateOffsetDU, evaluateOffsetDV, evaluateOffset } from "./EvaluateOffset";

function generateJacobi(ob, u, v, uNew, vNew, alpha) {

    const _evaluateDU = getMillState() ? evaluateOffsetDU : evaluateDU;
    const _evaluateDV = getMillState() ? evaluateOffsetDV : evaluateDV;
    const _evaluate = getMillState() ? evaluateOffset : evaluate;

    let dU1 =  _evaluateDU(ob[0], u[0], v[0]);
    let dV1 =  _evaluateDV(ob[0], u[0], v[0]);
    let dU2 =  _evaluateDU(ob[1], u[1], v[1]);
    let dV2 =  _evaluateDV(ob[1], u[1], v[1]);
    if(dU1.x === 0 && dU1.y === 0 && dU1.z === 0) {
        dU1 =  _evaluateDU(ob[0], u[0], v[0]);
        dV1 =  _evaluateDV(ob[0], u[0], v[0]);
        dU2 =  _evaluateDU(ob[1], u[1], v[1]);
        dV2 =  _evaluateDV(ob[1], u[1], v[1]);
    }
    const t = getT(dU1, dU2, dV1, dV2);
    dU1 =  _evaluateDU(ob[0], uNew[0], vNew[0]);
    dV1 =  _evaluateDV(ob[0], uNew[0], vNew[0]);
    dU2 =  _evaluateDU(ob[1], uNew[1], vNew[1]);
    dV2 =  _evaluateDV(ob[1], uNew[1], vNew[1]);
    dU2 = MultiplyPoint(dU2, -1.0);
    dV2 = MultiplyPoint(dV2, -1.0);

    const dot1 = scalarMultiply(dU1, t);
    const dot2 = scalarMultiply(dV1, t);
    const jacobiMatrix = [
        [dU1.x, dV1.x, dU2.x, dV2.x],
        [dU1.y, dV1.y, dU2.y, dV2.y],
        [dU1.z, dV1.z, dU2.z, dV2.z],
        [dot1, dot2, 0, 0],
    ];
    return math.inv(jacobiMatrix);
}
function getT(du1, du2, dv1, dv2, alpha) {
    const np = normalize(crossMultiply(du1, dv1));
    const nq = normalize(crossMultiply(du2, dv2));
    const t = crossMultiply(np, nq);
    return normalize(t);
}
function getFforJacobi(ob, u, v, uNew, vNew, alpha) {
    const _evaluateDU = getMillState() ? evaluateOffsetDU : evaluateDU;
    const _evaluateDV = getMillState() ? evaluateOffsetDV : evaluateDV;
    const _evaluate = getMillState() ? evaluateOffset : evaluate;

    const P0 = _evaluate(ob[0], u[0], v[0]);
    const Q = _evaluate(ob[1], uNew[1], vNew[1]);
    const P1 = _evaluate(ob[0], uNew[0], vNew[0]);
    const dU1 = _evaluateDU(ob[0], u[0], v[0]);
    const dV1 = _evaluateDV(ob[0], u[0], v[0]);
    const dU2 = _evaluateDU(ob[1], u[1], v[1]);
    const dV2 = _evaluateDV(ob[1], u[1], v[1]);
    const t = getT(dU1, dU2, dV1, dV2, alpha);
    return [
        P1.x - Q.x,
        P1.y - Q.y,
        P1.z - Q.z,
        scalarMultiply(DiffPoints(P1, P0), t) +  (alpha * 100.0)
    ];
}
export function findNewNewtonPoint(ob, u, v, uNew, vNew, alpha) {
    const ret = multiplyVectorAndMatrix(generateJacobi(ob, u, v, uNew, vNew, alpha), getFforJacobi(ob, u, v, uNew, vNew, alpha));
    return ret;
}