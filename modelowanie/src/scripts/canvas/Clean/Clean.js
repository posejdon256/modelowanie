import { cleanCurves } from "../Bezier/Curve";
import { cleanCuttingCurves } from "../CuttingCurve/CuttingCurve";
import { cleanGrzegorzys } from "../Gregory/Gregory";
import { cleanPoints } from "../Points/Points";
import { cleanSurfaces } from "../Surface/Surface";
import { cleanToruses } from "../Torus/Torus";
import { cleanDrawSurfacePoints } from "../Draw/DrawSurface/DrawSurface";
import Redraw from "../Draw/Redraw";
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
    clearVisualization();
    setAddBezierState(false);
    setAddingC2State(false);
    setInterpolationState(false);
    Redraw();
}