import { setCursor } from '../../../canvas/Cursor/Cursor';
import { cleanCuttingCurves } from '../../../canvas/CuttingCurve/CuttingCurve';
import { evaluate, findObjectToIntersectionAndIntersection, setIntersectionStep, setEpsilonOfFindingIntersection } from '../../../canvas/CuttingCurve/FindIntersection';
import { setNewtonAlpa, setFinalEpsilon } from '../../../canvas/CuttingCurve/NewtonMethod';
import { RedrawVisualization } from '../../../canvas/Draw/RedrawVisualisation/RedrawVisualization';
import { selectSurface, getSurfaces } from '../../../canvas/Surface/Surface';
import { DiffPoints, SumPoints } from '../../../Helpers/Helpers';
import { getMillRForPaths } from '../GeneratePaths';
import { createFiles, getCross, getDatasOfMill, stretchModel } from '../Helpers/GeneratePathsHelper';
import { getLastIntersectionsConfiguration, getLastIntersectionsConfigurationMill } from './ConfigurationLastIntersection';
import { goOnIntersection } from './GoOnIntersections';
import { goOnSelectedParametrisation, prepareParametrisation, setMaxIter } from './goOnParametrisation';
import { getXYVectioLength } from './IntersectionCollision';
import { cutBetweenLegsAndTop } from './cutBetweenLegs';
import { DrawPoint } from '../../../canvas/Draw/DrawPoints/DrawPoints';
import { cutUnderProperller } from './cutUnderPropeller';

let points = [];
let pointsFromBeforePaths = [];
let minusValue = false;
let sumCross = false;
let sumCross1 = false;
let sumCross2 = false;
let millState = false;
let cutIterationsS6 = 0;
let cutS1 = false;
export function getS6CutIt() {
    return cutIterationsS6;
}
export function getcutS1() {
    return cutS1;
}
export function getMillState() {
    return millState;
}
export function setMillState(_state) {
    millState =_state;
}
export function getSummCross() {
    return {crossP1: sumCross1, crossP2: sumCross2};
}
export function generatePoints3() { //Generujemy od odwrotnej strony
    //od u = 3.3 do 3.7
    //od 0.6 do 1
   // DrawPoint(evaluate(getSurfaces().find(x => x.id === 1), 1, 2), "Red");
   // return [];
    let conf = getLastIntersectionsConfiguration();
    points = points.concat(cutBetweenLegsAndTop());
   // return [];
    goToBase();
    cleanCuttingCurves();
    millState = true;
    conf = getLastIntersectionsConfigurationMill();
    for(let i = 0; i < conf.length; i ++ ) {
        const sConf = conf[i];
        if(!conf[i] || conf[i] === 'all') {
            continue;
        }
        selectSurface(sConf.id);
        for (let j = 0; j < sConf.intersections.length; j++) {
            const inter = sConf.intersections[j];
            if(inter.id === 6) {
                cutIterationsS6 ++;
            }
            if(sConf.id === 1) {
                cutS1 = true;
            }
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
     points = points.concat(cutUnderProperller());
     points = postProcessThirdPaths();
     goToBase();
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
    let startPoint = {u: 3, v: 2.5};
    let pointsParts = preparePartsOfPoints();
    setMaxIter(5000);
      goOnSelectedParametrisation(2, 120, 300, startPoint, points, pointsParts);
      goToBase();
     
     startPoint.u = 4.7;
     startPoint.v = 2.5;
     goOnSelectedParametrisation(4, 40, 200, startPoint, points, pointsParts);
     goToBase();
     
    startPoint.u = 3;
    goOnSelectedParametrisation(3, 50, 200,  startPoint, points, pointsParts);
    goToBase();

     setSumCross(false);
     startPoint.u = 3;
     startPoint.v = 3;
    goOnSelectedParametrisation(1, 67, 200, startPoint, points, pointsParts);
    goToBase();

    setSumCross(true);
    startPoint.u = 2.5;
    startPoint.v = 3.7;
    goOnSelectedParametrisation(5, 45, 200, startPoint, points, pointsParts);
    goToBase();
    setSumCross(false);
    //startPoint.u = 3.5;
    startPoint.v = 5 - eps;
    goOnSelectedParametrisation(6, 50, 400, startPoint, points, pointsParts, undefined, 3);
    goToBase();

    startPoint.u = 3.5;
    goOnSelectedParametrisation(6, 50, 400, startPoint, points, pointsParts, 3, undefined);
    goToBase();
}
function preparePartsOfPoints() {
    setSumCross(false);
    const eps = 0.001;
    //updateStretChValue(1);
    let startPoint = {u: 3, v: 2.5};
    let pointsParts = [];
    pointsParts.push(prepareParametrisation(2, 300, 300, startPoint));

    startPoint.u = 4.7;
    startPoint.v = 2.5;
    pointsParts.push(prepareParametrisation(4, 300,300, startPoint));

    startPoint.u = 3;
    pointsParts.push(prepareParametrisation(3, 300,300, startPoint));

    startPoint.u = 3;
    startPoint.v = 3;
    pointsParts.push(prepareParametrisation(1, 300, 300, startPoint));

    setSumCross(true);
    startPoint.u = 2.5;
    startPoint.v = 3.7;
    pointsParts.push(prepareParametrisation(5, 300, 300, startPoint));
    setSumCross(false);

    startPoint.v = 5 - eps;
    pointsParts.push(prepareParametrisation(6, 300, 300, startPoint));
    return pointsParts;
}
export function evaluatePointWithCross(s, i, j) {
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
export function moveMillUp(p) {
    const r = getMillRForPaths();
    const up = {x: 0, y: 0, z: r / 100};
    return SumPoints(p, up);
}
function postProcessThirdPaths() {
    let up = false;
    const { aboveDraw } = getDatasOfMill();
    let ret = [];
    for(let i = 0; i < points.length; i ++) {
        if(isUnder(points[i]) && !up) {
            ret.push(points[i]);
            up = true;
        } else if(!isUnder(points[i]) && !up) {
            ret.push(points[i]);

        } else if(!isUnder(points[i]) && up) {
            if(getXYVectioLength(ret[ret.length - 1], points[i]) < 0.02) {
                ret.splice(ret.length - 1, 1);
            } else {
                ret.push({x: points[i-1].x, y: points[i-1].y, z: aboveDraw / 100});
                ret.push(points[i]);
            }
            up = false;
        }
    }
    return ret;
}
function isUnder(p) {
    const {aboveDraw} = getDatasOfMill();
    return p.z < 0 || p.z >= (aboveDraw / 100);
}