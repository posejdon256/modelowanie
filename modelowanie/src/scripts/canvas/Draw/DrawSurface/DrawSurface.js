import { getSurfaces } from "../../Surface/Surface";
import { getBezierPointsFromKnots } from "../../Bezier/Bezier";
import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getCanvas, drawLine } from "../Draw";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";
import { deCastiljau } from "../../Bezier/DeCastiljau";
import { getBSplinePointsFromKnots, rebuildVirtualPoints, rebuildVirtualPointsForSingleCurve } from "../../Bezier/BSpline";

let lastPointsC0 = [];
let lastPointsC2 = [];
export function _DrawSurfacesC0(ctx, ctxS1, ctxS2, surface) {
    const surfaces = getSurfaces("C0");
    let points = [];
    for(let i = 0; i < surfaces.length; i ++) {
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
                    points = points.concat(getBezierPointsFromKnots(knots, "C0"));
                }
        }
    }
    for(let i = 0; i < surfaces.length; i ++) {
        const map = surfaces[i].pointsMap;
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
                    points = points.concat(getBezierPointsFromKnots(knots, "C0"));
                }
        }
    }
    lastPointsC0 = points;
    _DrawCurveInSurface(ctx, ctxS1, ctxS2, points)
}
export function _DrawSurfacesC2(ctx, ctxS1, ctxS2){
    const surfaces = getSurfaces("C2");
    let points = [];
    var i, j, k, m;
    for(i = 0; i < surfaces.length; i ++) {
        for(j = (surfaces[i].cylinder ? surfaces[i].width + 3 : surfaces[i].height  + 3);
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
                    points = points.concat(getBSplinePointsFromKnots(knots, "C2"));
                    knots.forEach(knot => {
                        knot.virtualPoints.forEach(vp => {
                            vp.deleted = true;
                        });
                    });
                }
            
        }
    }
    for(i = 0; i < surfaces.length; i ++) {
        for(j = 0; j < (surfaces[i].cylinder ? 3 + surfaces[i].width : surfaces[i].height + 3); j ++) {
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
                        points = points.concat(getBezierPointsFromKnots(knots, "C2"));
                    } else {
                        points = points.concat(getBSplinePointsFromKnots(knots));
                    }
                    knots.forEach(knot => {
                        knot.virtualPoints.forEach(vp => {
                            vp.deleted = true;
                        });
                    });
                }
        }
    }
    lastPointsC2 = points;
    _DrawCurveInSurface(ctx, ctxS1, ctxS2, points)
}
export function _DrawSurfaceWithoutRedraw(ctx, ctxS1, ctxS2) {
    _DrawCurveInSurface(ctx, ctxS1, ctxS2, lastPointsC0.concat(lastPointsC2));
}
export function _DrawCurveInSurface(ctx, ctxS1, ctxS2, points) {
    const stereoscopy = getStereoscopy();
    setTranslationPoints(points);
    const translated =  Translate({});
    const canvas = getCanvas();
    if(stereoscopy) {
        const { right, left} = translated;
        let img = ctxS1.getImageData(0, 0, canvas.width, canvas.height);
        ctxS1.strokeStyle = "rgba(236, 4, 0, 1)";
        ctxS2.strokeStyle = "rgba(0, 249, 247, 1)";
        ctxS1.beginPath();
        ctxS2.beginPath();
        for(let i = 1; i < left.length; i ++) {
            const x1 = (left[i - 1].x + 1) * 500;
            const y1 = (left[i - 1].y + 1) * 350;
            const z1 = left[i - 1].z;

            const x2 = (left[i].x + 1) * 500;
            const y2 = (left[i].y + 1) * 350;
            const z2 = left[i].z;

            if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -100 || z1 > 100
            || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -100 || z2 > 100)
                continue;
            drawLine(x1, y1, x2, y2, ctxS1);
            //drawPixel(x, y, img, ctxS1, rgb);
        }
        ctxS1.putImageData(img, 0, 0);
        for(let i = 1; i < right.length; i ++) {
            const x1 = (right[i - 1].x + 1) * 500;
            const y1 = (right[i - 1].y + 1) * 350;
            const z1 = right[i - 1].z;

            const x2 = (right[i].x + 1) * 500;
            const y2 = (right[i].y + 1) * 350;
            const z2 = right[i].z;

            if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -100 || z1 > 100
                || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -100 || z2 > 100)
                continue;
            drawLine(x1, y1, x2, y2, ctxS2);
        }
        ctxS1.stroke();
        ctxS2.stroke()
        //stereoscopyDraw();
    } else {
        ctx.strokeStyle = "rgba(255, 0, 255, 1)";
        ctx.beginPath();
        for(let i = 1; i < translated.length; i ++) {
            const x1 = (translated[i - 1].x + 1) * 500;
            const y1 = (translated[i - 1].y + 1) * 350;
            const z1 = translated[i - 1].z;

            const x2 = (translated[i].x + 1) * 500;
            const y2 = (translated[i].y + 1) * 350;
            const z2 = translated[i].z;
            if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -100 || z1 > 100
                || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -100 || z2 > 100)
                continue;
            if(points[i].break) {
                ctx.closePath();
                continue;
            }
            drawLine(x1, y1, x2, y2, ctx);
        }
        ctx.stroke();
       // ctx.putImageData(img, 0, 0);
    }
    drawChainForC2CubicFlake(ctx, ctxS1, ctxS2);
}
function drawChainForC2CubicFlake(ctx, ctxS1, ctxS2) {
    const surfaces = getSurfaces("C2");
    ctx.strokeStyle = "rgba(0, 0, 255, 1)";
    for(let i = 0; i < surfaces.length; i ++) {
        if(!surfaces[i].chain) {
            continue;
        }
        for(let j = 0; j < surfaces[i].pointsMap.length; j ++) {
            setTranslationPoints(surfaces[i].pointsMap[j]);
            let translated = Translate({});
            ctx.beginPath();
            for(let k = 1; k < translated.length; k ++) {
                drawLine(parseInt((translated[k - 1].x + 1) * 500, 10), parseInt((translated[k - 1].y + 1) * 350, 10), parseInt((translated[k].x + 1) * 500, 10), parseInt((translated[k].y + 1) * 350, 10), ctx);
            }
            ctx.stroke();
        }
        for(let m = 0; m < surfaces[i].pointsMap[0].length; m ++) {
            const _points = [];
            for(let k = 0; k <surfaces[i].pointsMap.length; k ++) {
                _points.push(surfaces[i].pointsMap[k][m]);
               // _points.push(surfaces[i].pointsMap[k][m]);
            }
            setTranslationPoints(_points);
            let translated = Translate({});
            ctx.beginPath();
            for(let k = 1; k < translated.length; k ++) {
                drawLine(parseInt((translated[k - 1].x + 1) * 500, 10), parseInt((translated[k - 1].y + 1) * 350, 10), parseInt((translated[k].x + 1) * 500, 10), parseInt((translated[k].y + 1) * 350, 10), ctx);
            }
            ctx.stroke();
        }
    }
}
