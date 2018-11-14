import { cleanCuttingCurves, getCuttingCurves } from "../../../canvas/CuttingCurve/CuttingCurve";
import { getLastIntersectionsConfiguration } from "./ConfigurationLastIntersection";
import { RedrawVisualization } from "../../../canvas/Draw/RedrawVisualisation/RedrawVisualization";
import { selectSurface, getSurfaces } from "../../../canvas/Surface/Surface";
import { setCursor } from "../../../canvas/Cursor/Cursor";
import { findObjectToIntersectionAndIntersection, evaluate } from "../../../canvas/CuttingCurve/FindIntersection";
import { getCross, createFiles, getDatasOfMill } from "../Helpers/GeneratePathsHelper";
import { SumPoints, DiffPoints } from "../../../Helpers/Helpers";
import { isIntersectionClose } from "./IntersectionCollision";

const points = [];
let minusValue = false;
let intersectionCurves = [];
let sumCross = false;
export function generatePoints3(map) {
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
    points.forEach(p => {
        p.x = p.x * 140;
        p.y = p.y * 140;
        p.z = p.z < 0 ? aboveDraw : (p.z + 0.2) * 100;
    });
    points.forEach(p => {
        p.x = - p.x;
    });
    createFiles(points, "k08");
    //return points;
}
function setSumCross(_sum) {
    sumCross = _sum;
}
function goOnParametrisation() {
    const curves = getCuttingCurves();
   // curves[2].back = true;
    setSumCross(false);
    goOnSelectedParametrisation(2, curves, 40, false);
    goToBase();
    goOnSelectedParametrisation(4, curves, 40, false);
    goToBase();
    goOnSelectedParametrisation(3, curves, 40, false);
    goToBase();
    setSumCross(true);
    goOnSelectedParametrisation(5, curves, 40, false);
    goToBase();
    setSumCross(false);
    goOnSelectedParametrisation(1, curves, 40, false);
    goToBase();
    goOnSelectedParametrisation(6, curves, 40, false);


}
function goOnSelectedParametrisation(sId, iCurves, division, left) {
    const constantDivision = 50;
    intersectionCurves = iCurves;
    const s = getSurfaces().find(x => x.id === sId);
    if(left) {
        for(let i = 0; i < s.Height - (s.Height / division); i += (s.Height / division)) {
            let j = 0;
            for(; j < s.Width; j += (s.Width / constantDivision)) {
                if(!decideAboutIntersecion(s, i, j)) break;
            }
            i += (s.Height / division)
            j = Math.max(0, j - (s.Width / constantDivision));
            evalAndPush(s, i, j);
            for(; j >= 0; j -= (s.Width / constantDivision)) {
                if(!decideAboutIntersecion(s, i, j)) break;
            }
        }
    } else {
        for(let i = 0; i < s.Width - (s.Width / division); i += (s.Width / division)) {
            let j = 0;
            for(; j < s.Height; j += (s.Height / constantDivision)) {
                if(!decideAboutIntersecion(s, j, i)) break;
            }
            i += (s.Width / division);
            j = Math.max(0, j - (s.Height / constantDivision));
            evalAndPush(s, j, i);
            for(; j >= 0; j -= (s.Height / constantDivision)) {
                if(!decideAboutIntersecion(s, j, i)) break;
            }
        }
    }
}
function decideAboutIntersecion(s, i, j) {
    if(points.length < 1) {
        evalAndPush(s, i, j);
        return true;
    }
    const isClose = isIntersectionClose(points[points.length - 1], intersectionCurves);
    if(isClose === 0) {
        evalAndPush(s, i, j);
        return true;
    } if(isClose === 1) {
        evalAndPush(s, i, j, true);
        return true;
    } else {
        return false;
    }
}
function evalAndPush(s, i, j, up) {
    const p = evaluate(s, i, j);
    const cross = getCross(s, i, j);
    let newP;
    if(sumCross) {
        newP = SumPoints(p, cross);
    } else {
        newP = DiffPoints(p, cross);
    }
    const UpP = {x: newP.x, y: newP.y, z: 0.6};
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