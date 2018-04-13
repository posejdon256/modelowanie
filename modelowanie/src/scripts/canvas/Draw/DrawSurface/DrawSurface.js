import { getSurfaces } from "../../Surface/Surface";
import { getBezierPointsFromKnots } from "../../Bezier/Bezier";
import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getCanvas, drawLine } from "../Draw";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";

export function _DrawSurfaces(ctx, ctxS1, ctxS2){
    const surfaces = getSurfaces();
    let points = [];
    for(let i = 0; i < surfaces.length; i ++) {
        const map = surfaces[i].pointsMap;
        for(let j = 0; j < map.length - 1; j ++) {
                const n = surfaces[i].px / 3;
                for(let m = 0; m < n; m ++) {
                    const knots = [];
                    for(let k = 0; k < map[j].length; k ++) {
                        let point;
                        if(j !== map.length -1) {
                            point = {
                                x : map[j][k].x + ((m*(map[j + 1][k].x - map[j][k].x))/(n)),
                                y : map[j][k].y +  ((m * (map[j + 1][k].y - map[j][k].y))/n),
                                z : map[j][k].z + ((m*(map[j + 1][k].z - map[j][k].z))/(n))
                            }
                        }
                        knots.push(point);
                    }
                    points = points.concat(getBezierPointsFromKnots(knots));
                }
        }
    }
    for(let i = 0; i < surfaces.length; i ++) {
        const map = surfaces[i].pointsMap;
        for(let k = 0; k < map[0].length - 1; k ++) {
                const n = surfaces[i].py / 3;
                for(let m = 0; m < n; m ++) {
                    const knots = [];
                    for(let j = 0; j < map.length; j ++) {
                        const point = {
                            x : map[j][k].x + ((m*(map[j][k + 1].x - map[j][k].x))/(n)),
                            y : map[j][k].y +  ((m * (map[j][k + 1].y - map[j][k].y))/n),
                            z : map[j][k].z + ((m*(map[j][k + 1].z - map[j][k].z))/(n))
                        }
                        knots.push(point);
                    }
                    points = points.concat(getBezierPointsFromKnots(knots));
                }
        }
    }
    _DrawCurveInSurface(ctx, ctxS1, ctxS2, points)
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
            const y1 = (left[i - 1].y + 1) * 300;
            const z1 = left[i - 1].z;

            const x2 = (left[i].x + 1) * 500;
            const y2 = (left[i].y + 1) * 300;
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
            const y1 = (right[i - 1].y + 1) * 300;
            const z1 = right[i - 1].z;

            const x2 = (right[i].x + 1) * 500;
            const y2 = (right[i].y + 1) * 300;
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
            const y1 = (translated[i - 1].y + 1) * 300;
            const z1 = translated[i - 1].z;

            const x2 = (translated[i].x + 1) * 500;
            const y2 = (translated[i].y + 1) * 300;
            const z2 = translated[i].z;
            if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -100 || z1 > 100
                || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -100 || z2 > 100)
                continue;
            if(points[i].break) {
                ctx.stroke();
                ctx.beginPath();
                continue;
            }
            drawLine(x1, y1, x2, y2, ctx);
        }
        ctx.stroke();
       // ctx.putImageData(img, 0, 0);
    }
}
