import { cleanCuttingCurves } from '../../../canvas/CuttingCurve/CuttingCurve';
import { createSurface, setHeight, setWidth } from '../../../canvas/Surface/Surface';
import { createFiles, getDatasOfMill } from '../Helpers/GeneratePathsHelper';
import { createCuttingCurvesFoFlatMill } from './ParametrisationZ0';
import { trayectoryOnCurves } from './TrayectoryOnCurves';

export function researchPointsInCircle(map, x, y) {
    let ret = true;
    const rInArray = 25;
    for (let i = -rInArray; i < rInArray; i++) {
        for (let j = -rInArray; j < rInArray; j++) {
            if ( map[x + i] && map[x + i][y + j] && map[x + i][y + j].z > 0) {
                ret = false;
            }
        }
    }
    return ret;
}

export function generatePoints2(map) {

    cleanCuttingCurves();
    let points = [];
    const { r, size, start, end, aboveDraw, maxDraw } = getDatasOfMill();
    const step = 16 * 2;
    const wid = 500;
    const width = 140;
    //start position
    points.push({ x: 0, y: 0, z: aboveDraw });

    for (let i = 0; i < map.length; i += (step)) {
        points.push({ x: map[i][0].x * width, y: start - 2 * r, z: aboveDraw });
        points.push({ x: map[i][0].x * width, y: start - 2 * r - 1, z: maxDraw });

        let j;
        for (j = 0; j < map[0].length && researchPointsInCircle(map, i, j); j++) {
            points.push({ x: map[i][j].x * width, y: map[i][j].y * width, z: maxDraw });
        }
        points.push({ x: map[i][0].x * width, y: start - 2 * r - 1, z: maxDraw });

    }
    goToBase(points);
    for (let i = 0; i < map.length; i += (step)) {
        points.push({ x: map[i][map.length - 1].x * width, y: start - 2 * r, z: aboveDraw });
        points.push({ x: map[i][map.length - 1].x * width, y: start - 2 * r - 1, z: maxDraw });

        let j;
        for (j = map[0].length - 1; j >= 0 && map[0].length && researchPointsInCircle(map, i, j); j--) {
            points.push({ x: map[i][j].x * width, y: map[i][j].y * width, z: maxDraw });
        }
        points.push({ x: map[i][map.length - 1].x * width, y: start - 2 * r - 1, z: maxDraw });

    }
    goToBase(points);
    for (let i = 0; i < map.length; i += (step)) {
        points.push({ x: start - 2 * r, y: map[0][i].y * width, z: aboveDraw });
        points.push({ x: start - 2 * r - 1, y: map[0][i].y *width, z: maxDraw });

        let j;
        for (j = 0; j < map[0].length && researchPointsInCircle(map, j, i); j++) {
            points.push({ x: map[j][i].x * width, y: map[j][i].y * width, z: maxDraw });
        }
        points.push({ x: start - 2 * r - 1, y: map[0][i].y * width, z: maxDraw });
    }
    goToBase(points);
    for (let i = 0; i < map.length; i += (step)) {
        points.push({ x: end + 2 * r, y: map[map.length - 1][i].y * width, z: aboveDraw });
        points.push({ x: end + 2 * r + 1, y: map[map.length - 1][i].y *width, z: maxDraw });

        let j;
        for (j = map[0].length - 1; j >= 0 && researchPointsInCircle(map, j, i); j--) {
            points.push({ x: map[j][i].x * width, y: map[j][i].y * width, z: maxDraw });
        }
        points.push({ x: end + 2 * r + 1, y: map[map.length - 1][i].y * width, z: maxDraw });
    }

    const nextPoints = getCutPart();
    points.push({x: nextPoints.x + start, y: nextPoints.y - start, z: aboveDraw});
    points.push({x: nextPoints.x + start, y: nextPoints.y - start, z: maxDraw});
    points = points.concat(nextPoints);
    points.forEach(p => {
        p.x = - p.x;
    });
    createFiles(points, "f10");
}
function goToBase(points) {
    const l = points.length - 1;
    //const {aboveDraw} = getDatasOfMill();
    points.push({x: points[l].x, y: points[l].y, z: 0.6 * 100});
    points.push({x: 0, y: 0, z: 0.6 * 100});
}
function getCutPart() {

    //add surface z = 0
    const value = 6;
    setHeight((value + 1).toString());
    setWidth(value.toString());
    createSurface("C0");

    createCuttingCurvesFoFlatMill();
    const points = trayectoryOnCurves();
    const {maxDraw } = getDatasOfMill();
    points.forEach(p => {
        p.x = p.x * 140;
        p.y = p.y * 140;
        p.z = maxDraw;
    });
    return points;
}