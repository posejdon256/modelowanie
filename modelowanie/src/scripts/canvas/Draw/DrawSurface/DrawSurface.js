import { getSurfaces } from "../../Surface/Surface";
import { getBezierPointsFromKnots } from "../../Bezier/Bezier";
import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getCanvas, drawLine } from "../Draw";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";
import { deCastiljau } from "../../Bezier/DeCastiljau";
import { getBSplinePointsFromKnots, rebuildVirtualPointsForSingleCurve } from "../../Bezier/BSpline";
import { DrawLines } from "../DrawLine/DrawLines";

let lastPointsC0 = [];
let lastPointsC2 = [];
export function cleanDrawSurfacePoints() {
    lastPointsC0 = [];
    lastPointsC2 = [];
}
export function _DrawSurfacesC0(ctx, ctxS1, ctxS2, surface) {
    const surfaces = getSurfaces("C0");
    let points = [];
    for(let i = 0; i < surfaces.length; i ++) {
        const surfacepoints = {
            points: [],
            trim: surfaces[i].trim,
            trimOptions: surfaces[i].trimOptions
        };
        const map = surfaces[i].pointsMap;
        for(let j = 0; j < map.length - 2; j += 3) {
                const n = parseInt(surfaces[i].px, 10) - 1;
                for(let m = 0; m <= n; m ++) {
                    const knots = [];
                    for(let k = 0; k < map[j].length; k ++) {
                        let point;
                        const newBezier1 = deCastiljau(m/n ,map[j][k], map[j + 1][k], map[j + 2][k], map[j + 3][k]);
                        point = {
                            x : newBezier1.x,
                            y : newBezier1.y,
                            z : newBezier1.z
                        }
                        knots.push(point);
                    }
                    surfacepoints.points = surfacepoints.points.concat(getBezierPointsFromKnots(knots, "C0"));
                }
        }
    }
    for(let i = 0; i < surfaces.length; i ++) {
        const map = surfaces[i].pointsMap;
        const surfacepoints = {
            points: [],
            trim: surfaces[i].trim,
            trimOptions: surfaces[i].trimOptions
        };
        for(let k = 0; k < map[0].length - 2; k += 3) {
                const n = parseInt(surfaces[i].py, 10) - 1;
                for(let m = 0; m <= n; m ++) {
                    const knots = [];
                    for(let j = 0; j < map.length; j ++) {
                        const newBezier1 = deCastiljau(m/n ,map[j][k], map[j][k + 1], map[j][k + 2], map[j][k + 3]);
                        const point = {
                            x : newBezier1.x,
                            y : newBezier1.y,
                            z : newBezier1.z
                        }
                        knots.push(point);
                    }
                    surfacepoints.points = surfacepoints.points.concat(getBezierPointsFromKnots(knots, "C0"));
                   // points = points.concat(getBezierPointsFromKnots(knots, "C0"));
                }
        }
        points.push(surfacepoints);
    }
    lastPointsC0 = points;
    _DrawCurveInSurface(ctx, ctxS1, ctxS2, points)
}
export function _DrawSurfacesC2(ctx, ctxS1, ctxS2){
    const surfaces = getSurfaces("C2");
    let points = [];
    var i, j, k, m;
    for(i = 0; i < surfaces.length; i ++) {
        const surfacepoints = {
            points: [],
            trim: surfaces[i].trim,
            trimOptions: surfaces[i].trimOptions
        };
        for(j = surfaces[i].Height + 3;
         j < surfaces[i].curves.length;
         j ++) {
            rebuildVirtualPointsForSingleCurve(surfaces[i].curves[j].id);
        }
        const map = surfaces[i].pointsMap;
        for(j = 2; j < map.length - 1; j += 1) {
                const n = parseInt(surfaces[i].px, 10) - 1;
                for(m = 0; m <= n; m ++) {
                    const knots = [];
                    for(k = 0; k < map[j].length; k ++) {
                        let point;
                        const newBezier1 = deCastiljau(m/n ,map[j][k].virtualPoints[0], map[j][k].virtualPoints[1], map[j][k].virtualPoints[2], map[j + 1][k].virtualPoints[0]);
                        point = {
                            x : newBezier1.x,
                            y : newBezier1.y,
                            z : newBezier1.z
                        }
                        knots.push(point);
                    }
                  //  points = points.concat(getBSplinePointsFromKnots(knots, "C2"));
                    surfacepoints.points = surfacepoints.points.concat(getBSplinePointsFromKnots(knots, "C2"));
                    knots.forEach(knot => {
                        knot.virtualPoints.forEach(vp => {
                            vp.deleted = true;
                        });
                    });
                }
            
        }
        points.push(surfacepoints);
    }
    for(i = 0; i < surfaces.length; i ++) {
        const surfacepoints = {
            points: [],
            trim: surfaces[i].trim,
            trimOptions: surfaces[i].trimOptions
        };
        for(j = 0; j < 3 + surfaces[i].Height; j ++) {
            rebuildVirtualPointsForSingleCurve(surfaces[i].curves[j].id);
        }
        const map = surfaces[i].pointsMap;
        for(k = 2; k < map[0].length - 1; k += 1) {
                const n = parseInt(surfaces[i].py, 10) - 1;
                for(m = 0; m <= n; m ++) {
                    const knots = [];
                    for(j = 0; j < map.length; j ++) {
                        const newBezier1 = deCastiljau(m/n ,map[j][k].virtualPoints[0], map[j][k].virtualPoints[1], map[j][k].virtualPoints[2], map[j][k + 1].virtualPoints[0]);
                        const point = {
                            x : newBezier1.x,
                            y : newBezier1.y,
                            z : newBezier1.z
                        }
                        knots.push(point);
                    }
                    if(surfaces[i].type === "C0") {
                        surfacepoints.points = surfacepoints.points.concat(getBezierPointsFromKnots(knots, "C2"));
                       // points = points.concat(getBezierPointsFromKnots(knots, "C2"));
                    } else {
                        surfacepoints.points = surfacepoints.points.concat(getBSplinePointsFromKnots(knots));
                       // points = points.concat(getBSplinePointsFromKnots(knots));
                    }
                    knots.forEach(knot => {
                        knot.virtualPoints.forEach(vp => {
                            vp.deleted = true;
                        });
                    });
                }
        }
        points.push(surfacepoints);
    }
    lastPointsC2 = points;
    _DrawCurveInSurface(ctx, ctxS1, ctxS2, points)
}
export function _DrawSurfaceWithoutRedraw(ctx, ctxS1, ctxS2) {
    _DrawCurveInSurface(ctx, ctxS1, ctxS2, lastPointsC0.concat(lastPointsC2));
}
export function _DrawCurveInSurface(ctx, ctxS1, ctxS2, points) {
    DrawLines(points, { r: 255, g: 0, b: 255 });
    drawChainForC2CubicFlake(ctx, ctxS1, ctxS2);
    drawChainForC0CubicFlake(ctx, ctxS1, ctxS2);
}
function drawChainForC2CubicFlake(ctx, ctxS1, ctxS2) {
    const surfaces = getSurfaces("C2");
    for(let i = 0; i < surfaces.length; i ++) {
        if(!surfaces[i].chain) {
            continue;
        }
        for(let j = 0; j < surfaces[i].pointsMap.length; j ++) {
            setTranslationPoints(surfaces[i].pointsMap[j]);
            DrawLines(surfaces[i].pointsMap[j], { r: 0, g: 0, b: 255 });
        }
        for(let m = 0; m < surfaces[i].pointsMap[0].length; m ++) {
            const _points = [];
            for(let k = 0; k <surfaces[i].pointsMap.length; k ++) {
                _points.push(surfaces[i].pointsMap[k][m]);
               // _points.push(surfaces[i].pointsMap[k][m]);
            }
            DrawLines(_points, { r: 0, g: 0, b: 255 });
        }
    }
}
function drawChainForC0CubicFlake(ctx, ctxS1, ctxS2) {
    const surfaces = getSurfaces("C0");
    for(let i = 0; i < surfaces.length; i ++) {
        if(!surfaces[i].chain) {
            continue;
        }
        for(let j = 0; j < surfaces[i].pointsMap.length; j ++) {
            setTranslationPoints(surfaces[i].pointsMap[j]);
            DrawLines(surfaces[i].pointsMap[j], { r: 0, g: 0, b: 255 });
        }
        for(let m = 0; m < surfaces[i].pointsMap[0].length; m ++) {
            const _points = [];
            for(let k = 0; k <surfaces[i].pointsMap.length; k ++) {
                _points.push(surfaces[i].pointsMap[k][m]);
               // _points.push(surfaces[i].pointsMap[k][m]);
            }
            DrawLines(_points, { r: 0, g: 0, b: 255 });
        }
    }
}