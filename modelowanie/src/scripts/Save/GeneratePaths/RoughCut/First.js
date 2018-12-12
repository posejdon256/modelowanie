import { createFiles, fromIndexToPlace, getDatasOfMill } from '../Helpers/GeneratePathsHelper';

function findMaximum(map, x, y, step) {
    let max = 0;
    for(let i = x - 20; i < x + 21 && i < map.length; i ++) {
        for(let j = y - 22 -  step; j < y + 23+ step && j < map[0].length; j ++) {
            if(map[i] && map[i][j]) {
                max = Math.max(max, map[i][j].z);
            }
        }
    }
    return max;
}


export function generatePoints1(map) {

    let points = [];
    const {drawStart, aboveDraw} = getDatasOfMill();

    points.push({x: 0, y: 0, z: aboveDraw});
    points.push({x: drawStart,y: drawStart, z:  aboveDraw});

    //Second part on proper hight
    addLayer(0.15, points, map);
    addLayer(0.05, points, map);
    points = postProcessFirstPaths(points);

    points.forEach(p => {
        p.x = - p.x;
    });
    createFiles(points, "k16");
}
function addLayer(shift, points, map) {
    const {drawStart, end, start, aboveDraw, r} = getDatasOfMill();
    const step = 41;
    const wid = 140;
    points.push({x: end, y: start, z:  aboveDraw});
    points.push({x: drawStart, y: drawStart, z:  aboveDraw});

    for(let i = 0; i < map.length; i += (2 * step)) {
        for(let j = 0; j < map[0].length; j += step) {
            points.push({x: map[i][j].x * wid, y: map[i][j].y * wid, z: Math.min(findMaximum(map, i, j, step) + 0.2 + shift, 0.5) * 100});
        }
        points.push({x: map[i][499].x * wid, y: map[i][499].y * wid, z: Math.min(findMaximum(map, i, 499, step) + 0.2 + shift, 0.5) * 100});
        if(i + 2 * step >= map.length) {
            break;
        }
        for(let j = map[0].length - 1; j >= 0; j -= step) {
            points.push({x: map[Math.min(i + step, 499)][j].x * wid, y: map[Math.min(i + step, 499)][j].y * wid, z: Math.min(findMaximum(map, i + step, j, step) + 0.2 + shift, 0.5) * 100});
        }
    }
    points.push({x : end + r, y: end + r, z: (0.2 + shift ) * 100});
    points.push({x : end + r, y: start - r, z: (0.2 + shift) * 100});
    points.push({x : end + r, y: start - r, z: aboveDraw});
    points.push({x: points[points.length - 1].x, y: points[points.length - 1].y, z:  aboveDraw});
    points.push({x: 0, y: 0, z:  aboveDraw});

    return points;
}
export function postProcessFirstPaths(points) {
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
    return Math.abs(p1.x - firstSame.x) < 2 && p1.z === p2.z;
}