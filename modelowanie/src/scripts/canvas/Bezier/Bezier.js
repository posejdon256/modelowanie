import { factorial } from "../../Helpers/Helpers";
import Translate, { setTranslationPoints } from "../Translation/TranslationCenter/TranslationCenter";
import Redraw from "../Draw/Redraw";
import { getPoints } from "../Points/Points";
import { getStereoscopy } from "../Stereoscopy/Stereoscopy";
import { getCurves, getSelectedCurveId, addNewCurve, selectCurve, deselectCurve, addPointToCurve, getCurvesControlPoints } from "./Curve";

let addCurveState = false;

export function turnOnChain(id) {
    const curves = getCurves();
    const curve = curves.find(x => x.id === id);
    curve.chain = !curve.chain;
    Redraw();
    return curves;
}
export function addBezierCurve() {
    const curve = {
        objectType: "curve",
        points: [],
        selected: false,
        chain: false
    };
    return addNewCurve("C0", curve);
}
export function setAddBezierState(state) {
    addCurveState = state;
    if(!state)
        deselectCurve();
}
export function getAddBezierState() {
    return addCurveState;
}
export function removeBezierCurve(id) {
    const curves = getCurves("C0");
    for(let i = 0; i < curves.length; i ++) {
        if(curves[i].id === id) {
            curves.splice(i, 1);
            selectCurve()
            addCurveState = false;
            break;
        }
    }
    Redraw();
    return curves;
}
export function addCurveBySelectedPoints() {
    const points = getPoints();
    const selectedCurveId = getSelectedCurveId();
    if (selectedCurveId === undefined) {
        addBezierCurve();
    }
    for(let i = 0; i < points.length; i ++) {
        if(points[i].selected)
            addPointToCurve(points[i]);
    }
    Redraw();
    return selectedCurveId;
}
export function getBezierPoints(_curves){
    const curves = _curves ? _curves : getCurves("C0");
    clearArray(curves);
    const points = [];
    const berstainsNAfterI = countBerstainNAfterI();
    for(let i = 0; i < curves.length; i ++) {
        for(let l = 0; l < curves[i].points.length;) {
            let curvePart;
            if(curves[i].type === "C2" && (l === 0 || curves[i].points.length < l + 3)) {
                curvePart = curves[i].points.slice(l, l + 3);
            } else {
                curvePart = curves[i].points.slice(l, l + 4);
            }
            const divisions = parseInt(countCircumfrence(curvePart), 10);
            for(let j = 0; j < divisions; j ++) {
                const point = {x: 0, y: 0, z: 0, selected: curves[i].selected};
                const n = curvePart.length - 1;
                for(let k = 0; k < n + 1; k ++) {
                    const first = n === 0 ? 1 : Math.pow(j/(divisions-1), k);
                    const second = n - k === 0 ? 1 : Math.pow(1 - (j/(divisions-1)) , n - k);
                    const value = berstainsNAfterI[n][k] * first * second;
                    point.x += (value * curvePart[k].x);
                    point.y += (value * curvePart[k].y);
                    point.z += (value * curvePart[k].z);
                }
                points.push(point);
            }
            if(curves[i].type === "C2" && (l === 0 || curves[i].points.length < l + 3)) {
                l += 2;
            } else  {
                l += 3;
            }
        }
    }
    return points;
}
function countCircumfrence(curve) {
    const lengths = [];
    let k = 0;
    let ret = 0;
    let biggest = 0;
    setTranslationPoints(curve);
    let transleted = Translate({});
    if(getStereoscopy()) {
        transleted = transleted.right;
    }
    if(curve.length === 2) {
        return Math.sqrt((Math.pow(transleted[0].x - transleted[1].x) * 1000, 2) 
        + Math.pow((transleted[0].y - transleted[1].y) * 700, 2));
    }
    for(let i = 0; i < curve.length; i ++) {
        for(let j = i + 1; j < curve.length; j ++) {
            const len = Math.sqrt((Math.pow(transleted[i].x - transleted[j].x) * 1000, 2) 
            + Math.pow((transleted[i].y - transleted[j].y) * 700, 2));
            if(len > biggest) {
                biggest = k;
            }
            lengths.push(len);
            k ++;
        }  
    }
    for(let i = 0; i < k; i ++) {
        if(i !== biggest)
            ret += lengths[i];
    }
    if(ret > 5000) 
        return 5000;
    return 2*ret;
}
function nAfterI(n, i) {
    return factorial(n)/(factorial(i)*factorial(n-i));
}
function countBerstainNAfterI() {
    const ret = [];
    for(let i = 0; i < 4; i ++) {
        const berstains = [];
        for(let j = 0; j < i + 1; j ++) {
            berstains.push(nAfterI(i,j));
        }
        ret.push(berstains);
    }
    return ret;
}
function clearArray(curves) {
    for(let i = 0; i < curves.length; i ++) {
        for(let j = 0; j < curves[i].points.length; j ++) {
            if(curves[i].points[j].deleted)
                curves[i].points.splice(j, 1);
        }
    }
}