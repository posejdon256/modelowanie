import { setCursor } from '../../../canvas/Cursor/Cursor';
import { cleanCuttingCurves, getCuttingCurves } from '../../../canvas/CuttingCurve/CuttingCurve';
import { evaluate, findObjectToIntersectionAndIntersection } from '../../../canvas/CuttingCurve/FindIntersection';
import { RedrawVisualization } from '../../../canvas/Draw/RedrawVisualisation/RedrawVisualization';
import { getSurfaces, selectSurface } from '../../../canvas/Surface/Surface';
import { DiffPoints, SumPoints } from '../../../Helpers/Helpers';
import { createFiles, getCross, getDatasOfMill, stretchModel, updateStretChValue } from '../Helpers/GeneratePathsHelper';
import { getLastIntersectionsConfiguration } from './ConfigurationLastIntersection';
import { isIntersectionClose } from './IntersectionCollision';
import { goOnIntersection } from './GoOnIntersections';

let points = [];
let pointsFromBeforePaths = [];
let minusValue = false;
let intersectionCurves = [];
let sumCross = false;
let sumCross1 = false;
let sumCross2 = false;
let millState = false;

export function getMillState() {
    return millState;
}
export function getSummCross() {
    return {crossP1: sumCross1, crossP2: sumCross2};
}
export function generatePoints3(map) {
    millState = true;
    cleanCuttingCurves();

    const conf = getLastIntersectionsConfiguration();
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
    goOnParametrisation();
    const {aboveDraw} = getDatasOfMill();
    points = points.concat(goOnIntersection());
    // points.forEach(p => {
    //     p.x = p.x * 140;
    //     p.y = p.y * 140;
    //     p.z = p.z < 0 ? aboveDraw : (p.z + 0.2) * 100;
    // });
    // points.forEach(p => {
    //     p.x = - p.x;
    // });
    createFiles(points, "k08");
    millState = false;
    //return points;
}
function setSumCross(_sum) {
    sumCross = _sum;
}
function goOnParametrisation() {
    const curves = getCuttingCurves();
   // curves[2].back = true;
    setSumCross(false);
    //updateStretChValue(1);
    goOnSelectedParametrisation(2, curves, 60, false);
    goToBase();
   // updateStretChValue(3);
    goOnSelectedParametrisation(4, curves, 60, false);
    goToBase();

    goOnSelectedParametrisation(3, curves, 60, false);
    goToBase();

    //setSumCross(false);
    goOnSelectedParametrisation(1, curves, 60, false);
    goToBase();
    //setSumCross(true);
    goOnSelectedParametrisation(5, curves, 60, false);
    goToBase();

    goOnSelectedParametrisation(6, curves, 60, false);
    goToBase();


}
function goOnSelectedParametrisation(sId, iCurves, division, left) {
    const constantDivision = 50;
    intersectionCurves = iCurves;
    const s = getSurfaces().find(x => x.id === sId);
    if(left) {
        evalAndPush(s, 0, 0, true);
        for(let i = 0; i < s.Height - (s.Height / division); i += (s.Height / division)) {
            let j = 0;
            for(; j < s.Width; j += (s.Width / constantDivision)) {
                decideAboutIntersecion(s, i, j);
            }
            i += (s.Height / division)
            for(j = s.Width - 0.001; j >= 0; j -= (s.Width / constantDivision)) {
                decideAboutIntersecion(s, i, j);
            }
        }
    } else {
        evalAndPush(s, 0, 0, true);
        for(let i = 0; i < s.Width - (s.Width / division); i += (s.Width / division)) {
            let j = 0;
            for(; j < s.Height; j += (s.Height / constantDivision)) {
                decideAboutIntersecion(s, j, i);
            }
            i += (s.Width / division);
            for(j = s.Height - 0.001; j >= 0; j -= (s.Height / constantDivision)) {
                decideAboutIntersecion(s, j, i);
            }
        }
    }
    pointsFromBeforePaths = points.slice();
}
function decideAboutIntersecion(s, i, j) {
    if(!isIntersectionClose(stretchModel(evaluate(s, i, j)), pointsFromBeforePaths)) {
        evalAndPush(s, i, j);
    }
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
    if(newP.z >= 0) {
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
    const {r} = getDatasOfMill();
    const down = {x: 0, y: 0, z: -r / 100};
    return SumPoints(p, down);
}