import { TryParseInt } from "../../Helpers/Helpers";
import { makeSurfaceC0 } from "./SurfaceC0/SurfaaceC0";
import Redraw from "../Draw/Redraw";


let cylinder = false;
let height = 1;
let width = 1;
const surfaces = [];
let surfacesIterator = 0;

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
export function createSurface() {
    const surface = {
        name: "Powierzchnia " + surfacesIterator,
        id: surfacesIterator,
        width: width,
        height: height,
        cylinder: cylinder,
        curves: []
    }
    surfaces.push(surface);
    makeSurfaceC0(surface);
    Redraw();
}