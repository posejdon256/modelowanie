import { createFiles, fromIndexToPlace, getDatasOfMill } from './GeneratePaths';

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
    const {r, drawStart, end, start, size, minDraw, aboveDraw} = getDatasOfMill();
    const step = 41;

    points.push({x: 0, y: 0, z: aboveDraw});
    points.push({x: drawStart,y: drawStart, z:  aboveDraw});

    //First part, only on 45 mm high
    for(let i = 0; i < map.length; i += (2 * step)) {
        for(let j = 0; j < map[0].length; j ++) {
            points.push({x: fromIndexToPlace(i), y: fromIndexToPlace(j), z: minDraw});
        }
        for(let j = map[0].length - 1; j >= 0; j --) {
            points.push({x: fromIndexToPlace(i + step), y: fromIndexToPlace(j), z: minDraw});
        }
    }
    //Second part on proper hight
    points.push({x: end, y: start, z:  aboveDraw});
    points.push({x: drawStart, y: drawStart, z:  aboveDraw});

    for(let i = 0; i < map.length; i += (2 * step)) {
        for(let j = 0; j < map[0].length; j ++) {
            points.push({x: (i) * size + drawStart + r, y: (j) * size + drawStart, z: (findMaximum(map, i, j) + 0.2) * 100});
        }
        for(let j = map[0].length - 1; j >= 0; j --) {
            points.push({x: (i + step) * size + drawStart + r, y: (j) * size + drawStart, z: (findMaximum(map, i + step, j) + 0.2) * 100});
        }
    }

    //Cut things that was not cutted on the start
    points.push({x: start, y: start, z:  (0.3) * 100});
    points.push({x: start, y: end, z:  (0.3) * 100});
    points.push({x: start +  r, y: start, z:  (0.3) * 100});
    points.push({x: start +  r, y: end, z:  (0.3) * 100});
    points.push({x: start, y: end, z:  aboveDraw});
    points.push({x: 0, y: 0, z:  aboveDraw});

    points.forEach(p => {
        p.x = - p.x;
    });
    createFiles(points, "k16");
}