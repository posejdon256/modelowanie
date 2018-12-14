import { cleanCuttingCurves, getCuttingCurves } from "../../../canvas/CuttingCurve/CuttingCurve";
import { getCutBetweenLegsConfiguration } from "./ConfigurationLastIntersection";
import { selectSurface } from "../../../canvas/Surface/Surface";
import { findObjectToIntersectionAndIntersection, setEpsilonOfFindingIntersection } from "../../../canvas/CuttingCurve/FindIntersection";
import { setCursor } from "../../../canvas/Cursor/Cursor";
import { getVectorLength, DiffPoints, SumPoints } from "../../../Helpers/Helpers";
import { addPoint } from "../../../canvas/Points/Points";
import { getCross, getDatasOfMill } from "../Helpers/GeneratePathsHelper";
import { setMillState } from "./Third";
import { setNewtonAlpa, setFinalEpsilon } from "../../../canvas/CuttingCurve/NewtonMethod";
import { DrawPoint } from "../../../canvas/Draw/DrawPoints/DrawPoints";

export function cutBetweenLegsAndTop() {
    cleanCuttingCurves();
    const sConf = getCutBetweenLegsConfiguration();
    selectSurface(sConf.id);
    setMillState(true);
    let points = [];
    for (let i = 0; i < sConf.intersections.length; i++) {
        const inter = sConf.intersections[i];
        selectSurface(inter.id);
        setCursor(inter.cursor.x, inter.cursor.y, inter.cursor.z, false);
        if (!findObjectToIntersectionAndIntersection()) {
            console.log('problem with intersecion place');
            continue;
        }
        selectSurface(inter.id);
    }
    setEpsilonOfFindingIntersection("0.001");
    setNewtonAlpa("0.002");
    setFinalEpsilon("0.01");
    setMillState(false);
    selectSurface(sConf.id);
    const curves = getCuttingCurves();
    const {aboveDraw} = getDatasOfMill();
    let ret = goOnCurveToCurve(curves[0], curves[1], 535, 536, false, true);
     let retPrevPoints = ret._points;
     points.push({x: ret._points[0].x, y:ret._points[0].y, z: aboveDraw /  100});
     points = points.concat(ret._points);

     ret = goOnCurveToCurve(curves[1], curves[0], ret.ind1, ret.ind1 + 1, true, true);
     points = points.concat(ret._points);
     points = posProcessPoints(points);

    const prepared1 = points.concat(prepareThrete(ret._points, retPrevPoints));;

    //top
    prepared1.push({x: prepared1[prepared1.length - 1].x, y: prepared1[prepared1.length - 1].y, z: aboveDraw / 100});
    ret = goOnCurveToCurve(curves[3], curves[2], 420, 419, true, true);
    const leftTopPart = ret._points.slice(ret._points.length - ret.ind1, ret._points.length);
    const topTopPart = [];
    for(let i = 0; i < leftTopPart.length; i ++) {
        topTopPart.push(curves[2].points[ret.ind1 - i]);
        topTopPart[i].z = 0;
    }
    const prepared2 = prepareTopPoints(topTopPart, leftTopPart);
    return prepared1.concat(prepared2);
}
function prepareTopPoints(top, left) {
    const ret = [];
    const {aboveDraw} = getDatasOfMill();
    ret.push({x: top[0].x, y: top[0].y, z: aboveDraw / 100});
    for(let i = 0; i < top.length; i += 2) {
        ret.push(top[i], left[top.length - i - 1]);
    }
    return ret;
}
function prepareThrete(down, others) {
    //findMinimum
    const points = [];
    down = down.reverse();
    let minX = 100;
    let maxX = -100;
    for(let i = 0; i < others.length; i ++) {
        if((others[i].y - 0.25) < 0.01 && minX > others[i].x) {
            minX = others[i].x;
        }
        if((others[i].y - 0.25) < 0.01 && maxX < others[i].x) {
            maxX = others[i].x;
        }
    }
    for(let i = 0; i < down.length; i += 4) {
        let t = (i / down.length);
        points.push({x: down[i].x, y: down[i].y, z: 0.0});
        points.push({x: t * minX + (1 - t) * maxX, y: 0.25, z: 0.0});
    }
    return points;
}
function posProcessPoints(points){
    let ret = [];
    const eps = 0.01;
    let removed = false;
    for(let i = 0; i < points.length; i ++) {
        if(points[i].y > 0.25) {
            ret.push({x: points[i].x, y: points[i].y, z: 0});
        }
    }
    for(let i = 0 ; i < ret.length; i ++) {
        addPoint(ret[i].x, ret[i].y, ret[i].z, "mill");
    }
    return ret;
}
function goOnCurveToCurve(c1, c2, ind1, ind2, derrrivativeChange, veryClose) {
    let j, i;
    const points = [];
    if(ind1 < ind2) {
        for(i = ind2; i < c1.points.length - 1; i ++) {
            addPoint(c1.points[i].x, c1.points[i].y, 0, "mill");
            const p = c1.points[i];
            p.u = c1.u1[i];
            p.v = c1.v1[i];
            p.z = 0;
            DrawPoint(c1.points[i], "Blue");
            points.push(p);
            for(j = 0; j < c2.points.length - 1; j ++) {
                if(getVectorLength(c1.points[i], c2.points[j]) < (veryClose ? 0.002 :0.02) && !derrrivativeChange && Math.abs(ind2 - i) > 5) {
                    return {_points: points, ind1: j};
                } else if(getVectorLength(c1.points[i], c2.points[j]) < (veryClose ? 0.002 :0.02)  && derrrivativeChange && Math.abs(ind2 - i) > 5) {
                    return {_points: points, ind1: j};
                }
            }
        }
    } else {
        for(i = ind2; i >= 1; i --) {
            const p = c1.points[i];
            p.u = c1.u1[i];
            p.v = c1.v1[i];
            p.z = 0;
            addPoint(c1.points[i].x, c1.points[i].y, 0, "mill");
            DrawPoint(c1.points[i], "Blue");
            points.push(p);
           // points.push(c1.points[i]);
            for(j = 0; j < c2.points.length - 1; j ++) {
                if(getVectorLength(c1.points[i], c2.points[j]) < (veryClose ? 0.003 :0.02) && Math.abs(ind2 - i) > 5) {
                    return {_points: points, ind1: j};
                }
            }
        }
    }
    console.log("problem with connection");
    return {_points: points, ind1: 0} ;
}