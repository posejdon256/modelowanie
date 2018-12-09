import { evaluate } from "./FindIntersection";
import { DiffPoints, SumPoints, normalize, MultiplyPoint } from "../../Helpers/Helpers";
import { getCross } from "../../Save/GeneratePaths/Helpers/GeneratePathsHelper";
import { DrawLine } from "../Draw/DrawLine/DrawLine";
import { DrawPoint } from "../Draw/DrawPoints/DrawPoints";

export function evaluateOffsetDU(ob, u, v) {
    let h = -0.0001;
    const ev1 = evaluateOffset(ob, u, v);
    if(u + h < 0) {
        const back = u + h;
        h = ob.Height + h;
    }
    const ev2 = evaluateOffset(ob, u + h, v);
    const diff = DiffPoints(ev1, ev2);
    const normDiff = normalize(diff);


    const smallNorm = MultiplyPoint(normDiff, 0.01);
    DrawLine(ev1, SumPoints(ev1, normDiff));
    return smallNorm;
}
export function evaluateOffsetDV(ob, u, v) {
    let h = -0.0001;
    const ev1 = evaluateOffset(ob, u, v);
    if(v + h < 0) {
        const back = v + h;
        h = ob.Width + h;
    }
    const ev2 = evaluateOffset(ob, u, v + h);
    const diff = DiffPoints(ev1, ev2);
    const normDiff = normalize(diff);
    const smallNorm = MultiplyPoint(normDiff, 0.01);
    DrawLine(ev1, SumPoints(ev1, normDiff));
    return smallNorm;
}
export function evaluateOffset(ob, u, v) {
    const cross = getCross(ob, u, v);
    const _eval = evaluate(ob, u, v);
    const ret = ob.id !== 5 ? DiffPoints(_eval, cross) : SumPoints(_eval, cross);
    return ret;
}