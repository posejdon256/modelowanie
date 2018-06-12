import { setAddBezierState } from "../Bezier/Bezier";
import { deselectCurve } from "../Bezier/Curve";
import { setAddingC2State } from "../Bezier/BSpline";
import { setInterpolationState } from "../Bezier/Interpolation";
import { setProjectionState } from "../CuttingCurve/Projection";

export function turnOffAllStates() {
    setAddBezierState(false);
    deselectCurve();
    setAddingC2State(false);
    setInterpolationState(false);
    setProjectionState(false);
}