import { getPoints } from "../Points/Points";
import { getTorusVisibility, getTorusVertices } from "../Torus/Torus";
import Translate, { setTranslationPoints } from "../Translation/TranslationCenter/TranslationCenter";
import { _DrawTorus } from "./DrawTorus/DrawTorus";
import { _DrawPoints } from "./DrawPoints/DrawPoints";
import { _DrawCursor } from "./DrawCursor/DrawCursor";
import { clearCanvas, getContexts } from "./Draw";
import { _DrawCurves } from "./DrawCurve/DrawCurve";

export default function Redraw(){
    clearCanvas();

    if(getTorusVisibility()) {
        const torus = getTorusVertices();
        setTranslationPoints(torus);  
        DrawTorus(Translate({}));
    }
    DrawCursor();
    DrawCurves();
    DrawPoints(getPoints());
}
function DrawTorus(points) {
    const { ctx, ctxS1, ctxS2 } = getContexts();
    _DrawTorus(points, ctx, ctxS1, ctxS2);
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