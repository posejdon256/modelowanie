import { TryParseInt, TryParseFloat2, TryParseFloat, DiffPoints, MultiplyPoint } from "../../Helpers/Helpers";
import { makeSurfaceC0 } from "./SurfaceC0/SurfaaceC0";
import Redraw from "../Draw/Redraw";
import { removePoint, addPoint } from "../Points/Points";
import { removeCurveWithourRedraw } from "../Bezier/Curve";
import { turnOffAllStates } from "../StatesCenter/StatesCenter";
import { makeSurfaceC2 } from "./SurfaceC2/SurfaceC2";
import { addBezierCurve } from "../Bezier/Bezier";
import { addBsplineCurve, rebuildVirtualPoints } from "../Bezier/BSpline";
import { updateCursor } from "../Cursor/Cursor";
import { CatchPoint, RemoveCatchPoint } from "../Move/MoveCursor";
import { getGrzegorzys } from "../Gregory/Gregory";
import { deCastiljau, deCastiljau3 } from "../Bezier/DeCastiljau";


let cylinder = false;
let height = 1;
let width = 1;
let surfaces = [];
let surfacesIterator = 1;
let gridX = 4;
let gridY = 4;
let addingSurface = false;
let direction = 0; // 0 - X, 1 - Y, 2 - Z
let absoluteWidth = 0.05;
let absoluteHeight = 0.05;
export function setAbsoluteWidth(_width) {
    const _absoluteWidth = TryParseFloat2(_width);
    if(_absoluteWidth !== undefined) {
        absoluteWidth = 0.01 * _absoluteWidth;
    }
}
export function setAbsoluteHeight(_height) {
    const _absoluteHeight = TryParseFloat2(_height);
    if(_absoluteHeight !== undefined) {
        absoluteHeight = 0.01 * _absoluteHeight;
    }
}
export function getSurfaces(type) {
    switch (type) {
        case "C0":
            return surfaces.filter(x => x.type === "C0");
        case "C2":
            return surfaces.filter(x => x.type === "C2");
        default:
            return surfaces;
    }
}
export function setCylinderDirection(dir) {
    switch (dir) {
        case 'X':
            direction = 2;
            break;
        case 'Y':
            direction = 1;
            break;
        case 'Z':
            direction = 0;
            break;
        default:
            break;
    }
}
export function setCylinder(_cylinder) {
    cylinder = _cylinder;
}
export function setHeight(_height) {
    height = TryParseFloat(_height, height)
}
export function setWidth(_width) {
    width = TryParseFloat(_width, width);
}
export function getAddingSurfaceState() {
    return addingSurface;
}
export function setAddingSurfaceState(state) {
    addingSurface = state;
}
export function removeSurface(id) {
    const surface = surfaces.find(x => x.id === id);
    for(let i = 0; i < surface.curves.length; i ++) {
        if(surface.type === "C0") {
            for(let j = 0; j < surface.curves[i].points.length; j ++) {
                    surface.curves[i].points[j].surface = false;
                    removePoint(surface.curves[i].points[j].id);
            }
        } else {
            for(let j = 0; j < surface.curves[i].pointsBspline.length; j ++) {
                surface.curves[i].pointsBspline[j].surface = false;
                removePoint(surface.curves[i].pointsBspline[j].id);
            }
        }
        removeCurveWithourRedraw(surface.curves[i].id);
    }
    for(let i = 0; i < surfaces.length; i ++) {
        if(surface.id === surfaces[i].id) {
            surfaces.splice(i, 1);
            break;
        }
    }
    Redraw();
    return surfaces;
}
export function selectSurface(id) {
    const surface = surfaces.find(x => x.id === id);
    surface.selected = !surface.selected;
    surface.curves.forEach(curve => {
        curve.points.forEach(point => {
            point.selected = surface.selected;
            if(surface.selected === true) {
                CatchPoint(point);
            } else {
                RemoveCatchPoint(point);
            }
        });
        if(curve.pointsBspline) {
            curve.pointsBspline.forEach(point => {
                point.selected = surface.selected;
                if(surface.selected === true) {
                    CatchPoint(point);
                } else {
                    RemoveCatchPoint(point);
                }
            });
        }
    });
    if(surface)
    return surfaces;
}
export function setGridX(_gridX) {
    gridX = TryParseInt(_gridX,gridX);
}
export function setGridY(_gridY) {
    gridY = TryParseInt(_gridY, gridY);
}
export function updateSelectedCurveGrid() {
    const _surfaces = surfaces.filter(x => x.selected === true);
    const gregs = getGrzegorzys().filter(x => x.selected === true);
    for(let i = 0; i < _surfaces.length; i ++) {
        _surfaces[i].px = gridX;
        _surfaces[i].py = gridY;
    }
    for(let i = 0; i < gregs.length; i ++) {
        gregs[i].u = gridX;
        gregs[i].v = gridY;
    }
    Redraw();
}
export function turnOnSurfaceChain(id) {
    const surface = surfaces.find(x => x.id === id);
    surface.chain = !surface.chain;
    for(let i = 0; i < surface.curves.length; i ++) {
        surface.curves[i].chain = surface.chain;
    }
    Redraw();
    return surfaces;
}
export function updateSurfaceName(id, name) {
    const surface = surfaces.find(x => x.id === id);
    surface.name = name;
    return surfaces;
}
export function addSurface(_width, _height, _cylinder, _u, _v, _type) {
    const surface = {
        name: "Powierzchnia " + surfacesIterator,
        id: surfacesIterator,
        width: _width,
        height: _height,
        cylinder: _cylinder,
        curves: [],
        px: _u,
        py: _v,
        type : _type,
        absoluteHeight: absoluteHeight,
        absoluteWidth: absoluteWidth,
    }
    surfacesIterator ++;
    surfaces.push(surface);
    return surface;
}
export function createSurface(type) {
    turnOffAllStates();
    addingSurface = true;
    const surface = {
        name: "Powierzchnia " + surfacesIterator,
        id: surfacesIterator,
        width: width,
        height: height,
        cylinder: cylinder,
        curves: [],
        px: gridX,
        py: gridY,
        pointsMap: [],
        direction: direction,
        type : type,
        absoluteHeight: absoluteHeight,
        absoluteWidth: absoluteWidth
    }
    surfacesIterator ++;
    surfaces.push(surface);
    if(type === "C0") {
        makeSurfaceC0(surface);
    } else {
        makeSurfaceC2(surface);
    }
    addingSurface = false;
    Redraw();
}
function makeSurface(surface) {
    for(var i = 0; i < surface.height; i ++) {
        const curve = surface.type === "C0" ? addBezierCurve({surface: true}) : addBsplineCurve({surface: true});
        for(let j = 0; j < surface.width; j ++) {
            if(surface.cylinder) {
                makeNormalStripes(j, surface);
            }
        }
    }
}
function makeNormalStripes(stripeNumber, surface) {
    const len = surface.absoluteWidth / 4;
    const d = surface.direction;
    for(let i = 0; i < 4; i ++) {
        for(let j = 0; j < 4; j ++) {
            if(stripeNumber === 0 && i === 0) {
                addPoint();
            } else {
                if(d === 0) {
                    updateCursor(len, 0, 0);
                } else if(d == 1) {
                    updateCursor(0, 0, len)
                } else {
                    updateCursor(0, len, 0);
                }
                const point = addPoint();
            }
        }
        if(d === 0) {
            updateCursor(-surface.absoluteWidth, surface.absoluteHeight / 4, 0);
        } else if(d == 1) {
            updateCursor(surface.absoluteHeight / 4, 0, -surface.absoluteWidth)
        } else {
            updateCursor(0, -surface.absoluteWidth, surface.absoluteHeight / 4);
        }
    }
}
export function EvaluateSurface(id, u, v) {
    const s = surfaces.find(x => x.id === id);
    const _u = Math.floor(v) * 3;
    const _v = Math.floor(u) * 3;
    const _u1 =  u - Math.floor(u);
    const _v1 = v - Math.floor(v) ;
    if(u < 0 ||  v < 0 || isNaN(v) || isNaN(u)) {
        console.log("Problem z evalem "+ u + " " + v);
        return {x: 1, y: 0, z: 0};
    }
    const knots = [];
    for(let i = 0; i < 4; i ++) {
        knots.push(deCastiljau(_u1, s.pointsMap[_u + i][_v + 0], s.pointsMap[_u + i][_v + 1], s.pointsMap[_u + i][_v + 2], s.pointsMap[_u + i][_v + 3]));
    }
    return deCastiljau(_v1, knots[0], knots[1], knots[2], knots[3]);
}
export function EvaluateSurfaceC2(id, u, v) {
    const s = surfaces.find(x => x.id === id);
    const _u = Math.floor(v) * 3;
    const _v = Math.floor(u) * 3;
    const _u1 =  u - Math.floor(u);
    const _v1 = v - Math.floor(v) ;
    let j;
    for(j = (s.cylinder ? s.height + 3 : s.width  + 3);
        j < s.curves.length;
        j ++) {
        rebuildVirtualPoints(s.curves[j].id);
   }
   if(u < 0 ||  v < 0 || isNaN(v) || isNaN(u)) {
    console.log("Problem z evalem "+ u + " " + v);
    return {x: 1, y: 0, z: 0};
    }   
   const map = s.pointsMap;
   const knots = [];
   for(j = 0; j < 4; j ++) {
        knots.push(deCastiljau(_u + j / 3, map[_u + 2][_v + 2].virtualPoints[0], map[_u + 2][_v + 2].virtualPoints[1], map[_u + 2][_v].virtualPoints[2], map[_u + 3][_v + 2].virtualPoints[0]));
    }
    return deCastiljau(_v1, knots[0], knots[1], knots[2], knots[3]);
}
export function EvaluateSurfaceDV(id, u, v) {
    const s = surfaces.find(x => x.id === id);
    const _u = Math.floor(v) * 3;
    const _v = Math.floor(u) * 3;
    const _u1 =  u - Math.floor(u);
    const _v1 = v - Math.floor(v) ;
    if(u < 0 ||  v < 0 || isNaN(v) || isNaN(u)) {
        alert("Problem z evalemDV");
        //console.log(_u, _v);
        return {x: 1, y: 1, z:1};
    }
    const knots = [];
    for(let i = 0; i < 4; i ++) {
        knots.push(deCastiljau(_u1, s.pointsMap[_u + i][_v + 0], s.pointsMap[_u + i][_v + 1], s.pointsMap[_u + i][_v + 2], s.pointsMap[_u + i][_v + 3]));
    }
    const derKnots = [];
    for(let i = 0; i <3; i++) {
        derKnots.push(MultiplyPoint(DiffPoints(knots[i + 1] , knots[i]), 3));
    }
    return deCastiljau3(_v1, derKnots[0], derKnots[1], derKnots[2]);
}
export function EvaluateSurfaceDU(id, u, v) {
    const s = surfaces.find(x => x.id === id);
    const _u = Math.floor(v) * 3;
    const _v = Math.floor(u) * 3;
    const _u1 =  u - Math.floor(u);
    const _v1 = v - Math.floor(v) ;
    const knots = [];
    if(u < 0 ||  v < 0 || isNaN(v) || isNaN(u)) {
        alert("Problem z evalemDU");
        //console.log(_u, _v);
        return {x: 1, y: 1, z:1};
    }
    for(let i = 0; i < 4; i ++) {
        knots.push(deCastiljau(_v1, s.pointsMap[_u + 0][_v + i], s.pointsMap[_u + 1][_v + i], s.pointsMap[_u + 2][_v + i], s.pointsMap[_u + 3][_v + i]));
    }
    const derKnots = [];
    for(let i = 0; i <3; i++) {
        derKnots.push(MultiplyPoint(DiffPoints(knots[i + 1] , knots[i]), 3));
    }
    return deCastiljau3(_u1, derKnots[0], derKnots[1], derKnots[2]);
}
export function clearSurfaces() {
    surfaces = [];
    surfacesIterator = 1;
}