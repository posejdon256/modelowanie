import { getVectorLength, TryParseFloat } from '../../Helpers/Helpers';
import { getcutS1, getMillState, getS6CutIt, moveMillDown } from '../../Save/GeneratePaths/FInalCut/Third';
import { getDatasOfMill } from '../../Save/GeneratePaths/Helpers/GeneratePathsHelper';
import { setVisualisationObjects } from '../Draw/RedrawVisualisation/RedrawVisualization';
import { addCuttingCurve, updateIn1Visualisation, updateIn2Visualisation } from './CuttingCurve';
import { evaluateOffset } from './EvaluateOffset';
import { evaluate } from './FindIntersection';
import { findNewNewtonPoint } from './Jacobi';
import { backNewton, updateUVAfterNewton } from './NewtonUpdateUV';
import { DrawPoint } from '../Draw/DrawPoints/DrawPoints';


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
    //console.clear();
    let {ob1, ob2, u, v} = best;
    let interpolation;
    let cuttingCurve;
    let _alpha = alpha;
    const _evaluate = getMillState() ? evaluateOffset : evaluate;
    //2.5 is good for legs
    // 4.5 is good for down part in half
    // 3 is good for nail and stand
    // 6 is good for down left part
    //DrawPoint(evaluate(ob2, 4, 0), "Blue"); 
    //DrawPoint(evaluate(ob1, 4, 0), "Red"); 
    if(!iterations) {
        cuttingCurve = addCuttingCurve(interpolation, ob1, ob2);
    }
    const ob = [ob1, ob2];
    const uStart = [u[0], u[1]];
    const vStart = [v[0], v[1]];
    let uPrev = [uStart[0], uStart[1]];
    let vPrev = [vStart[0], vStart[1]];
    let betterPoint;
    let backed = false;
    let pStart = _evaluate(ob[0], uStart[0], vStart[0]);
    let notFinishYet = 0;
    let loops = 0;
    const {} = getDatasOfMill();
    let crossed1, crossed2;
    let pointsList = [];
    let stop = iterations ? iterations : 2000;
    let finished = false;
    let stopped = false;
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
                if(upd1.end) {
                    addBorder(upd1.crossed, 1, cuttingCurve, uPrev, vPrev, ob1, ob1);
                } else if(upd2.end) {
                    addBorder(upd2.crossed, 2, cuttingCurve, uPrev, vPrev, ob2, ob1);
                }
                break;
            }
            if(!iterations && upd1.crossed !== 0 && !upd1.backThisTime) {
                crossed1 += upd1.crossed;
                addBorder(upd1.crossed, 1, cuttingCurve, uPrev, vPrev, ob1, ob1);
                updateIn1Visualisation(cuttingCurve.id, upd1.uLast / ob1.Height ,upd1.vLast / ob1.Width);
                updateIn1Visualisation(cuttingCurve.id, {break: true});
                updateIn1Visualisation(cuttingCurve.id, u[0] / ob1.Height, v[0] / ob1.Width);
            }
            if(!iterations && upd2.crossed !== 0 && !upd2.backThisTime) {
                crossed2 += upd2.crossed;
                addBorder(upd2.crossed, 2, cuttingCurve, uPrev, vPrev, ob2, ob1);
                updateIn2Visualisation(ob1, cuttingCurve.id, upd2.uLast / ob2.Height , upd2.vLast / ob2.Width, u[0], v[0], ob2.id);
                updateIn2Visualisation(ob1, cuttingCurve.id, {break: true});
                updateIn2Visualisation(ob1, cuttingCurve.id, u[1] / ob2.Height, v[1] / ob2.Width, u[0], v[0], ob2.id);
            }
            if(!iterations && (upd1.backThisTime || upd2.backThisTime)) {
                if(upd1.backThisTime) {
                    addBorder(upd1.crossed, 1, cuttingCurve, uPrev, vPrev, ob1, ob1);
                } else if(upd2.backThisTime) {
                    addBorder(upd2.crossed, 2, cuttingCurve, uPrev, vPrev, ob2, ob1);
                }
                updateIn1Visualisation(cuttingCurve.id, {back: true});
                updateIn2Visualisation(ob1, cuttingCurve.id, {back: true});
            }
            if(upd1.backThisTime || upd2.backThisTime) {
                let newP = _evaluate(ob1, u[0], v[0]);
                if(getMillState()) {
                     if(ob1.id === 3 || ob2.id === 3 || ((ob1.id === 6 || ob2.id === 6) && getS6CutIt() === 2)||  ((ob1.id === 1 || ob2.id === 1) && getcutS1()))  {
                         newP.z = -newP.z;
                     }
                    newP = moveMillDown(newP);
                   // DrawPoint(newP, "Blue");
                }
                pointsList.push(newP);
                pointsList[pointsList.length - 1].u1 = u[0];
                pointsList[pointsList.length - 1].v1 = v[0];
                pointsList[pointsList.length - 1].u2 = u[1];
                pointsList[pointsList.length - 1].v2 = v[1];
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

        const p1 = _evaluate(ob1, u[0], v[0], true);
        const p2 = _evaluate(ob2, u[1], v[1]);
        if(alphaEpsilon < getVectorLength(p2, p1)) {
            tempAlpha /= 2;
        }
       //  DrawPoint(p1, "Red"); 
        // DrawPoint(p2, "Blue"); 
        let newP = _evaluate(ob1, u[0], v[0]);
        if(getMillState()) {
            if(ob1.id === 3 || ob2.id === 3 || ((ob1.id === 6 || ob2.id === 6) && getS6CutIt() === 2)||  ((ob1.id === 1 || ob2.id === 1) && getcutS1()))  {
                newP.z = -newP.z;;
             }
            newP = moveMillDown(newP);
           // DrawPoint(newP, "Blue");
        }
        pointsList.push(newP);
        pointsList[pointsList.length - 1].u1 = u[0];
        pointsList[pointsList.length - 1].v1 = v[0];
        pointsList[pointsList.length - 1].u2 = u[1];
        pointsList[pointsList.length - 1].v2 = v[1];

        if(!iterations) {
            updateIn1Visualisation(cuttingCurve.id, u[0] / ob1.Height , v[0] / ob1.Width);
            updateIn2Visualisation(ob1, cuttingCurve.id, u[1] / ob2.Height, v[1] / ob2.Width, u[0], v[0], ob2.id);
        }
        if(finalEpsilon > getVectorLength(pStart, p1) && notFinishYet > 10) {
            // updateWrappingBeforeFinish(crossed1, 1, cuttingCurve, u, v, ob1);
            // updateWrappingBeforeFinish(crossed2, 2, cuttingCurve, u, v, ob2);
            break;
        }
        if(loops > stop) {
            stopped = true;
            break;
        }
        notFinishYet ++;
        loops ++;
    }
    if(iterations || stopped) {
        if(stopped && !iterations) {
            alert("Intersection is too large");
        }
        return;
    }
    setVisualisationObjects(ob1, ob2);
    if(!backed) {
        if(!getMillState())  cuttingCurve.points.push({x: pStart.x, y: pStart.y, z: pStart.z});
    }
    for(let i = 0; i < pointsList.length; i ++) {
        cuttingCurve.points.push({x: pointsList[i].x, y: pointsList[i].y, z: pointsList[i].z});
        cuttingCurve.u1.push(pointsList[i].u1);
        cuttingCurve.v1.push(pointsList[i].v1);
        cuttingCurve.u2.push(pointsList[i].u2);
        cuttingCurve.v2.push(pointsList[i].v2);
    }
    if(!backed) {
        cuttingCurve.points.push({x: pointsList[0].x, y: pointsList[0].y, z: pointsList[0].z});
        if(isLenghtNotToLong(cuttingCurve.intersectionVisualization1)) {
            cuttingCurve.intersectionVisualization1.push({u1: cuttingCurve.intersectionVisualization1[0].u, v1: cuttingCurve.intersectionVisualization1[0].v});
        }
        if(isLenghtNotToLong(cuttingCurve.intersectionVisualization2)) {
            cuttingCurve.intersectionVisualization2.push({u1: cuttingCurve.intersectionVisualization2[0].u, v1: cuttingCurve.intersectionVisualization2[0].v});
        }
    }
}
function isLenghtNotToLong(intersectionVisualization) {
    const len1 = intersectionVisualization[0].u - intersectionVisualization[intersectionVisualization.length - 1].u;
    const len2 = intersectionVisualization[0].v - intersectionVisualization[intersectionVisualization.length - 1].v;    
    return Math.abs(len1) < 50 && Math.abs(len2) < 50;
}
/**
 * 
 * @param {*} crossed 
 * @param {*} num 
 * @param {*} cuttingCurve 
 * @param {*} u 
 * @param {*} v 
 * @param {*} ob 
 */
function addBorder(crossed, num, cuttingCurve, u, v, ob, ob1) {
    if(crossed === -2) {
        if(num === 1) {
            updateIn1Visualisation(cuttingCurve.id, u[0] / ob.Height, 0);    
        }  else {
            updateIn2Visualisation(ob1, cuttingCurve.id, u[1] / ob.Height, 0, u[0], v[0], ob.id); 
        }  
    } else if(crossed === 2) {
        if(num === 1) {
            updateIn1Visualisation(cuttingCurve.id, u[0] / ob.Height, 0.99999);    
        }  else {
            updateIn2Visualisation(ob1, cuttingCurve.id, u[1] / ob.Height, 0.99999, u[0], v[0], ob.id); 
        } 
    } else if(crossed === -1) {
        if(num === 1) {
            updateIn1Visualisation(cuttingCurve.id, 0, v[0] / ob.Width);    
        }  else {
            updateIn2Visualisation(ob1, cuttingCurve.id, 0, v[1] / ob.Width, u[0], v[0], ob.id); 
        } 
    } else if(crossed === 1) {
        if(num === 1) {
            updateIn1Visualisation(cuttingCurve.id, 0.99999, v[0] / ob.Width);    
        }  else {
            updateIn2Visualisation(ob1, cuttingCurve.id, 0.99999, v[1] / ob.Width, u[0], v[0], ob.id); 
        }  
    }
}