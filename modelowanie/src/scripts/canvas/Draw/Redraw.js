import { getPoints } from "../Points/Points";
import { getTorusVisibility, getTorusVertices } from "../Torus/Torus";
import Translate, { setTranslationPoints } from "../Translation/TranslationCenter/TranslationCenter";
import { _DrawTorus } from "./DrawTorus/DrawTorus";
import { _DrawPoints } from "./DrawPoints/DrawPoints";
import { _DrawCursor } from "./DrawCursor/DrawCursor";
import { clearCanvas, getContexts } from "./Draw";
import { _DrawCurves } from "./DrawCurve/DrawCurve";
import { _DrawSurfaces, _DrawSurfaceWithoutRedraw } from "./DrawSurface/DrawSurface";

export default function Redraw(){
    clearCanvas();
    console.log('redraw');
    if(getTorusVisibility()) {
        const torus = getTorusVertices();
        setTranslationPoints(torus);  
        DrawTorus(Translate({}));
    }
    DrawCursor();
    DrawSurfaces();
    DrawCurves();
    DrawPoints(getPoints());
}
export function RedrawWithoutChangingScene() {
    clearCanvas();
    console.log('redraw');
    if(getTorusVisibility()) {
        const torus = getTorusVertices();
        setTranslationPoints(torus);  
        DrawTorus(Translate({}));
    }
    DrawCursor();
    DrawSurfacesWithoutBezier();
    DrawCurves();
    DrawPoints(getPoints());
}
function DrawTorus(points) {
    const { ctx, ctxS1, ctxS2 } = getContexts();
    _DrawTorus(points, ctx, ctxS1, ctxS2);
}
function DrawSurfaces(){
    const { ctx, ctxS1, ctxS2 } = getContexts();
    _DrawSurfaces(ctx, ctxS1, ctxS2);
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