import { EvaluateSurface, EvaluateSurfaceC2 } from '../../canvas/Surface/EvaluateSurface';
import { getSurfaces, setHeight, setWidth, createSurface } from '../../canvas/Surface/Surface';
import { isHelicopterLoaded } from '../../Load/Load';
import { generatePoints3 } from './FInalCut/Third';
import { generatePoints2 } from './FlatCut/Second';
import { stretchModel, updateStretChValue } from './Helpers/GeneratePathsHelper';
import { createIntersectMap } from './IntersectMap';
import { generatePoints1 } from './RoughCut/First';

let generatingPaths = false;
let r = 4;
export function getMillRForPaths() {
    return r;
}
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
     const value = 6;
     setHeight((value + 1).toString());
     setWidth(value.toString());
     createSurface("C0");
    map = getZ(surfacesC2, map, EvaluateSurfaceC2);
    setR(8);
    generatePoints1(map); //DZIAŁA
    setR(5);
    generatePoints2(map); //DZIAŁA
    setR(4);
    generatePoints3();

    alert('Generated!');
    generatingPaths = false;
}
export function setR(_r) {
    r = _r;
}
function getZ(surfaces, map, evFun) {
    surfaces.forEach(s => {
        if(s.id === 2) {
            updateStretChValue(1);
        } else {
            updateStretChValue(3);
        }
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
                const p = stretchModel(evFun(s.id, iSmall, jSmall));

                if(p.z >= 0) {
                    const ind = convertSpaceToIndex(p.x, p.y, map.length, map[0].length);
                    if(map[ind.x][ind.y].z < p.z) {
                        map[ind.x][ind.y].z = p.z;
                        map[ind.x][ind.y].x = p.x;
                        map[ind.x][ind.y].y = p.y;
                    }
                }
            }
        }
    });
    return map;
}
export function convertSpaceToIndex(i, j, m, n) {
    return {
        x: Math.max(Math.min(parseInt((i + 0.5) * m, 10), m - 1), 0),
        y: Math.max(Math.min(parseInt((j + 0.5) * n, 10), n - 1), 0)
    };
}
export function convertIndexToSpace(x, y, z) {
    return {
        x: (x / 500) - 0.5,
        y: (y / 500) - 0.5,
        z: z
    };
}
function generateMap(n, m) {
    const _map = [];
    for(let i = 0; i < n; i ++) {
        _map.push([]);
        for(let j = 0; j < m; j ++) {
            const p = convertIndexToSpace(i, j, 0);
            _map[i].push(p);
        }
    }
    return _map;
}