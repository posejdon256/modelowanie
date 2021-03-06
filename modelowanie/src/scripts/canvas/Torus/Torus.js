
import Redraw from "../Draw/Redraw";
import { getCursor } from "../Cursor/Cursor";


let toruses = [];
let torusesCounter = 0;
let gX = 50;
let gY = 50;

export function cleanToruses() {
    toruses = [];
}
/**
 * Tworzy tablice z wierzchołkami torusa
 */
export function addTorus(_r, _R, _gridX, _gridY, _center, _rotation, _scale) {
    const center =_center ? _center : getCursor();
    const rotation =_rotation ? _rotation : {x: 0, y: 0, z: 0};
    const scale =_scale ? _scale : {x: 1, y: 1, z: 1};
    const torus = {
        type: "torus",
        id: torusesCounter,
        name: "Torus " + torusesCounter,
        r: _r? _r : 0.1,
        R: _R? _R : 0.5,
        gridX: _gridX ? _gridX : gX,
        gridY: _gridY ? _gridY : gY,
        WrappedU: true,
        WrappedV: true,
        center: {
            x: center.x,
            y: center.y,
            z: center.z,
        },
        rotation: {
            x: rotation.x,
            y: rotation.y,
            z: rotation.z,
        },
        scale: {
            x: scale.x,
            y: scale.y,
            z: scale.z,
        },
        selected: false,
        TorusLines: [],
        Width: 1,
        Height: 1,
        TorusVertices: []
    };
    generateTorus(torus);
    toruses.push(torus);
    torusesCounter ++;
    Redraw();
}
export function updateTorusName(id, name) {
    toruses.find(x => x.id === id).name = name;
    return toruses;
}
export function selectTorus(id) {
    const torus = toruses.find(x => x.id === id);
    torus.selected = !torus.selected;
    return toruses;
}
export function setTorusMesh(_gX, _gY) {
    gX = _gX;
    gY = _gY;
}
export function removeTorus(id) {
    for(let i = 0; i < toruses.length; i ++) {
        if(toruses[i].id === id) {
            toruses.splice(i, 1);
        }
    }
    Redraw();
    return toruses;
}
function generateTorus(torus) {
    const stepX = 6 / torus.gridX;
    const stepY = 6/ torus.gridY;
    let counter = 0;
    let howMany = 0;
    const { r, R, center } = torus;
    for(let i = 0.0; i <= 2 * Math.PI ; i += stepX) {
        howMany ++;
    }
    for(let i = 0.0; i <= 2 * Math.PI; i += stepY) {
        for(let j = 0.0; j <= 2 * Math.PI; j += stepX) {
            torus.TorusVertices.push({
                x: ((R + (r * Math.cos(j))) * Math.cos(i)) + center.x,
                y: ((R + (r * Math.cos(j))) * Math.sin(i) ) +  center.y,
                z: (r * Math.sin(j)) + center.z,
                u: i / (2 * Math.PI),
                v: j / (2 * Math.PI)
            });
            if(counter % howMany + 1 === howMany) {
                torus.TorusLines.push([counter, counter - howMany + 1])
            } else {
                torus.TorusLines.push([counter, counter + 1]);
            }
            torus.TorusLines.push([counter, counter + howMany]);
            counter ++;
        }
    }
    counter = 0;
    for(let i = 0.0; i <= 2 * Math.PI; i += stepX) {
        torus.TorusLines.push([counter, torus.TorusVertices.length - howMany + counter]);
        counter ++;
    }
}
export function getToruses() {
    return toruses;
}
export function getTorusVertices(id) {
    return toruses.find(x => x.id === id).TorusVertices;
}
export function getTorusLines(id) {
    return toruses.find(x => x.id === id).TorusLines;
}
export function cleanTrimToruses() {
    toruses.forEach(torus => {
        torus.trim = false;
    });
}
export function EvaluateTorus(id, u, v, help) {
    let _u = u * (2 * Math.PI);
    let _v = v * (2 * Math.PI);
    const t = toruses.find(x => x.id === id);
    if(help) {
        
        _u = _u * (t.r / t.R);
    }
    // x: ((R + (r * Math.cos(j))) * Math.cos(i) / (R + r)) + center.x,
    // y: ((R + (r * Math.cos(j))) * Math.sin(i) / (R + r)) +  center.y,
    // z: (r * Math.sin(j) / (R + r)) + center.z
    return {
        x: (t.R + t.r * Math.cos(_u)) * Math.cos(_v) + t.center.x,
        y: (t.R + t.r * Math.cos(_u)) * Math.sin(_v) + t.center.y,
        z: (t.r * Math.sin(_u)) + t.center.z
    };
}

export function EvaluateTorusDU(id, u, v) {
    const _u = u * (2 * Math.PI);
    let _v = v * (2 * Math.PI);
    const t = toruses.find(x => x.id === id);
    return {
        x: - t.r * Math.sin(_u) * Math.cos(_v) ,
        y: - t.r * Math.sin(_u) * Math.sin(_v),
        z: t.r * Math.cos(_u)
    };
}
export function EvaluateTorusDV(id, u, v) {
    const _u = u * (2 * Math.PI);
    const _v = v * (2 * Math.PI);
    const t = toruses.find(x => x.id === id);
    return {
        x: - Math.sin(_v) * (t.r * Math.cos(_u) + t.R),
        y: Math.cos(_v) * (t.r * Math.cos(_u) + t.R),
        z: 0
    };
}
export function EvaluateTorusNormal(id, u, v) {
    const _u = u * (2 * Math.PI);
    const _v = v * (2 * Math.PI);
    const t = toruses.find(x => x.id === id);
    return {
        x: Math.cos(_u) * Math.cos(_v) + t.center.x,
        y: Math.cos(_u) * Math.sin(_v) + t.center.y,
        z: Math.sin(_u) + t.center.z
    }
}