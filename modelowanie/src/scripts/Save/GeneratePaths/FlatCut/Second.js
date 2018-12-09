import { cleanCuttingCurves } from '../../../canvas/CuttingCurve/CuttingCurve';
import { createSurface, setHeight, setWidth } from '../../../canvas/Surface/Surface';
import { createFiles, getDatasOfMill } from '../Helpers/GeneratePathsHelper';
import { createCuttingCurvesFoFlatMill } from './ParametrisationZ0';
import { trayectoryOnCurves } from './TrayectoryOnCurves';
import { postProcessFirstPaths } from '../RoughCut/First';

export function researchPointsInCircle(map, x, y) {
    let ret = true;
    const rInArray = 35;
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
    const step = 8 * 2;
    const wid = 500;
    const width = 140;
    //start position
    points.push({ x: 0, y: 0, z: aboveDraw });
    points.push({ x: start - 2 * r, y: map[0][0].y * width, z: aboveDraw });

    for (let i = 0; i < map.length; i += step) {
        points.push({ x: start - 2 * r, y: map[0][i].y * width, z: maxDraw });
        points.push({ x: start - 2 * r - 1, y: map[0][i].y *width, z: maxDraw });

        let j;
        j = goRight(points, i, 0, map, width);
        let lastJ = Math.min(j, wid - 1);
        i += step;
        if(i >= map.length) break;
        while(researchPointsInCircle(map, j, i) && j <= map.length) j ++;
        while(!researchPointsInCircle(map, j, i) && j >= 0) j --;
        let blocked = false;
        for(let k = j; k >= 0; k --) {
            if(!researchPointsInCircle(map, k, i)) {
                blocked = true;
                break;
            }
        }
        j = Math.min(j, wid - 1);
        if(blocked) {
            i -= step;
            points.push({ x: map[lastJ][i].x * width, y: map[lastJ][i].y * width, z: aboveDraw });
            continue;
        }
        for (; j >= 0; j--) {
            points.push({ x: map[j][i].x * width, y: map[j][i].y * width, z: maxDraw });
        }
    }
    goToBase(points);
    points.push({ x: end + 2 * r, y: map[map.length - 1][0].y * width, z: aboveDraw });
     for (let i = 0; i < map.length; i += step) {
         points.push({ x: end + 2 * r, y: map[map.length - 1][i].y * width, z: maxDraw });
         points.push({ x: end + 2 * r + 1, y: map[map.length - 1][i].y *width, z: maxDraw });

         let j = goLeft(points, i, map[0].length - 1, map, width);
         let lastJ = Math.min(j, wid - 1);
         i += step;
         if(i >= map.length) break;
         while(researchPointsInCircle(map, j, i) && j >= 0) j --;
         while(!researchPointsInCircle(map, j, i) && j < map.length) j ++;
         let blocked = false;
         for(let k = j; k < map.length; k ++) {
             if(!researchPointsInCircle(map, k, i)) {
                 blocked = true;
                 break;
             }
         }
         j = Math.min(j, wid - 1);
         if(blocked) {
             i -= step;
             points.push({ x: map[lastJ][i].x * width, y: map[lastJ][i].y * width, z: aboveDraw });
             continue;
         }
         for (; j < map.length; j++) {
             points.push({ x: map[j][i].x * width, y: map[j][i].y * width, z: maxDraw });
         }
    }
    goToBase(points);
    removeRelicts(map, points, start);
    points.push({x: points[points.length - 1].x - 1, y: points[points.length - 1].y, z: aboveDraw});
    points.push({x: 0, y: 0, z: aboveDraw});

    const nextPoints = getCutPart();
    points = postProcessSecondPaths(points);
    points = points.concat(nextPoints);
    points.push({x: nextPoints[nextPoints.length - 1].x - 0.01, y: nextPoints[nextPoints.length - 1].y, z: aboveDraw});
    points.push({x: 0, y: 0, z: aboveDraw});



    points.forEach(p => {
        p.x = - p.x;
    });
    createFiles(points, "f10");
}
function removeRelicts(map, points, start) {
    const width = 140;
    const {maxDraw, r, aboveDraw} = getDatasOfMill();

    points.push({x: map[0][0].x * width - 2 * r, y: map[0][0].y * width - r, z: aboveDraw});
    points.push({x: map[0][0].x * width - 2 * r, y: map[0][0].y * width - r, z: maxDraw});
    points.push({x: map[60][0].x * width + 2 * r, y: map[0][0].y * width -  r, z: maxDraw});
    points.push({x: map[60][0].x * width + 2 * r, y: map[0][0].y * width -  r, z: aboveDraw});

    points.push({x: map[499][0].x * width + 2 * r, y: map[0][0].y * width -  r, z: aboveDraw});
    points.push({x: map[499][0].x * width + 2 * r, y: map[0][0].y * width -  r, z: maxDraw});
    points.push({x: map[420][0].x * width, y: map[0][0].y * width -  r, z: maxDraw});
    points.push({x: map[420][0].x * width, y: map[0][0].y * width -  r, z: aboveDraw});

    points.push({x: map[499][499].x * width + 2 * r, y: map[499][499].y * width +  2 * r, z: aboveDraw});
    points.push({x: map[499][499].x * width + 2 * r, y: map[499][499].y * width +  2 * r, z: maxDraw});
    points.push({x: map[499][499].x * width + 2 * r, y: map[499][499].y * width +  r, z: maxDraw});
    points.push({x: map[420][499].x * width + 2 * r, y: map[420][499].y * width +  r, z: maxDraw});
    points.push({x: map[420][499].x * width + 2 * r, y: map[420][499].y * width +  r, z: aboveDraw});

    points.push({x: map[0][499].x * width - 2 * r, y: map[0][499].y * width +  2 * r, z: aboveDraw});
    points.push({x: map[0][499].x * width - 2 * r, y: map[0][499].y * width +  2 * r, z: maxDraw});
    points.push({x: map[0][499].x * width - 2 * r, y: map[0][499].y * width +  r, z: maxDraw});
    points.push({x: map[50][499].x * width - 2 * r, y: map[50][499].y * width +  r, z: maxDraw});
    points.push({x: map[50][499].x * width - 2 * r, y: map[50][499].y * width +  r, z: aboveDraw});

    points.push({x: map[499][300].x * width + 2 * r, y: map[499][300].y * width +  r, z: aboveDraw});
    points.push({x: map[499][300].x * width + 2 * r, y: map[499][300].y * width +  r, z: maxDraw});
    points.push({x: map[290][380].x * width + 2 * r, y: map[290][380].y * width +  r, z: maxDraw});
    points.push({x: map[290][380].x * width + 2 * r, y: map[290][380].y * width +  r, z: aboveDraw});
}
function goRight(points, i, j, map, width) {
    const { maxDraw } = getDatasOfMill();
    for (; j < map[0].length && researchPointsInCircle(map, j, i); j++) {
        points.push({ x: map[j][i].x * width, y: map[j][i].y * width, z: maxDraw });
    }
    return j;
}
function goLeft(points, i, j, map, width) {
    const { maxDraw } = getDatasOfMill();
    for (; j >= 0 && researchPointsInCircle(map, j, i); j--) {
        points.push({ x: map[j][i].x * width, y: map[j][i].y * width, z: maxDraw });
    }
    return j;
}
function goToBase(points) {
    const l = points.length - 1;
    //const {aboveDraw} = getDatasOfMill();
    points.push({x: points[l].x, y: points[l].y, z: 0.6 * 100});
    points.push({x: 0, y: 0, z: 0.6 * 100});
}
function getCutPart() {

    //add surface z = 0

    createCuttingCurvesFoFlatMill();
    const points = trayectoryOnCurves();
    const {maxDraw, aboveDraw } = getDatasOfMill();
    points.forEach(p => {
        p.x = p.x * 140;
        p.y = p.y * 140;
        p.z = maxDraw;
    });
    points[0].z = aboveDraw;
    return points;
}
function postProcessSecondPaths(points) {
    const postProcessedPoints = [];
    let same = false;
    let firstSame = points[0];
    for(let i = 0; i < points.length; i ++) {
        if(i === 0) {
            postProcessedPoints.push(points[i]);
        } else if(!areSame(points[i], points[i - 1], firstSame)) {
            if(same) {
                postProcessedPoints.push(points[i - 1]);
            }
            postProcessedPoints.push(points[i]);
            firstSame = points[i];
            same = false
        }
        else {
            same = true;
        }
    }
    return postProcessedPoints;
}
function areSame(p1, p2, firstSame) {
    return Math.abs(p1.y - firstSame.y) < 2 && p1.z === p2.z;
}