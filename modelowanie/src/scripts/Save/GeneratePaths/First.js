import { createFiles, xFromIndexToPlace, fromIndexToPlace } from "./GeneratePaths";

function findMaximum(map, x, y) {
    let max = 0;
    for(let i = x; i < x + 41 && i < map.length; i ++) {
        for(let j = y; j < y + 55 && j < map[0].length; j ++) {
            max = Math.max(max, map[i][j]);
        }
    }
    return max;
}

export function generatePoints1(map) {
    const points = [];
    const r = 8;
    const half = 70;
    const xShift = 30;
    const yShift = 10;
    const step = 41;
    const multi = 140 / map[0].length;
    const start = -75;
    const end = 75;
    points.push({
        x: 0,
        y: 0,
        z:  (0.6) * 100
    });
    points.push({
        x: -half,
        y: -half,
        z:  (0.6) * 100
    });
    for(let i = 0; i < map.length; i += (2 * step)) {
        for(let j = 0; j < map[0].length; j ++) {
            points.push({
                x: fromIndexToPlace(map, i, r),
                y: fromIndexToPlace(map, j, 0),
                z: 0.45 * 100 + 3
            });
        }
        for(let j = map[0].length - 1; j >= 0; j --) {
            points.push({
                x: fromIndexToPlace(map, i + step, r),
                y: fromIndexToPlace(map, j, 0),
                z: 0.45 * 100 + 3
            });
        }
    }
    points.push({
        x: end,
        y: start,
        z:  (0.6) * 100
    });
    points.push({
        x: -half,
        y: -half,
        z:  (0.6) * 100
    });
    for(let i = 0; i < map.length; i += (2 * step)) {
        for(let j = 0; j < map[0].length; j ++) {
            points.push({
                x: (i) * multi - half + r,
                y: (j) * multi - half,
                z: (findMaximum(map, i, j) + 0.2) * 100 + 3
            });
        }
        for(let j = map[0].length - 1; j >= 0; j --) {
            points.push({
                x: (i + step) * multi - half + r,
                y: (j) * multi - half,
                z: (findMaximum(map, i + step, j) + 0.2) * 100 + 3
            });
        }
    }
    points.push({
        x: start,
        y: start,
        z:  (0.3) * 100
    });
    points.push({
        x: start,
        y: end,
        z:  (0.3) * 100 
    });
    points.push({
        x: start +  r,
        y: start,
        z:  (0.3) * 100
    });
    points.push({
        x: start +  r,
        y: end,
        z:  (0.3) * 100
    });
    points.push({
        x: start,
        y: end,
        z:  (0.6) * 100
    });
    points.push({
        x: 0,
        y: 0,
        z:  (0.6) * 100
    });
    points.forEach(p => {
        p.x = - p.x;
    });
    const postProcessedPoints=[];
    postProcessedPoints.push(points[0]);
    for(let i = 1; i < points.length; i ++) {
        if(points[i].x !== points[i - 1].x 
            || points[i].y !== points[i - 1].y
            || points[i].z !== points[i - 1].z) {
                postProcessedPoints.push(points[i]);
            }
    }
    createFiles(postProcessedPoints, "k16");
}