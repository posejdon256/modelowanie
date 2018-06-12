import { EvaluateTorusNormal } from "../Torus/Torus";
import { crossMultiply, SumPoints, DividePoint, scalarMultiply, DiffPoints, MultiplyPoint, getVectorLength, TryParseFloat } from "../../Helpers/Helpers";
import { addPoint } from "../Points/Points";
import { evaluate, evaluateDU, evaluateDV } from "./FindIntersection";
import { addInterpolationCurve, setInterpolationState } from "../Bezier/Interpolation";
import { addCuttingCurve, updateIn1Visualisation, updateIn2Visualisation } from "./CuttingCurve";
import { findNewNewtonPoint } from "./Jacobi";


let alpha = 0.002;
let finalEpsilon = 0.01;
export function setNewtonAlpa(_alpha) {
    alpha = TryParseFloat(_alpha, alpha);
}
export function setFinalEpsilon(_eps) {
    finalEpsilon = TryParseFloat(_eps, finalEpsilon);
}
export function goGoNewton(best) {
    let {ob1, ob2, u, v} = best;
    const interpolation = addInterpolationCurve();
    const cuttingCurve = addCuttingCurve(interpolation);
    const ob = [ob1, ob2];
    const uStart = [u[0], u[1]];
    const vStart = [v[0], v[1]];
    let lastU = [u[0], u[1]], lastV = [v[0], v[1]];
    let uPrev = [uStart[0], uStart[1]];
    let vPrev = [vStart[0], vStart[1]];
    let betterPoint;
    let backed = false;
    let pStart = evaluate(ob[0], uStart[0], vStart[0]);
    let notFinishYet = 0;
    let pointsList = [];
    let j1 = 0;
    while(true) {
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
            if((notInRange([helpU1, helpU2], [helpV1, helpV2], ob) && ob1.type !== "torus" && !ob1.cylinder && !ob2.cylinder) ||
            (notInVRange([helpV1, helpV2], ob) && (ob1.cylinder || ob2.cylinder))
            || (notInURange([helpU1, helpU2], ob) && (ob1.cylinder || ob2.cylinder) && ob1.type === "C2" && ob2.type === "C2")) {
                    alpha = -alpha;  
                    if(!backed)    
                        notFinishYet = 0;   
                    u = [uStart[0], uStart[1]];
                    v = [vStart[0], vStart[1]];
                    uPrev = [uStart[0], uStart[1]];
                    vPrev = [vStart[0], vStart[1]];
                    updateIn1Visualisation(cuttingCurve.id, {break: true});
                    updateIn2Visualisation(cuttingCurve.id, {break: true});
                    pointsList = pointsList.reverse();

                   // pointsList.push(evaluate(ob1, u[0], v[0]));
                    backed = true; 
                    continue;
            }
            lastU = [u[0], u[1]];
            lastV = [v[0], v[1]];
            u = [helpU1 , helpU2];
            v = [helpV1, helpV2];

        }
        uPrev = [u[0], u[1]];
        vPrev = [v[0], v[1]];
        const p1 = evaluate(ob1, u[0], v[0]);
        const p2 = evaluate(ob2, u[1], v[1]);
        // addPoint(p1.x, p1.y, p1.z, "Blue");
        // addPoint(p2.x, p2.y, p2.z, "Orange");
        
        pointsList.push(evaluate(ob1, u[0], v[0]));

        updateIn1Visualisation(cuttingCurve.id, ob[0].type === "torus" ? u[0] :  u[0] / ob[0].width, ob[0].type === "torus" ? v[0] : v[0] / ob[0].height);
        updateIn2Visualisation(cuttingCurve.id, ob[1].type === "torus" ? u[1] : u[1] / ob[1].width, ob[1].type === "torus" ? v[1] : v[1] / ob[1].height);
        if(finalEpsilon > getVectorLength(pStart, p1) && notFinishYet > 20) {
            break;
        }
        if(j1 > 1000) {
            break;
        }
        notFinishYet ++;
        j1 ++;
    }
    setInterpolationState(true);
    if(!backed) {
        addPoint(pStart.x, pStart.y, pStart.z, "Newton");
        addPoint(pStart.x, pStart.y, pStart.z, "Newton");
        addPoint(pStart.x, pStart.y, pStart.z, "Newton");
    }
    for(let i = 0; i < pointsList.length; i ++) {
        addPoint(pointsList[i].x, pointsList[i].y, pointsList[i].z, "Newton"); 
    }
    if(!backed) {
        addPoint(pStart.x, pStart.y, pStart.z, "Newton");
        addPoint(pStart.x, pStart.y, pStart.z, "Newton");
        addPoint(pStart.x, pStart.y, pStart.z, "Newton");
    }
    setInterpolationState(false);
 }
 function notInRange(u, v, ob) {
     return (u[0] < 0 || u[1] < 0 || v[0] < 0 || v[1] < 0 || u[0] >= ob[0].width || u[1] >= ob[1].width || v[0] >= ob[0].height  || v[1] >= ob[1].height );
 }
 function notInURange(u, ob) {
    return (u[0] < 0 || u[1] < 0 || u[0] >= ob[0].width || u[1] >= ob[1].width);
 }
 function notInVRange(v, ob) {
    return (v[0] < 0 || v[1] < 0 || v[0] >= ob[0].height || v[1] >= ob[1].height);
 }
function evaluateNormal(_ob, u, v) {
    if(_ob.type === "torus") {
        return EvaluateTorusNormal(_ob.id, u, v);
     }
}