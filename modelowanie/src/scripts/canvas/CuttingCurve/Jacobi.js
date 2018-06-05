import { evaluateDU, evaluateDV, evaluate } from "./FindIntersection";
import { MultiplyPoint, crossMultiply, normalize, scalarMultiply, DiffPoints, DividePoint } from "../../Helpers/Helpers";
import math from "mathjs";
import { multiplyVectorAndMatrix } from "../../MatrixOperations/Multiply/Multiply";

function generateJacobi(ob, u, v, uNew, vNew) {
    let dU1 = evaluateDU(ob[0], u[0], v[0]);
    let dV1 = evaluateDV(ob[0], u[0], v[0]);
    let dU2 = evaluateDU(ob[1], u[1], v[1]);
    let dV2 = evaluateDV(ob[1], u[1], v[1]);
    const t = getT(dU1, dU2, dV1, dV2);
    dU1 = evaluateDU(ob[0], uNew[0], vNew[0]);
    dV1 = evaluateDV(ob[0], uNew[0], vNew[0]);
    dU2 = evaluateDU(ob[1], uNew[1], vNew[1]);
    dV2 = evaluateDV(ob[1], uNew[1], vNew[1]);
    dU2 = MultiplyPoint(dU2, -1.0);
    dV2 = MultiplyPoint(dV2, -1.0);
    const diff1 = DiffPoints(evaluate(ob[0], uNew[0], vNew[0]), evaluate(ob[0], u[0], v[0]));
    const diff2 = DiffPoints(evaluate(ob[1], uNew[1], vNew[1]), evaluate(ob[1], u[1], v[1]));    
    const dot1 = scalarMultiply(dU1, t);
    const dot2 = scalarMultiply(dV1, t);
    // const jacobiMatrix = [
    //     [dU1.x, dU1.y, dU1.z, dot1],
    //     [dV1.x, dV1.y, dV1.z, dot2],
    //     [dU2.x, dU2.y, dU2.z, 0],
    //     [dV2.x, dV2.y, dV2.z, 0],
    // ];
    const jacobiMatrix = [
        [dU1.x, dV1.x, dU2.x, dV2.x],
        [dU1.y, dV1.y, dU2.y, dV2.y],
        [dU1.z, dV1.z, dU2.z, dV2.z],
        [dot1, dot2, 0, 0],
    ];
    return math.inv(jacobiMatrix);
}
function getT(du1, du2, dv1, dv2) {
    const np = crossMultiply(du1, dv1);
    const nq = crossMultiply(du2, dv2);
    const t = normalize(crossMultiply(np, nq));
    return t;
}
function getFforJacobi(ob, u, v, uNew, vNew) {
    const P0 = evaluate(ob[0], u[0], v[0]);
    const Q = evaluate(ob[1], uNew[1], vNew[1]);
    const P1 = evaluate(ob[0], uNew[0], vNew[0]);
    const dU1 = evaluateDU(ob[0], u[0], v[0]);
    const dV1 = evaluateDV(ob[0], u[0], v[0]);
    const dU2 = evaluateDU(ob[1], u[1], v[1]);
    const dV2 = evaluateDV(ob[1], u[1], v[1]);
    const t = getT(dU1, dU2, dV1, dV2);
    return [
        P1.x - Q.x,
        P1.y - Q.y,
        P1.z - Q.z,
        scalarMultiply(DiffPoints(P1, P0), t)
    ];
}
export function findNewNewtonPoint(ob, u, v, uNew, vNew) {
    const ret = multiplyVectorAndMatrix(generateJacobi(ob, u, v, uNew, vNew), getFforJacobi(ob, u, v, uNew, vNew));
    return ret;
}