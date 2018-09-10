import { cleanCurves } from "../Bezier/Curve";
import { cleanCuttingCurves } from "../CuttingCurve/CuttingCurve";
import { cleanGrzegorzys } from "../Gregory/Gregory";
import { cleanPoints } from "../Points/Points";
import { cleanSurfaces } from "../Surface/Surface";
import { cleanToruses } from "../Torus/Torus";
import { setCursor } from "../Cursor/Cursor";
import { cleanDrawSurfacePoints } from "../Draw/DrawSurface/DrawSurface";
import Redraw from "../Draw/Redraw";
import { CleanCatchedPoints } from "../Move/MoveCursor";
import { clearVisualization } from "../Draw/RedrawVisualisation/RedrawVisualization";
import { setAddingC2State } from "../Bezier/BSpline";
import { setAddBezierState } from "../Bezier/Bezier";
import { setInterpolationState } from "../Bezier/Interpolation";

export function cleanScene() {
    cleanCurves();
    cleanCuttingCurves();
    cleanGrzegorzys();
    cleanPoints();
    cleanSurfaces();
    cleanToruses();
    cleanDrawSurfacePoints();
    CleanCatchedPoints();
    clearVisualization();
    setCursor(0, 0, 0);
    setAddBezierState(false);
    setAddingC2State(false);
    setInterpolationState(false);
    Redraw();
}