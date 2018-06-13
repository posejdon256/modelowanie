import { cleanCurves } from "../Bezier/Curve";
import { cleanCuttingCurves } from "../CuttingCurve/CuttingCurve";
import { cleanGrzegorzys } from "../Gregory/Gregory";
import { cleanPoints } from "../Points/Points";
import { cleanSurfaces } from "../Surface/Surface";
import { cleanToruses } from "../Torus/Torus";
import { setCursor } from "../Cursor/Cursor";
import { cleanDrawSurfacePoints } from "../Draw/DrawSurface/DrawSurface";

export function cleanScene() {
    cleanCurves();
    cleanCuttingCurves();
    cleanGrzegorzys();
    cleanPoints();
    cleanSurfaces();
    cleanToruses();
    cleanDrawSurfacePoints();
    setCursor(0, 0, 0);
}