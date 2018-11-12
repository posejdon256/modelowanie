import { createFiles } from "./GeneratePaths";

const r = 5;
export function researchPointsInCircle(map, x, y) {
    let ret = true;
    const rInArray = 17;
    for(let i = -rInArray; i < rInArray; i ++) {
        for(let j = -rInArray; j < rInArray; j ++) {
            if(Math.sqrt(Math.pow(i, 2) + Math.pow(j, 2)) < rInArray) {
                if( x + i >= 0 && y + j >= 0 && map[x + i][y + j] > 0) {
                    ret = false;
                }
            }
        }
    }
    return ret;
}

export function generatePoints2(map) {
    const points = [];
    const r = 5;
    const half = 70;
        const xShift = 30;
    const yShift = 10;
    const step = 16 * 2;
    const multi = 140 / map[0].length;
    const start = -75;
    const end = 75;
    points.push({
        x: 0,
        y: 0,
        z: 0.6 * 100
    });
    for(let i = 0; i < map.length; i += (step)) {
        points.push({
            x: (i) * multi + start - 2 * r,
            y: start - 2 * r,
            z: 0.6 * 100
        });
        points.push({
            x: (i) * multi + start - 2 * r,
            y:  start - 2 * r - 1,
            z: 0.2 * 100
        });
        let j = 0;
        for(j = 0; j < map[0].length; j ++) {
            if(!researchPointsInCircle(map, i, j)) {
                break;
            }
            points.push({
                x: (i) * multi + start + r,
                y: (j) * multi + start,
                z: 0.2 * 100
            });
        }
        points.push({
            x: (i) * multi + start + r,
            y: (j) * multi + start + 1,
            z: 0.6 *100
        });
        points.push({
            x: (i) * multi + start + r,
            y: end + 2 * r,
            z: 0.6 *100
        });
        points.push({
            x: (i) * multi + start + r,
            y: end + 2 * r + 1,
            z: 0.2 * 100
        });
        for(j = map[0].length - 1; j >= 0; j --) {
            if(!researchPointsInCircle(map, i, j)) {
                break;
            }
            points.push({
                x: i * multi + start + r,
                y: j * multi + start,
                z: 0.2 * 100
            });
        }
        points.push({
            x: i * multi + start + r,
            y: j * multi + start,
            z: 0.6 * 100
        });
        
    }
    points.push({
        x: end - r,
        y: start - 2 * r,
        z:  (0.2) * 100
    });
    points.push({
        x: end - r,
        y: end,
        z:  (0.2) * 100
    });
    points.push({
        x: end - r + 1,
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
    createFiles(postProcessedPoints, "f10");
}