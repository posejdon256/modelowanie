import { setAddBezierState } from "../Bezier/Bezier";
import { deselectCurve } from "../Bezier/Curve";
import { setAddingC2State } from "../Bezier/BSpline";

export function turnOffAllStates() {
    setAddBezierState(false);
    deselectCurve();
    setAddingC2State(false);
}