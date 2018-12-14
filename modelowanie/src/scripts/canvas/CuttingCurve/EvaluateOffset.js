import { evaluate } from "./FindIntersection";
import { DiffPoints, SumPoints, normalize, MultiplyPoint, DividePoint } from "../../Helpers/Helpers";
import { getCross } from "../../Save/GeneratePaths/Helpers/GeneratePathsHelper";

export function evaluateOffsetDU(ob, u, v) {
    let h = 0.0001;
    let u1 = u - h;
    let u2 = u + h;
    if(u - h < 0) {
        u1 = ob.Height - h;;
    } else if(u + h >= ob.Height) {
        u2 = h;
    }
    const ev1 = evaluateOffset(ob, u1, v);
    const ev2 = evaluateOffset(ob, u2, v);
    const diff = DividePoint(DiffPoints(ev2, ev1), 2 * h);
  //  const normDiff = normalize(diff);


   // const smallNorm = MultiplyPoint(normDiff, 0.1);
    return diff;
}
export function evaluateOffsetDV(ob, u, v) {
    let h = 0.0001;

    let v1 = v - h;
    let v2 = v + h;

    if(v - h < 0) {
        v1 = ob.Width - h;
    } else if(v + h >= ob.Width) {
        v2 = h;
    }

    const ev1 = evaluateOffset(ob, u, v1);
    const ev2 = evaluateOffset(ob, u, v2);
    const diff = DividePoint(DiffPoints(ev2, ev1), 2 * h);
   // const normDiff = normalize(diff);
    //const smallNorm = MultiplyPoint(normDiff, 0.1);
    return diff;
}
export function evaluateOffset(ob, u, v) {
    const cross = getCross(ob, u, v);
    const _eval = evaluate(ob, u, v);
    const ret = ob.id !== 5 ? DiffPoints(_eval, cross) : SumPoints(_eval, cross);
    return ret;
}