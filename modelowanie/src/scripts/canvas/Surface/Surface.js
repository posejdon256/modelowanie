import { TryParseInt, TryParseFloat2, TryParseFloat } from "../../Helpers/Helpers";
import { makeSurfaceC0 } from "./SurfaceC0/SurfaaceC0";
import Redraw from "../Draw/Redraw";
import { removePoint, addPoint } from "../Points/Points";
import { removeCurveWithourRedraw } from "../Bezier/Curve";
import { turnOffAllStates } from "../StatesCenter/StatesCenter";
import { makeSurfaceC2 } from "./SurfaceC2/SurfaceC2";
import { addBezierCurve } from "../Bezier/Bezier";
import { addBsplineCurve } from "../Bezier/BSpline";
import { updateCursor } from "../Cursor/Cursor";
import { CatchPoint, RemoveCatchPoint } from "../Move/MoveCursor";


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
    for(let i = 0; i < _surfaces.length; i ++) {
        _surfaces[i].px = gridX;
        _surfaces[i].py = gridY;
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
function makeCylinderStripes(stripeNumber, surface) {

}
export function clearSurfaces() {
    surfaces = [];
    surfacesIterator = 1;
}