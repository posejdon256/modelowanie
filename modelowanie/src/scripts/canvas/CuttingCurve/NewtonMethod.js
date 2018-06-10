import { EvaluateTorusNormal } from "../Torus/Torus";
import { crossMultiply, SumPoints, DividePoint, scalarMultiply, DiffPoints, MultiplyPoint, getVectorLength } from "../../Helpers/Helpers";
import { addPoint } from "../Points/Points";
import { evaluate, evaluateDU, evaluateDV } from "./FindIntersection";
import { addInterpolationCurve, setInterpolationState } from "../Bezier/Interpolation";
import { addCuttingCurve, updateIn1Visualisation, updateIn2Visualisation } from "./CuttingCurve";
import { findNewNewtonPoint } from "./Jacobi";

export function goGoNewton(best) {
    const interpolation = addInterpolationCurve();
    const cuttingCurve = addCuttingCurve(interpolation);
    //setInterpolationState(true);
    let {ob1, ob2, u, v} = best;
    const ob = [ob1, ob2];
    const uStart = [u[0], u[1]];
    const vStart = [v[0], v[1]];
    let lastU = [u[0], u[1]], lastV = [v[0], v[1]];
    let uPrev = [uStart[0], uStart[1]];
    let vPrev = [vStart[0], vStart[1]];
    let betterPoint;
    let alpha = 0.002;
    for(let j1= 0; j1 < 1000; j1 ++) {
        for(let i = 0; i < 4; i ++) {
            try{
                betterPoint = findNewNewtonPoint(ob, uPrev, vPrev, u, v, alpha);
            } catch(e) {
                alert("Nie zbiega :( " + e);
                return;
            }
              for(let m = 0; m < 4; m ++) {
                 betterPoint[m] = (betterPoint[m]) * 0.002;
              }
            let helpU1 = u[0] - betterPoint[0];
            let helpU2 = u[1] - betterPoint[2]; 
            let helpV1 = v[0] - betterPoint[1];
            let helpV2 = v[1] - betterPoint[3]; 
            console.log(helpU1, helpU2, helpV1, helpV2);
            if(notInRange([helpU1, helpU2], [helpV1, helpV2], ob) && ob1.type !== "torus" && !ob1.cylinder) {
                    alpha = -alpha;          
                    u = [uStart[0], uStart[1]];
                    v = [vStart[0], vStart[1]];
                    uPrev = [uStart[0], uStart[1]];
                    vPrev = [vStart[0], vStart[1]];
                    continue;
            }
            if(notInRange([helpU1, helpU2], [helpV1, helpV2], ob) && ob1.cylinder) {
                helpU1 = helpU1 < 0 ? helpU1 + ob[0].width : helpU1;
                helpU2 = helpU2 < 0 ? helpU2 + ob[1].width : helpU2;
                helpV1 = helpV1 < 0 ? helpV1 + ob[0].height : helpV1;
                helpV2 = helpV2 < 0 ? helpV2 + ob[1].height : helpV2;

                helpU1 = helpU1 > ob[0].width ? helpU1 - ob[0].width : helpU1;
                helpU2 = helpU2 > ob[1].width ? helpU2 - ob[1].width : helpU2;
                helpV1 = helpV1 > ob[0].height ? helpV1 - ob[0].height : helpV1;
                helpV2 = helpV2 > ob[1].height ? helpV2 - ob[1].height : helpV2;
                u = [helpU1 , helpU2];
                v = [helpV1, helpV2];
            } else {
                lastU = [u[0], u[1]];
                lastV = [v[0], v[1]];
            }
           // }
            u = [helpU1 , helpU2];
            v = [helpV1, helpV2];

            const ev1 = evaluate(ob[0], lastU[0], lastV[0]);
            const ev2 = evaluate(ob[1], lastU[1], lastV[1]);
            const ev1New = evaluate(ob[0], u[0], v[0]);
            const ev2New = evaluate(ob[1], u[1], v[1]);
            if(getVectorLength(ev1, ev2) < getVectorLength(ev1New, ev2New) && j1 !== 0 && i !== 0) {
                alpha /= 2;
            }
            const p1 = evaluate(ob1, u[0], v[0]);
            const p2 = evaluate(ob2, u[1], v[1]);
            //if(j1 > 60)
              //  addPoint(p1.x, p1.y, p1.z, "Orange");

        }
        uPrev = [u[0], u[1]];
        vPrev = [v[0], v[1]];
        const p1 = evaluate(ob1, u[0], v[0]);
        const p2 = evaluate(ob2, u[1], v[1]);

         updateIn1Visualisation(cuttingCurve.id, u[0], v[0]);
         updateIn2Visualisation(cuttingCurve.id, u[1], v[1]);
       // if(j1 > 60)
        addPoint(p1.x, p1.y, p1.z, "Orange");
        addPoint(p2.x, p2.y, p2.z, "Blue");
        if(u[0] + 1.2 < uStart[0] || u[1] + 1.2 < uStart[1] || v[0] - 1 > vStart[0] || v[1] - 1 > vStart[1]) {
            setInterpolationState(false);
        }
       // addPoint(p2.x, p2.y, p2.z, "sfdsdfsdf");
    }
    setInterpolationState(false);
 }
 function notInRange(u, v, ob) {
     return (u[0] < 0 || u[1] < 0 || v[0] < 0 || v[1] < 0 || u[0] >= ob[0].width || u[1] >= ob[1].width || v[0] >= ob[0].height  || v[1] >= ob[1].height );
 }
function updateCylinder(u, v) {

}
function updateBoundry(bestNewSolution) {

}
function evaluateNormal(_ob, u, v) {
    if(_ob.type === "torus") {
        return EvaluateTorusNormal(_ob.id, u, v);
     }
}