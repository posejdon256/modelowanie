import { cleanScene } from '../../canvas/Clean/Clean';
import Redraw from '../../canvas/Draw/Redraw';
import { addPoint } from '../../canvas/Points/Points';
import { EvaluateSurface, EvaluateSurfaceC2 } from '../../canvas/Surface/EvaluateSurface';
import { getSurfaces } from '../../canvas/Surface/Surface';
import { isHelicopterLoaded } from '../../Load/Load';
import { saveToFilePaths } from '../Save';
import { createIntersectMap } from './IntersectMap';
import { generatePoints1 } from './First';
import { generatePoints2 } from './Second';

let generatingPaths = false;
export function generatePathsState() {
    return generatingPaths;
}
export function generatePaths() {
    if(!isHelicopterLoaded()) {
        alert("Load helicopter!");
        return false;
    }
    generatePaths = true;
    let map = generateMap(500, 500);

    const surfacesC0 = getSurfaces("C0");
    map = getZ(surfacesC0, map, EvaluateSurface);

    const surfacesC2 = getSurfaces("C2");
    map = getZ(surfacesC2, map, EvaluateSurfaceC2);
    generatePoints1(map);
    generatePoints2(map);
   // console.log(getPoints()); 

    alert('Generated!');
    generatingPaths = false;
}
export function createFiles(points, size) {
    let str = "";
    for(let i = 0; i < points.length; i ++) {
        //N3G01X0.000Y-98.000Z80.000
        str = str.concat(`N${i}G01X${points[i].x.toFixed(3)}Y${points[i].y.toFixed(3)}Z${points[i].z.toFixed(3)}\n`);
    }
    saveToFilePaths(str, size);
}
function getZ(surfaces, map, evFun) {
    surfaces.forEach(s => {
        const _trimMap = createIntersectMap(s.id);
        let iBig = 0;
        const width = 500;
        let jBig;
        for(let iSmall = 0; iSmall < s.Height; iSmall += (s.Height / width)) {
            iBig ++;
            iBig = Math.min(iBig, width - 1);
            jBig = 0;
            for(let jSmall = 0; jSmall < s.Width; jSmall += (s.Width / width)) {
                jBig = Math.min(jBig, width - 1);
                jBig ++;
                if(_trimMap !== undefined && _trimMap[parseInt(iBig, 10)][parseInt(jBig, 10)] === 0) {
                    continue;
                }
                const p = evFun(s.id, iSmall, jSmall)

                if(p.z >= 0) {
                    const ind = convertSpaceToIndex(p.x, p.y, map.length, map[0].length);
                    map[ind.x][ind.y] = Math.max(map[ind.x][ind.y], p.z);
                }
            }
        }
    });
    return map;
}
function convertSpaceToIndex(i, j, m, n) {
    return {
        x: Math.max(Math.min(parseInt((i + 0.48) * m, 10), m - 1), 0),
        y: Math.max(Math.min(parseInt((j + 0.48) * n, 10), n - 1), 0)
    };
}
function generateMap(n, m) {
    const _map = [];
    for(let i = 0; i < n; i ++) {
        _map.push([]);
        for(let j = 0; j < m; j ++) {
            _map[i].push(0);
        }
    }
    return _map;
}
export function fromIndexToPlace(map, x, r) {
    const multi = 140 / map[0].length;
    const start = - 75;
    return (x + r) * multi + start;
}