import { TryParseInt } from "../../Helpers/Helpers";
import { makeSurfaceC0 } from "./SurfaceC0/SurfaaceC0";
import Redraw from "../Draw/Redraw";
import { removePoint } from "../Points/Points";
import { removeCurve } from "../Bezier/Curve";


let cylinder = false;
let height = 1;
let width = 1;
const surfaces = [];
let surfacesIterator = 0;
let gridX = 4;
let gridY = 4;
let addingSurface = false;
export function getSurfaces() {
    return surfaces;
}
export function setCylinder(_cylinder) {
    cylinder = _cylinder;
}
export function setHeight(_height) {
    height = TryParseInt(_height, height)
}
export function setWidth(_width) {
    width = TryParseInt(_width, width);
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
        for(let j = 0; j < surface.curves[i].points.length; j ++) {
            surface.curves[i].points[j].surface = false;
            removePoint(surface.curves[i].points[j].id);
        }
        removeCurve(surface.curves[i].id);
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
export function createSurface() {
    addingSurface = true;
    const surface = {
        name: "Powierzchnia " + surfacesIterator,
        id: surfacesIterator,
        width: width,
        height: height,
        cylinder: cylinder,
        curves: [],
        px: gridX,
        py: gridY
    }
    surfacesIterator ++;
    surfaces.push(surface);
    makeSurfaceC0(surface);
    addingSurface = false;
    Redraw();
}