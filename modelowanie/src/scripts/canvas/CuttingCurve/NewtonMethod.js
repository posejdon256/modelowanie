import { getVectorLength, TryParseFloat } from "../../Helpers/Helpers";
import { addPoint } from "../Points/Points";
import { evaluate } from "./FindIntersection";
import { addInterpolationCurve, setInterpolationState } from "../Bezier/Interpolation";
import { addCuttingCurve, updateIn1Visualisation, updateIn2Visualisation } from "./CuttingCurve";
import { findNewNewtonPoint } from "./Jacobi";
import { DrawPoint } from "../Draw/DrawPoints/DrawPoints";
import { updateUVAfterNewton, backNewton } from "./NewtonUpdateUV";


let alpha = 0.002;
let finalEpsilon = 0.01;
let alphaEpsilon = 0.001;
export function setNewtonAlpa(_alpha) {
    alpha = TryParseFloat(_alpha, alpha);
}
export function setFinalEpsilon(_eps) {
    finalEpsilon = TryParseFloat(_eps, finalEpsilon);
}
export function goGoNewton(best, iterations) {
    console.clear();
    let {ob1, ob2, u, v} = best;
    let interpolation;
    let cuttingCurve;
    let _alpha = alpha;
    if(!iterations) {
        cuttingCurve = addCuttingCurve(interpolation);
    }
    const ob = [ob1, ob2];
    const uStart = [u[0], u[1]];
    const vStart = [v[0], v[1]];
    let uPrev = [uStart[0], uStart[1]];
    let vPrev = [vStart[0], vStart[1]];
    let betterPoint;
    let backed = false;
    let pStart = evaluate(ob[0], uStart[0], vStart[0]);
    DrawPoint(pStart, "Blue");
    let notFinishYet = 0;
    let loops = 0;
    let pointsList = [];
    let stop = iterations ? iterations : 1000;
    let finished = false;
    while(!finished) {
        let tempAlpha = _alpha;
        for(let i = 0; i < 10; i ++) {
            betterPoint = findNewNewtonPoint(ob, uPrev, vPrev, u, v, tempAlpha);
            if(ob1.type !== "torus" && ob2.type === "torus") {
                betterPoint[2] *= 0.15;
                betterPoint[3] *= 0.15;
            }
            // const { ob, u, v, uNew, vNew, uStart, vStart, alpha, backed };
            const upd1 = updateUVAfterNewton({ob: ob1, u: u[0], v: v[0], uNew: betterPoint[0], vNew: betterPoint[1], backed: backed});
            const upd2 = updateUVAfterNewton({ob: ob2, u: u[1], v: v[1], uNew: betterPoint[2], vNew: betterPoint[3], backed: backed});
            u[0] = upd1.u;
            u[1] = upd2.u;

            v[0] = upd1.v;
            v[1] = upd2.v;
            if(upd1.end || upd2.end) {
                finished = true;
                break;
            }
            if(!iterations && upd1.crossed && !upd1.backThisTime) {
                updateIn1Visualisation(cuttingCurve.id, {break: true});
            }
            if(!iterations && upd2.crossed && !upd2.backThisTime) {
                updateIn2Visualisation(cuttingCurve.id, {break: true});
            }
            if(!iterations && (upd1.backThisTime || upd2.backThisTime)) {
                updateIn1Visualisation(cuttingCurve.id, {back: true});
                updateIn2Visualisation(cuttingCurve.id, {back: true});
            }
            if(upd1.backThisTime || upd2.backThisTime) {
                pointsList.push(evaluate(ob1, u[0], v[0]));
                const ret = backNewton(pointsList, uStart, vStart, u, v, uPrev, vPrev, _alpha);
                _alpha = ret.alpha;
                pointsList = ret.pointsList;
                notFinishYet = 5;
                backed = true;
                tempAlpha = _alpha;
                break;
            }
            
        }
        uPrev = [u[0], u[1]];
        vPrev = [v[0], v[1]];

        const p1 = evaluate(ob1, u[0], v[0], true);
        const p2 = evaluate(ob2, u[1], v[1]);
        if(alphaEpsilon < getVectorLength(p2, p1)) {
            tempAlpha /= 2;
        }
        DrawPoint(p1, "Red"); 
        DrawPoint(p2, "Blue"); 
        pointsList.push(evaluate(ob1, u[0], v[0]));

        if(!iterations) {
            updateIn1Visualisation(cuttingCurve.id, u[0] / ob1.Height , v[0] / ob1.Width);
            updateIn2Visualisation(cuttingCurve.id, u[1] / ob2.Height, v[1] / ob2.Width);
        }
        if(finalEpsilon > getVectorLength(pStart, p1) && notFinishYet > 10) {
            break;
        }
        if(loops > stop) {
            break;
        }
        notFinishYet ++;
        loops ++;
    }
    if(iterations) {
        for(let i = 0; i < pointsList.length; i ++) {
            //DrawPoint(pointsList[i], "Red"); 
        }
        return;
    }
    if(!backed) {
        cuttingCurve.points.push({x: pStart.x, y: pStart.y, z: pStart.z});
    }
    for(let i = 0; i < pointsList.length; i ++) {
        cuttingCurve.points.push({x: pointsList[i].x, y: pointsList[i].y, z: pointsList[i].z});
    }
    if(!backed) {
        cuttingCurve.points.push({x: pStart.x, y: pStart.y, z: pStart.z});
        cuttingCurve.intersectionVisualization1.push({u: cuttingCurve.intersectionVisualization1[0].u, v: cuttingCurve.intersectionVisualization1[0].v});
        cuttingCurve.intersectionVisualization2.push({u: cuttingCurve.intersectionVisualization2[0].u, v: cuttingCurve.intersectionVisualization2[0].v});
    }
 }