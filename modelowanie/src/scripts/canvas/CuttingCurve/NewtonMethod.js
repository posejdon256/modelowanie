import { EvaluateTorusNormal } from "../Torus/Torus";
import { crossMultiply, SumPoints, DividePoint, scalarMultiply, DiffPoints, MultiplyPoint } from "../../Helpers/Helpers";
import { addPoint } from "../Points/Points";
import { evaluate, evaluateDU, evaluateDV } from "./FindIntersection";
import { addInterpolationCurve, setInterpolationState } from "../Bezier/Interpolation";
import { addCuttingCurve, updateIn1Visualisation, updateIn2Visualisation } from "./CuttingCurve";
import { findNewNewtonPoint } from "./Jacobi";

export function goGoNewton(best) {
    const eps1 = 0.01;
    const interpolation = addInterpolationCurve();
    const cuttingCurve = addCuttingCurve(interpolation);
    //setInterpolationState(true);
    let {ob1, ob2, u, v} = best;
    const ob = [ob1, ob2];
    const uStart = [u[0], u[1]];
    const vStart = [v[0], v[1]];
    let uPrev = uStart, vPrev = vStart;
    const eps = -0.1;
    for(let j = 0; j < 8000; j ++) {
        for(let i = 0; i < 10; i ++) {
            const betterPoint = findNewNewtonPoint(ob, uPrev, vPrev, u, v);
             for(let j = 0; j < 4; j ++) {
                betterPoint[j] = (betterPoint[j] + eps) * 0.02;
             }
            u = [u[0] - betterPoint[0], u[1] - betterPoint[2]];
            v = [v[0] - betterPoint[1], v[1] - betterPoint[3]];

        }
       uPrev = [u[0], u[1]];
        vPrev = [v[0], v[1]];
        const p1 = evaluate(ob1, u[0], v[0]);
        const p2 = evaluate(ob2, u[1], v[1]);
        updateIn1Visualisation(cuttingCurve.id, u[0] - parseInt(u[0], 10), v[0] - parseInt(v[0], 10));
        updateIn2Visualisation(cuttingCurve.id, u[1] - parseInt(u[1], 10), v[1] - parseInt(v[1], 10));
        addPoint(p1.x, p1.y, p1.z, "sdsds");
        //addPoint(p2.x, p2.y, p2.z, "sdsds");
        if(u[0] + 1.2 < uStart[0] || u[1] + 1.2 < uStart[1] || v[0] - 1 > vStart[0] || v[1] - 1 > vStart[1]) {
            setInterpolationState(false);
        }
       // addPoint(p2.x, p2.y, p2.z, "sfdsdfsdf");
    }
    //setInterpolationState(false);
}
// function getNewton(ob1, ob2, best) {
//     const eval1 = evaluate(ob1, best.point1.u, best.point1.v);
//     const eval2 = evaluate(ob2, best.point2.u, best.point2.v);

//     const diff = DiffPoints(eval1, eval2);
    
//     const eval1u = evaluateDU(ob1, best.point1.u, best.point1.v);
//     const eval1v = evaluateDV(ob1, best.point1.u, best.point1.v);

//     const eval2u = evaluateDU(ob2, best.point2.u, best.point2.v);
//     const eval2v = evaluateDV(ob2, best.point2.u, best.point2.v);

//     const Fprim = [
//             scalarMultiply(diff, eval1u) * 2,
//             scalarMultiply(diff, eval1v) * 2,
//             scalarMultiply(diff, eval2u) * -2,
//             scalarMultiply(diff, eval2v) * -2
//         ];
//         return Fprim;
//     // return [
//     //     DividePoint(Fprim[0]),
//     //     DividePoint(Fprim[1]),
//     //     DividePoint(Fprim[2]),
//     //     DividePoint(Fprim[3]),
//     // ];
// }
function evaluateNormal(_ob, u, v) {
    if(_ob.type === "torus") {
        return EvaluateTorusNormal(_ob.id, u, v);
     }
}