import { cleanCuttingCurves } from '../../../canvas/CuttingCurve/CuttingCurve';
import { createSurface, setHeight, setWidth } from '../../../canvas/Surface/Surface';
import { createFiles, getDatasOfMill } from '../Helpers/GeneratePathsHelper';
import { createCuttingCurvesFoFlatMill } from './ParametrisationZ0';
import { trayectoryOnCurves } from './TrayectoryOnCurves';

export function researchPointsInCircle(map, x, y) {
    let ret = true;
    const rInArray = 17;
    for (let i = -rInArray; i < rInArray; i++) {
        for (let j = -rInArray; j < rInArray; j++) {
            if (Math.sqrt(Math.pow(i, 2) + Math.pow(j, 2)) < rInArray) {
                if (x + i >= 0 && y + j >= 0 && map[x + i][y + j] > 0) {
                    ret = false;
                }
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

    //start position
    points.push({ x: 0, y: 0, z: aboveDraw });

    for (let i = 0; i < map.length; i += (step)) {
        points.push({ x: (i) * size + start - 2 * r, y: start - 2 * r, z: aboveDraw });
        points.push({ x: (i) * size + start - 2 * r, y: start - 2 * r - 1, z: maxDraw });

        let j;
        for (j = 0; j < map[0].length && researchPointsInCircle(map, i, j); j++) {
            points.push({ x: (i) * size + start + r, y: (j) * size + start, z: maxDraw });
        }

        points.push({ x: (i) * size + start + r, y: (j) * size + start + 1, z: aboveDraw });
        points.push({ x: (i) * size + start + r, y: end + 2 * r, z: aboveDraw });
        points.push({ x: (i) * size + start + r, y: end + 2 * r + 1, z: maxDraw });

        for (j = map[0].length - 1; j >= 0 && researchPointsInCircle(map, i, j); j--) {
            points.push({ x: i * size + start + r, y: j * size + start, z: maxDraw });
        }
        points.push({ x: i * size + start + r, y: j * size + start, z: aboveDraw });

    }
    points.push({ x: end - r, y: start - 2 * r, z: maxDraw });
    points.push({ x: end - r, y: end, z: maxDraw });
    points.push({x: end - r + 1,y: end,z:  aboveDraw});
    points.push({x: 0,y: 0,z:  aboveDraw});

    const nextPoints = getCutPart();
    points.push({x: nextPoints.x + start, y: nextPoints.y - start, z: aboveDraw});
    points.push({x: nextPoints.x + start, y: nextPoints.y - start, z: maxDraw});
    points = points.concat(nextPoints);
    points.forEach(p => {
        p.x = - p.x;
    });
    createFiles(points, "f10");
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