import { setAddBezierState } from "../Bezier/Bezier";
import { deselectCurve } from "../Bezier/Curve";
import { setAddingC2State } from "../Bezier/BSpline";
import { setInterpolationState } from "../Bezier/Interpolation";

export function turnOffAllStates() {
    setAddBezierState(false);
    deselectCurve();
    setAddingC2State(false);
    setInterpolationState(false);
}