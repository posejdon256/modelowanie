import { EvaluateTorus, getToruses, EvaluateTorusDU, EvaluateTorusDV } from "../Torus/Torus";
import { getVectorLength, DiffPoints, scalarMultiply, MultiplyPoint, TryParseFloat } from "../../Helpers/Helpers";
import { getCursor } from "../Cursor/Cursor";
import Redraw from "../Draw/Redraw";
import { getSurfaces }  from  "../Surface/Surface";
import { EvaluateSurface, EvaluateSurfaceDU, EvaluateSurfaceDV, EvaluateSurfaceC2, EvaluateSurfaceC2DU, EvaluateSurfaceC2DV } from "../Surface/EvaluateSurface";
import { goGoNewton } from "./NewtonMethod";
import { addPoint } from "../Points/Points";

let intersectionStep = 3; //Needs to be updated for toruses and C0
export function setIntersectionStep(_step) {
    intersectionStep = TryParseFloat(_step, intersectionStep);
}
export function getIntersectionStep() {
    return intersectionStep;
}
function findIntersection(_objects) {
    const interation = 10.0;
    const cursor = getCursor();
    const eps = 0.001;
    const best = {
        lenght: 10000,
        point1: {},
        point2: {}
    };
    const sizes = getSizes(_objects);
    const epsDistance = { x: sizes.o1x * 0.1, y: sizes.o1y * 0.1 };
    const sameObjects = _objects[0].id === _objects[1].id ? true : false;
    for(let i = 0.0; i < sizes.o1x; i += 1.0/interation) {
        for(let j = 0.0; j < sizes.o1y; j += 1.0/interation) {
            for(let k = sizes.o2x - eps; k >= 0.0; k -= 1.0/interation) {
                for(let m = sizes.o2y - eps; m >= 0.0; m -= 1.0/interation) {
                    const ev1 = evaluate(_objects[0], i, j);
                    const ev2 = evaluate(_objects[1], k, m);
                    const trans = [ev1, ev2];
                    const _lenght = getVectorLength(trans[0], cursor) + getVectorLength(trans[1], cursor);
                    if(_lenght < best.lenght && (!sameObjects || epsDistance.x < Math.abs(i - k) && epsDistance.y < Math.abs(j - m))) {
                        best.point1 = {u: i, v: j};
                        best.point2 = {u: k, v: m};
                        best.lenght = _lenght;
                    }
                }
            }
        }
    }
    return countGradientMethod(_objects[0], _objects[1], best);
}
function getSizes(_objects) {
    const sizes = {};
    sizes.o1x = _objects[0].type === "torus" ? 1 : _objects[0].width;
    sizes.o1y = _objects[0].type === "torus" ? 1 : _objects[0].height;
    sizes.o2x = _objects[1].type === "torus" ? 1 : _objects[1].width;
    sizes.o2y = _objects[1].type === "torus" ? 1 : _objects[1].height;
    return sizes;
}
function countGradientMethod(ob1, ob2, best){
    const interation = 10;
    let u = [best.point1.u, best.point2.u];
    let v = [best.point1.v, best.point2.v];
    let p1 = evaluate(ob1, u[0], v[0]);
    let p2 = evaluate(ob2, u[1], v[1]);
    const eps = 0.001;
    let i = 0;
    while(getVectorLength(p1, p2) > eps) {
        i ++;
        if(i > 1000) {
            alert("Nie znaleziono przecięcia!");
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
            alert("Nie znaleziono przecięcia :( "  + e);
            return false;
        }
        for(let j = 0; j < 4; j ++) {
            betterPoint[j] *= intersectionStep;
        }
        p1 = evaluate(ob1, u[0], v[0]);
        p2 = evaluate(ob2, u[1], v[1]);
        addPoint(p1.x, p1.y, p1.z, "dsds");
        addPoint(p2.x, p2.y, p2.z, "dsds");
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
            _objects.push(surfaces[0]);
        } else {
            alert("Niepoprawna liczba obiektów jest wybrana!");
            return false;
        }
    }
    for(let i = 0; i < surfaces.length; i ++) {
        _objects.push(surfaces[i]);
    }
    for(let i = 0; i < toruses.length; i ++) {
        _objects.push(toruses[i]);
    }
    if(!findIntersection(_objects)) {
        return false
    }
    return true;//TODO
}
export function evaluate(object, u, v) {
    if(object.type === "torus") {
       return EvaluateTorus(object.id, u, v);
    }
    else if(object.type === "C0") {
        return EvaluateSurface(object.id, u, v);
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