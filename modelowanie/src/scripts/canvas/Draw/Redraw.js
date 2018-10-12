import { getPoints } from "../Points/Points";
import { _DrawTorus } from "./DrawTorus/DrawTorus";
import { _DrawPoints } from "./DrawPoints/DrawPoints";
import { _DrawCursor } from "./DrawCursor/DrawCursor";
import { clearCanvas, getContexts, getCanvas } from "./Draw";
import { _DrawCurves } from "./DrawCurve/DrawCurve";
import { _DrawSurfaceWithoutRedraw, _DrawSurfacesC2, _DrawSurfacesC0 } from "./DrawSurface/DrawSurface";
import { DrawGregor } from "./DrawGregory/DrawGregory";
import { DrawMaterial } from './DrawMaterial/DrawMaterial';
import { _DrawIntersectionCurves } from "./DrawCurve/DrawIntersectionCurve";
import Translate, { setTranslationPoints } from "../Translation/TranslationCenter/TranslationCenter";

export default function Redraw(){
//     clearCanvas();
//     DrawTorus();
//    //DrawRectangle();
//     DrawCursor();
//     DrawSurfaces();
//     DrawCurves();
//     DrawPoints(getPoints());
//     DrawGregor();
//     _DrawIntersectionCurves();
    DrawMaterial();
   // getCanvas().focus();
}
export function RedrawWithoutChangingScene() {
    // clearCanvas();
    // DrawTorus();
    // //DrawRectangle();
    // DrawCursor();
    // DrawSurfacesWithoutBezier();
    // DrawCurves();
    // DrawPoints(getPoints());
    // DrawGregor();
    // _DrawIntersectionCurves();
    DrawMaterial();
   // getCanvas().focus();
}
function DrawRectangle() {
        //TODO
        const {ctx} = getContexts();
        setTranslationPoints([{x: -0.3, y: -0.4, z: 0}, {x: 0.45, y: 0.4, z: 0}, {x: -0.3, y: 0.4, z: 0}, {x: 0.45, y: -0.4, z: 0}]);
        const rect = Translate({});
        ctx.beginPath();
        ctx.fillStyle = "rgba(125, 125, 125, 1)";
        ctx.moveTo((rect[0].x + 1) * 500, (rect[0].y + 0.8) * 450);
        ctx.lineTo((rect[3].x + 1) * 500, (rect[3].y + 0.8) * 450);
        ctx.lineTo((rect[1].x + 1) * 500, (rect[1].y + 0.8) * 450);
        ctx.lineTo((rect[2].x + 1) * 500, (rect[2].y + 0.8) * 450);
        ctx.closePath();
        ctx.fill();
}
function DrawTorus() {
    const { ctx, ctxS1, ctxS2 } = getContexts();
    _DrawTorus( ctx, ctxS1, ctxS2);
}
function DrawSurfaces(){
    const { ctx, ctxS1, ctxS2 } = getContexts();
    _DrawSurfacesC2(ctx, ctxS1, ctxS2);
    _DrawSurfacesC0(ctx, ctxS1, ctxS2);
}
function DrawSurfacesWithoutBezier() {
    const { ctx, ctxS1, ctxS2 } = getContexts();
    _DrawSurfaceWithoutRedraw(ctx, ctxS1, ctxS2);
}
function DrawPoints(points) {
    const { ctx, ctxS1, ctxS2 } = getContexts();
    _DrawPoints(points, ctx, ctxS1, ctxS2);
}
function DrawCursor() {
    const { ctx, ctxS1, ctxS2 } = getContexts();
   _DrawCursor(ctx, ctxS1, ctxS2);
}
function DrawCurves() {
    const { ctx, ctxS1, ctxS2 } = getContexts();
    _DrawCurves(ctx, ctxS1, ctxS2);
}