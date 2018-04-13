import { addNewCurve, getCurves } from "./Curve";
import { getVectorLength } from "../../Helpers/Helpers";
import { addPoint } from "../Points/Points";
import { rebuildVirtualPointsForSingleCurve, cutBSpline, addBsplinePoint, clearArray } from "./BSpline";
import { getBezierPoints } from "./Bezier";

let interpolationState = false;

export function setInterpolationState(state) {
    interpolationState = state;
}
export function getInterpolationState() {
    return interpolationState;
}
export function addInterpolationCurve() {
    const curve = {
        objectType: "curve",
        points: [],
        pointsBspline: [],
        selected: false,
        type: "C2I",
        chain: false,
        spline: false,
        interpolation: true,
        interpolationPoints: []
    };
    return addNewCurve("C2I", curve);
}
export function addPointToInterpolationCurve(curve, point) {
    curve.interpolationPoints.push(point);
    point.interpolation = true;
    const _point = addPoint(0, 0, 0, "C2i-boor");
    _point.visible = false;
    addBsplinePoint(curve, _point);
    updateInterpolationCurves();
}
function updateInterpolationCurves() {
    const curves = getCurves("C2I");
    for(let i = 0; i < curves.length; i ++) {
        let interpolationPoints = curves[i].interpolationPoints.slice();
        let bSplinePoints = curves[i].pointsBspline.slice();
        const T = [];
        let max = - 10;
        let sum = 0;
        T.push(0);
        T.push(0.001);
        T.push(0.002);
        const epsilon = 0.001;
        if(interpolationPoints.length < 2)
            continue;

        const leftAddInter = [interpolationPoints[0], interpolationPoints[0]];
        const rightAddInter =[interpolationPoints[interpolationPoints.length - 1], interpolationPoints[interpolationPoints.length - 1]];
        interpolationPoints = (leftAddInter.concat(interpolationPoints)).concat(rightAddInter);

        const leftAddBSpline = [bSplinePoints[0], bSplinePoints[0]];
        const rightAddBSpline =[bSplinePoints[bSplinePoints.length - 1], bSplinePoints[bSplinePoints.length - 1]];
        bSplinePoints = (leftAddBSpline.concat(bSplinePoints)).concat(rightAddBSpline);
        const bla = 1 / interpolationPoints.length;
        for(let j = 1; j < interpolationPoints.length; j ++) {
            const vectorLength = bla + epsilon;//getVectorLength(interpolationPoints[j], interpolationPoints[j - 1]) + epsilon;//bla + epsilon;
            sum += Math.sqrt(vectorLength);
            T.push(sum);
            if(vectorLength > max) {
                max = vectorLength;
            }
        }
        T.push(sum);
        T.push(sum);
        sum = Math.sqrt(sum);
        for(let j = 0; j < T.length; j ++) {
            T[j] = (T[j]/(sum));
        }
        const interpolationArray = {left:[], middle:[], right: []};
        interpolationArray.left.push(0);
        for(let j = 2; j < T.length - 2; j ++) {
            const NForCurrentJ = deBoorAlgorithm(j, T, T[j]);
            if(j !== 2) {
                interpolationArray.left.push(NForCurrentJ[0]);
            }
            if(j === 2) {
                interpolationArray.middle.push(NForCurrentJ[0]);
            }
            if(j !== 2 && j !== T.length - 3)
                interpolationArray.middle.push(NForCurrentJ[1]);
            if(j === T.length - 3) {
                interpolationArray.middle.push(NForCurrentJ[2]);
            }
            if(j !== T.length - 3) {
                interpolationArray.right.push(NForCurrentJ[2]);
            }
        }
        interpolationArray.right.push(0);
        const cPrim = [];
        const dPrim = [];
        cPrim.push(interpolationArray.right[0]/interpolationArray.middle[0]);
        dPrim.push({x : interpolationPoints[0].x/interpolationArray.middle[0],
                y: interpolationPoints[0].y/interpolationArray.middle[0], 
                z:interpolationPoints[0].z/interpolationArray.middle[0]
        });
        for(let j = 1; j < interpolationArray.middle.length; j ++) {
            cPrim.push(interpolationArray.right[j]/(interpolationArray.middle[j] - (interpolationArray.left[j] * cPrim[j -1])));
            dPrim.push({ 
            x: (interpolationPoints[j].x - (interpolationArray.left[j] * dPrim[j - 1].x)) / (interpolationArray.middle[j] - (interpolationArray.left[j] * cPrim[j - 1])),
            y: (interpolationPoints[j].y - (interpolationArray.left[j] * dPrim[j - 1].y)) / (interpolationArray.middle[j] - (interpolationArray.left[j] * cPrim[j - 1])),
            z: (interpolationPoints[j].z - (interpolationArray.left[j] * dPrim[j - 1].z)) / (interpolationArray.middle[j] - (interpolationArray.left[j] * cPrim[j - 1]))});
        }
        bSplinePoints[bSplinePoints.length - 1].x = dPrim[bSplinePoints.length - 1].x;
        bSplinePoints[bSplinePoints.length - 1].y = dPrim[bSplinePoints.length - 1].y;
        bSplinePoints[bSplinePoints.length - 1].z = dPrim[bSplinePoints.length - 1].z;
        for(let j = interpolationPoints.length - 2; j >= 0; j --) {
            bSplinePoints[j].x = (dPrim[j].x - (cPrim[j] * bSplinePoints[j + 1].x));
            bSplinePoints[j].y = (dPrim[j].y - (cPrim[j] * bSplinePoints[j + 1].y));
            bSplinePoints[j].z = (dPrim[j].z - (cPrim[j] * bSplinePoints[j + 1].z));
        }
        curves[i].pointsBspline = bSplinePoints.splice(2, curves[i].pointsBspline.length);
    }
}
function AnnaBujakAlgorithm(i, T, t) {
    const N = [];
    const A = {};
    const B = {};
    N.push(1);
    for(let j = 1; j <= 3; j ++) {
        A[j] = (T[i + j - 1] - t)/(T[i + j] - T[i]);
        B[j] = (t - T[i - 1])/(T[i + j - 1] - T[i - 1]);
        const NPrim = N.slice();
        for(let k = 1; k <= j + 1 ; k ++) {
            N[k] = (A[k] && NPrim[k] ? A[k] * NPrim[k] : 0) + (B[k - 1] && NPrim[k - 1] ? B[k - 1] * NPrim[ k - 1] : 0);
        }
    }
    return N.splice(2, 4);
}
function deBoorAlgorithm(i, T, t) {
    const N = [];
    N.push(undefined);
    const A = {};
    const B = {};
    N.push(1);
    for(let j = 1; j <= 2; j ++) {
        A[j] = T[i + j] - t;
        B[j] = t - T[i - j];
        let saved = 0;
        for(let k = 1; k <= j ; k ++) {
            const term = N[k]/(A[k] + B[j + 1 - k]);
            N[k] = saved + (A[k]*term);
            saved = B[j + 1 - k] * term;
        }
        N[j + 1] = saved;
    }
    return N.splice(1, 3);
}
export function getInterpolationPoints() {
    clearArray(getCurves("C2I"));
    updateInterpolationCurves();
    return getBezierPoints(cutBSpline());
}