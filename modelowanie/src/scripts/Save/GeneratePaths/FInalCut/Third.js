import { setCursor } from '../../../canvas/Cursor/Cursor';
import { cleanCuttingCurves } from '../../../canvas/CuttingCurve/CuttingCurve';
import { evaluate, findObjectToIntersectionAndIntersection } from '../../../canvas/CuttingCurve/FindIntersection';
import { RedrawVisualization } from '../../../canvas/Draw/RedrawVisualisation/RedrawVisualization';
import { getSurfaces, selectSurface } from '../../../canvas/Surface/Surface';
import { DiffPoints, SumPoints } from '../../../Helpers/Helpers';
import { createFiles, getCross, getDatasOfMill, stretchModel } from '../Helpers/GeneratePathsHelper';
import { getLastIntersectionsConfiguration } from './ConfigurationLastIntersection';
import { goOnIntersection } from './GoOnIntersections';
import { isIntersectionClose, getXYZVectioLength } from './IntersectionCollision';
import { getMillRForPaths } from '../GeneratePaths';
import { addPoint } from '../../../canvas/Points/Points';
import { DrawPoint } from '../../../canvas/Draw/DrawPoints/DrawPoints';

let points = [];
let pointsFromBeforePaths = [];
let minusValue = false;
let sumCross = false;
let sumCross1 = false;
let sumCross2 = false;
let millState = false;
let isInModel = false;
let previousClose = false;
let isMillUp = false;

export function getMillState() {
    return millState;
}
export function getSummCross() {
    return {crossP1: sumCross1, crossP2: sumCross2};
}
export function generatePoints3() {
    DrawPoint(evaluate(getSurfaces().find(x => x.id === 2), 3, 2.5), "Red");
   // return [];
    const conf = getLastIntersectionsConfiguration();
    cleanCuttingCurves();
    for(let i = 0; i < conf.length; i ++ ) {
        const sConf = conf[i];
        if(!conf[i] || conf[i] === 'all') {
            continue;
        }
        selectSurface(sConf.id);
        for (let j = 0; j < sConf.intersections.length; j++) {
            const inter = sConf.intersections[j];
            sumCross1 = sConf.cross;
            sumCross2 = inter.cross;
            selectSurface(inter.id);
            setCursor(inter.cursor.x, inter.cursor.y, inter.cursor.z, false);
            if (!findObjectToIntersectionAndIntersection()) {
                console.log('problem with intersecion place');
                continue;
            }
            RedrawVisualization();
            selectSurface(inter.id);
        }
        selectSurface(sConf.id);
    }
    millState = true;
    for(let i = 0; i < conf.length; i ++ ) {
        const sConf = conf[i];
        if(!conf[i] || conf[i] === 'all') {
            continue;
        }
        selectSurface(sConf.id);
        for (let j = 0; j < sConf.intersections.length; j++) {
            const inter = sConf.intersections[j];
            sumCross1 = sConf.cross;
            sumCross2 = inter.cross;
            selectSurface(inter.id);
            setCursor(inter.cursor.x, inter.cursor.y, inter.cursor.z, false);
            if (!findObjectToIntersectionAndIntersection()) {
                console.log('problem with intersecion place');
                continue;
            }
            RedrawVisualization();
            selectSurface(inter.id);
        }
        selectSurface(sConf.id);
    }
    millState = false;
    goOnParametrisation();
    const {aboveDraw} = getDatasOfMill();
    const intersectionPoints = goOnIntersection();
    points = points.concat(intersectionPoints);
    points.forEach(p => {
         p.x = p.x * 140;
         p.y = p.y * 140;
     });
    points.forEach(p => {
         p.x = - p.x;
         p.z = p.z < 0 ? aboveDraw : (p.z + 0.2) * 100;
     });
    createFiles(points, "k08");
    //return points;
}
function setSumCross(_sum) {
    sumCross = _sum;
}
function goOnParametrisation() {
   // curves[2].back = true;
    setSumCross(false);
    const eps = 0.001;
    //updateStretChValue(1);
    isInModel = false;
    let startPoint = {u: 0, v: 2.5};
    goOnSelectedParametrisation(2, 50, startPoint);
    goToBase();

    startPoint.u = 6 - eps;
    startPoint.v = 5 - eps;
    DrawPoint(evaluate(getSurfaces().find(x => x.id === 2), 0, 0), "Blue");
    //DrawPoint(evaluate(getSurfaces().find(x => x.id === 2), 2, 1), "Red");
    goOnSelectedParametrisation(2, 50, startPoint, true);
    goToBase();

    startPoint.u = 3;
    startPoint.v = 2.5;
    DrawPoint(evaluate(getSurfaces().find(x => x.id === 2), 0, 0), "Blue");
    //DrawPoint(evaluate(getSurfaces().find(x => x.id === 2), 2, 1), "Red");
    goOnSelectedParametrisation(2, 50, startPoint, true);
    goToBase();

    // startPoint.v = 1.5;
    // isInModel = false;
    // goOnSelectedParametrisation(4, 50, startPoint, true);
    // goToBase();

    // startPoint.u = 4.7;
    // startPoint.v = 1.5;
    // goOnSelectedParametrisation(4, 50, startPoint, true);
    // goToBase();

    // startPoint.u = 7;
    // startPoint.v = 1.5;
    // goOnSelectedParametrisation(4, 50, startPoint, true);
    // goToBase();

    // startPoint.u = 0;
    // startPoint.v = 0;
    // goOnSelectedParametrisation(4, 50, startPoint);
    // goToBase();

    // // isInModel = true;
    // startPoint.u = 3;
    // goOnSelectedParametrisation(3, 50, startPoint);
    // goToBase();

    // //setSumCross(false);
    // startPoint.u = 0;
    // isInModel = false;
    // goOnSelectedParametrisation(1, 50, startPoint);
    // goToBase();

    // startPoint.u = 2;
    // startPoint.v = 0.1;
    // isInModel = false;
    // goOnSelectedParametrisation(1, 50, startPoint);
    // goToBase();
    // setSumCross(true);
    // // isInModel = true;
    // startPoint.u = 3.7;
    // startPoint.v = 0;
    // goOnSelectedParametrisation(5, 50, startPoint);
    // goToBase();
    // setSumCross(false);
    // isInModel = true;
    // startPoint.u = 2.5;
    // startPoint.v = 5 - eps;
    // goOnSelectedParametrisation(6, 50, startPoint, true);
    // goToBase();

    // startPoint.u = 2.5;
    // startPoint.v = 0;
    // goOnSelectedParametrisation(6, 50, startPoint);
    // goToBase();

    // startPoint.u = 4.5;
    // startPoint.v = 0;
    // goOnSelectedParametrisation(6, 50, startPoint);
    // goToBase();


}
function getDiff(s, j, i, division) {
    let _u = i;
    let back = j + s.Height / division >= s.Height ? true : false;
    let _v = (j +  (back ? - s.Height / division : + s.Height / division));
    let eval1 = evaluate(s, j, _u);
    let eval2 = evaluate(s, _v, _u);
    let diff = getXYZVectioLength(eval1, eval2);
    const r = getMillRForPaths();
    while(diff < r / 100) {
        back = _v + s.Height / division >= s.Height ? true : back;
        _v = _v + (back ? - s.Height / division : + s.Height / division);
        eval2 = evaluate(s, _v, _u);
        diff = getXYZVectioLength(eval1, eval2);
    }
    return Math.abs(_v - j);
}
function goOnSelectedParametrisation(sId, division, startPoint, goBack) {
    const constantDivision = 100;
    const u = startPoint.u;
    const v = startPoint.v;
    const s = getSurfaces().find(x => x.id === sId);
    evalAndPush(s, u, v, true);
    let j = u;
    if(!goBack) {
        for(let i = v; i < s.Width - (s.Width / division); i += (s.Width / division)) {
            let jDelta  = getDiff(s, Math.max(j, 0), i, constantDivision);
            j = Math.max(j + jDelta, 0);
            for(; j < s.Height; j += (s.Height / constantDivision)) {
                if(!decideAboutIntersecion(s, j, i)) break;
            }
            i += (s.Width / division);
            jDelta  = getDiff(s, Math.min(j, s.Height - 0.01), i, constantDivision);
            for(j = Math.min(j, s.Height) - jDelta; j >= 0; j -= (s.Height / constantDivision)) {
                if(!decideAboutIntersecion(s, j, i)) break;
            }
        }
    } else {
        for(let i = v; i >= 0; i -= (s.Width / division)) {
            let jDelta  = getDiff(s, Math.max(j, 0), i, constantDivision);
            j = Math.max(j + jDelta, 0);
            for(; j < s.Height; j += (s.Height / constantDivision)) {
                if(!decideAboutIntersecion(s, j, i)) break;
            }
            i -= (s.Width / division);
            if(i < 0) {
                break;
            }
            jDelta  = getDiff(s, Math.min(j, s.Height - 0.01), i, constantDivision);
            for(j = Math.min(j, s.Height) - jDelta; j >= 0; j -= (s.Height / constantDivision)) {
                if(!decideAboutIntersecion(s, j, i)) break;
            }
        }
    }
    pointsFromBeforePaths = points.slice();
}
function decideAboutIntersecion(s, i, j) {
    const interClose = isIntersectionClose(stretchModel(evaluatePointWithCross(s, i, j)), s.id);
    if(!interClose) {
        evalAndPush(s, i, j);
    }
    if(interClose) {
      return false;
    }
    return true;
}
function evaluatePointWithCross(s, i, j) {
    const p = evaluate(s, i, j);
    const cross = getCross(s, i, j);
    let newP;
    if(sumCross) {
        newP = SumPoints(p, cross);
    } else {
        newP = DiffPoints(p, cross);
    }
    newP = moveMillDown(newP);
    return newP;
}
function evalAndPush(s, i, j, up) {
    const p = stretchModel(evaluate(s, i, j));
    const cross = getCross(s, i, j);
    let newP;
    if(sumCross) {
        newP = SumPoints(p, cross);
    } else {
        newP = DiffPoints(p, cross);
    }
    const UpP = {x: newP.x, y: newP.y, z: 0.6};
    newP = moveMillDown(newP);
    if(up) {
        points.push(UpP);
        return;
    }
    if(newP.z > 0) {
        if(minusValue) {
            points.push(UpP);
            minusValue = false;
        }
        points.push(newP);
    } else {
        if(!minusValue) {
            newP.z = 0.6;
            points.push(newP);
            minusValue = true;
        }
    }
}
function goToBase() {
    const l = points.length - 1;
    //const {aboveDraw} = getDatasOfMill();
    points.push({x: points[l].x, y: points[l].y, z: 0.6});
    points.push({x: 0, y: 0, z: 0.6});
}
export function moveMillDown(p) {
    const r = getMillRForPaths();
    const down = {x: 0, y: 0, z: -r / 100};
    return SumPoints(p, down);
}