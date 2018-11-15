import { createFiles, fromIndexToPlace, getDatasOfMill } from '../Helpers/GeneratePathsHelper';

function findMaximum(map, x, y) {
    let max = 0;
    for(let i = x - 20; i < x + 21 && i < map.length; i ++) {
        for(let j = y - 22; j < y + 23 && j < map[0].length; j ++) {
            if(map[i] && map[i][j]) {
                max = Math.max(max, map[i][j].z);
            }
        }
    }
    return max;
}


export function generatePoints1(map) {

    const points = [];
    const {r, drawStart, end, start, size, minDraw, aboveDraw} = getDatasOfMill();
    const step = 41;
    const wid = 140;

    points.push({x: 0, y: 0, z: aboveDraw});
    points.push({x: drawStart,y: drawStart, z:  aboveDraw});

    //First part, only on 45 mm high
    for(let i = 0; i < map.length; i += (2 * step)) {
        for(let j = 0; j < map[0].length; j ++) {   
            points.push({x: map[i][j].x * wid, y: map[i][j].y * wid, z: minDraw});
        }
        for(let j = map[0].length - 1; j >= 0; j --) {
            points.push({x: map[Math.min(i + step, 499)][j].x * wid, y: map[Math.min(i + step, 499)][j].y * wid, z: minDraw});
        }
    }
    //Second part on proper hight
    points.push({x: end, y: start, z:  aboveDraw});
    points.push({x: drawStart, y: drawStart, z:  aboveDraw});

    for(let i = 0; i < map.length; i += (2 * step)) {
        for(let j = 0; j < map[0].length; j ++) {
            points.push({x: map[i][j].x * wid, y: map[i][j].y * wid, z: (findMaximum(map, i, j) + 0.2) * 100});
        }
        for(let j = map[0].length - 1; j >= 0; j --) {
            points.push({x: map[Math.min(i + step, 499)][j].x * wid, y: map[Math.min(i + step, 499)][j].y * wid, z: (findMaximum(map, i + step, j) + 0.2) * 100});
        }
    }

    //Cut things that was not cutted on the start
    // points.push({x: start, y: start, z:  (0.3) * 100});
    // points.push({x: start, y: end, z:  (0.3) * 100});
    // points.push({x: start +  r, y: start, z:  (0.3) * 100});
    // points.push({x: start +  r, y: end, z:  (0.3) * 100});
    // points.push({x: start, y: end, z:  aboveDraw});
    points.push({x: points[points.length - 1].x, y: points[points.length - 1].y, z:  aboveDraw});
    points.push({x: 0, y: 0, z:  aboveDraw});

    points.forEach(p => {
        p.x = - p.x;
    });
    createFiles(points, "k16");
}