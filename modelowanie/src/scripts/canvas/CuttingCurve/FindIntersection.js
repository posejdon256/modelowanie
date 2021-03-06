import { EvaluateTorus, getToruses, EvaluateTorusDU, EvaluateTorusDV, cleanTrimToruses } from "../Torus/Torus";
import { getVectorLength, DiffPoints, scalarMultiply, TryParseFloat } from "../../Helpers/Helpers";
import { getCursor } from "../Cursor/Cursor";
import { getSurfaces, cleanTrimSurfaces }  from  "../Surface/Surface";
import { EvaluateSurface, EvaluateSurfaceDU, EvaluateSurfaceDV, EvaluateSurfaceC2, EvaluateSurfaceC2DU, EvaluateSurfaceC2DV } from "../Surface/EvaluateSurface";
import { goGoNewton } from "./NewtonMethod";

let intersectionStep = 3; //Needs to be updated for toruses and C0
let intersectionEpsilon = 0.001;
let selectedObjects = [];
export function setIntersectionStep(_step) {
    intersectionStep = TryParseFloat(_step, intersectionStep);
}
export function getIntersectionSelectedObjects() {
    return selectedObjects;
}
export function getIntersectionStep() {
    return intersectionStep;
}
export function setEpsilonOfFindingIntersection(_eps) {
    intersectionEpsilon = TryParseFloat(_eps, intersectionEpsilon);;
}
export function getIntersectionEpsilon() {
    return intersectionEpsilon;
}
function findIntersection(_objects) {
    cleanTrimSurfaces();
    cleanTrimToruses();
    const cursor = getCursor();
    const best = {
        lenght: 10000,
        point1: {},
        point2: {}
    };
    const epsDistance = { x: 0.5, y: 0.5 };
    const sameObjects = _objects[0].id === _objects[1].id ? true : false;
    const divideValue = sameObjects ? 10.0 : 10.0;
    const step = {
        h1: _objects[0].Height /divideValue,
        w1: _objects[0].Width /divideValue,
        h2: _objects[1].Height /divideValue,
        w2: _objects[1].Width /divideValue,
    };
    for(let i = 0.0; i < _objects[0].Width; i += step.w1) {
        for(let j = 0.0; j < _objects[0].Height; j += step.h1) {
            for(let k = 0.0; k < _objects[1].Width; k += step.w2) {
                for(let m = 0.0; m < _objects[1].Height; m += step.h2) {
                    const ev1 = evaluate(_objects[0], j, i);
                    const ev2 = evaluate(_objects[1], m, k);
                    const trans = [ev1, ev2];
                    const _lenght = getVectorLength(trans[0], cursor) + getVectorLength(trans[1], cursor);
                    if(_lenght < best.lenght && (!sameObjects || (epsDistance.x < Math.abs(i - k) && epsDistance.y < Math.abs(j - m)))) {
                        best.point1 = {u: j, v: i};
                        best.point2 = {u: m, v: k};
                        best.lenght = _lenght;
                    }
                }
            }
        }
    }
    return countGradientMethod(_objects[0], _objects[1], best);
}
function countGradientMethod(ob1, ob2, best){
    let u = [best.point1.u, best.point2.u];
    let v = [best.point1.v, best.point2.v];
    let p1 = evaluate(ob1, u[0], v[0]);
    let p2 = evaluate(ob2, u[1], v[1]);
    let i = 0;
    while(getVectorLength(p1, p2) > intersectionEpsilon) {
        i ++;
        if(i > 1000) {
            alert("There is no intersection. Try to put cursor in other place.");
            console.log(getVectorLength(p1, p2));
            return false;
        }
        const help = {
            point1: {u: u[0], v: v[0]},
            point2: {u: u[1], v: v[1]}
        };
        let betterPoint;
        try{
            betterPoint = getGradient(ob1, ob2, help);
        } catch(e) {
            alert("There is no intersection. Try to put cursor in other place."  + e);
            return false;
        }
        for(let j = 0; j < 4; j ++) {
            betterPoint[j] *= intersectionStep;
        }
        p1 = evaluate(ob1, u[0], v[0]);
        p2 = evaluate(ob2, u[1], v[1]);
        const uPrev = u;
        const vPrev = v;

        u = [uPrev[0] - betterPoint[0], uPrev[1] - betterPoint[2]];
        v = [vPrev[0] - betterPoint[1], vPrev[1] - betterPoint[3]];

    }
    best = {
        ob1: ob1,
        ob2: ob2,
        u: u,
        v: v,
    }
    goGoNewton(best);
    return true;
}
export function getGradient(ob1, ob2, best) {
    const eval1 = evaluate(ob1, best.point1.u, best.point1.v);
    const eval2 = evaluate(ob2, best.point2.u, best.point2.v);

    const diff = DiffPoints(eval1, eval2);
    
    const eval1u = evaluateDU(ob1, best.point1.u, best.point1.v);
    const eval1v = evaluateDV(ob1, best.point1.u, best.point1.v);

    const eval2u = evaluateDU(ob2, best.point2.u, best.point2.v);
    const eval2v = evaluateDV(ob2, best.point2.u, best.point2.v);

    return [
            scalarMultiply(diff, eval1u) * 2,
            scalarMultiply(diff, eval1v) * 2,
            scalarMultiply(diff, eval2u) * -2,
            scalarMultiply(diff, eval2v) * -2
        ];
}
export function findObjectToIntersectionAndIntersection(){
    const surfaces = getSurfaces().filter(x => x.selected === true);
    const toruses = getToruses().filter(x => x.selected ===  true);
    const _objects = [];
    if(surfaces.length  + toruses.length !== 2) {
        if(surfaces.length === 1 && toruses.length === 0) {
            _objects.push(surfaces[0]);
        } else {
            alert("Wrong number of objects is selected.");
            return false;
        }
    }
    for(let i = 0; i < surfaces.length; i ++) {
        _objects.push(surfaces[i]);
    }
    for(let i = 0; i < toruses.length; i ++) {
        _objects.push(toruses[i]);
    }
    try{
        selectedObjects = _objects;
        if(!findIntersection(_objects)) {
            return false
        }
    } catch(e) {
        console.log("Error: " + e);
        return false;
    }
    return true;//TODO
}
export function evaluate(object, u, v, debug) {
    if(object.type === "torus") {
       return EvaluateTorus(object.id, u, v);
    }
    else if(object.type === "C0") {
        return EvaluateSurface(object.id, u, v, debug);
    }
    else if(object.type === "C2") {
        return EvaluateSurfaceC2(object.id, u, v);
    }
}
export function evaluateDU(object, u, v) {
    if(object.type === "torus") {
       return EvaluateTorusDU(object.id, u, v);
    } else if(object.type === "C0") {
        return EvaluateSurfaceDU(object.id, u, v);
    }
    else if(object.type === "C2") {
        return EvaluateSurfaceC2DU(object.id, u, v);
    }
}
export function evaluateDV(object, u, v) {
    if(object.type === "torus") {
       return EvaluateTorusDV(object.id, u, v);
    } else if(object.type === "C0") {
        return EvaluateSurfaceDV(object.id, u, v);
    }
    else if(object.type === "C2") {
        return EvaluateSurfaceC2DV(object.id, u, v);
    }
}