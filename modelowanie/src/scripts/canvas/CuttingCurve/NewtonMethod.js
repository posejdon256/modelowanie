import { getVectorLength, TryParseFloat } from "../../Helpers/Helpers";
import { addPoint } from "../Points/Points";
import { evaluate } from "./FindIntersection";
import { addInterpolationCurve, setInterpolationState } from "../Bezier/Interpolation";
import { addCuttingCurve, updateIn1Visualisation, updateIn2Visualisation } from "./CuttingCurve";
import { findNewNewtonPoint } from "./Jacobi";
import { DrawPoint } from "../Draw/DrawPoints/DrawPoints";


let alpha = 0.002;
let finalEpsilon = 0.01;
export function setNewtonAlpa(_alpha) {
    alpha = TryParseFloat(_alpha, alpha);
}
export function setFinalEpsilon(_eps) {
    finalEpsilon = TryParseFloat(_eps, finalEpsilon);
}
export function goGoNewton(best, iterations) {
    let {ob1, ob2, u, v} = best;
    let interpolation;
    let cuttingCurve;
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
    let notFinishYet = 0;
    let pointsList = [];
    let pointsList2 = [];
    let stop = iterations ? iterations : 1000;
    let j1 = 0;
    const normalEps = 0.002;
    const torusEps = 0.0002;
    let w1 = ob[0].type === "C2" && ob[0].cylinder ? ob[0].height : ob[0].width;
    w1 = ob[0].type === "torus" ? 1 : w1;
    let h1 = ob[0].type === "C2" && ob[0].cylinder ? ob[0].width : ob[0].height;
    h1 = ob[0].type === "torus" ? 1 : h1;
    let w2 = ob[1].type === "C2" && ob[1].cylinder ? ob[1].height : ob[1].width;
    w2 = ob[1].type === "torus" ? 1 : w2;
    let h2 = ob[1].type === "C2" && ob[1].cylinder ? ob[1].width : ob[1].height;
    let finished = false;
    h2 = ob[1].type === "torus" ? 1 : h2;
    while(!finished) {
        for(let i = 0; i < 10; i ++) {
            try{
                betterPoint = findNewNewtonPoint(ob, uPrev, vPrev, u, v, alpha);
            } catch(e) {
                if(!iterations)
                    alert("Nie zbiega :( " + e);
                else
                    console.log("Nie zbiega :( " + e);
                return;
            }
              for(let m = 0; m < 2; m ++) {
                 betterPoint[m] = (betterPoint[m]) * normalEps;
              }
              for(let m = 2; m < 4; m ++) {
                  if(ob[1].type === "torus" && ob[0].type !== "torus") {
                        betterPoint[m] = (betterPoint[m]) * torusEps;
                  } else {
                    betterPoint[m] = (betterPoint[m]) * normalEps;
                  }
             }
            let helpU1 = u[0] - betterPoint[0];
            let helpU2 = u[1] - betterPoint[2]; 
            let helpV1 = v[0] - betterPoint[1];
            let helpV2 = v[1] - betterPoint[3]; 
            if((notInRange([helpU1, helpU2], [helpV1, helpV2], ob)) ||
            (notInVRange(helpU1, ob[0]) && ob[0].cylinder && ob[0].type === "C2") ||
            (notInVRange(helpU2, ob[1]) && ob[1].cylinder && ob[1].type === "C2") ||
            (notInVRange(helpV1, ob[0]) && ob[0].cylinder && ob[0].type === "C0") ||
            (notInVRange(helpV2, ob[1]) && ob[1].cylinder && ob[1].type === "C0")) {
                    alpha = -alpha;  
                    if(!backed)    
                        notFinishYet = 0;
                    else {
                        finished = true;
                        break;
                    }   
                    u = [uStart[0], uStart[1]];
                    v = [vStart[0], vStart[1]];
                    uPrev = [uStart[0], uStart[1]];
                    vPrev = [vStart[0], vStart[1]];
                    if(!iterations) {
                        // updateIn1Visualisation(cuttingCurve.id, {break: true});
                        // updateIn2Visualisation(cuttingCurve.id, {break: true});
                    }
                    pointsList = pointsList.reverse();
                    pointsList2 = pointsList2.reverse();

                    pointsList.push(evaluate(ob1, u[0], v[0]));
                    backed = true; 
                    continue;
            }
            u = [helpU1 , helpU2];
            v = [helpV1, helpV2];

        }
        if(!iterations && decideIfAddBreak(ob[0], uPrev[0], vPrev[0], u[0], v[0])) {
            updateIn1Visualisation(cuttingCurve.id, {break: true});
        }
        if(!iterations && decideIfAddBreak(ob[1], uPrev[1], vPrev[1], u[1], v[1])) {
            updateIn2Visualisation(cuttingCurve.id, {break: true});
        }
        if(ob[0].type === "torus") {
            u[0] = u[0] < 0 ? 0.999 : u[0];
            v[0] = v[0] < 0 ? 0.999 : v[0];
            u[0] = u[0] >= 1 ? 0 : u[0];
            v[0] = v[0] >= 1 ? 0 : v[0];
        }
        if(ob[1].type === "torus") {
            u[1] = u[1] < 0 ? 0.999 : u[1];
            v[1] = v[1] < 0 ? 0.999 : v[1];
            u[1] = u[1] >= 1 ? 0 : u[1];
            v[1] = v[1] >= 1 ? 0 : v[1];
           // updateIn2Visualisation(cuttingCurve.id, {break: true});
        }
        // if(ob[0].type === "C0" && ob[0].cylinder) {
        //     v[0] = v[0] < 0 ? ob[0].height - 0.001 : v[0];
        //     v[0] = v[0] >= ob[0].height ? 0 : v[0];
        // }
        // if(ob[1].type === "C0" && ob[1].cylinder) {
        //     v[1] = v[1] < 0 ? ob[1].height - 0.001 : v[1];
        //     v[1] = v[1] >= ob[1].height ? 0 : v[1];
        //    // updateIn2Visualisation(cuttingCurve.id, {break: true});
        // }
        uPrev = [u[0], u[1]];
        vPrev = [v[0], v[1]];
        const p1 = evaluate(ob1, u[0], v[0]);
        pointsList.push(evaluate(ob1, u[0], v[0]));
        pointsList2.push(evaluate(ob2, u[1], v[1]));
        if(!iterations) {
            updateIn1Visualisation(cuttingCurve.id, u[0] / w1, v[0] / h1);
            updateIn2Visualisation(cuttingCurve.id, u[1] / w2, v[1] / h2);
        }
        if(finalEpsilon > getVectorLength(pStart, p1) && notFinishYet > 20) {
            break;
        }
        if(j1 > stop) {
            break;
        }
        notFinishYet ++;
        j1 ++;
    }
    if(iterations) {
        for(let i = 0; i < pointsList.length; i ++) {
            DrawPoint(pointsList[i], "Red");
            DrawPoint(pointsList2[i], "Blue");    
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
    }
 }
 function notInRange(u, v, ob) {
     let ret = false;
     if(ob[0].type !== "torus" && !ob[0].cylinder) {
         ret = u[0] < 0 || v[0] < 0 || u[0] >= ob[0].width || v[0] >= ob[0].height;
     }
     if(ob[1].type !== "torus" && !ob[1].cylinder) {
         ret = ret ||  u[1] < 0 || v[1] < 0 || u[1] >= ob[1].width || v[1] >= ob[1].height;
     }
     return ret;
 }
 function notInURange(u, ob) {
    return (u < 0 || u >= ob.width);
 }
 function notInVRange(v, ob) {
    return (v < 0|| v >= ob.height);
 }
 function decideIfAddBreak(ob, uPrev, vPrev, u, v) {
     let ret = false;
    //  if(ob.type === "torus" && (Math.floor(uPrev) !== Math.floor(u) || Math.floor(vPrev) !== Math.floor(v))) {
    //      ret = true;
    if(ob.type === "torus") {
        if(u < 0 || v < 0 || u >= 1 || v >= 1)
            ret = true;
    }
     else if(ob.type === "C2" && ob.cylinder && v % ob.width !== vPrev % ob.width){
        ret = true;
     } else if(ob.type === "C0" && ob.cylinder) {
        if( v < 0 || v >= ob.width)
            ret = true;
     }
     return ret;
 }