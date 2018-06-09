import { EvaluateTorus, getToruses, EvaluateTorusDU, EvaluateTorusDV } from "../Torus/Torus";
import { getVectorLength, DiffPoints, scalarMultiply, MultiplyPoint } from "../../Helpers/Helpers";
import { getCursor } from "../Cursor/Cursor";
import { addPoint } from "../Points/Points";
import Redraw from "../Draw/Redraw";
import { getSurfaces, EvaluateSurface, EvaluateSurfaceDU, EvaluateSurfaceDV } from "../Surface/Surface";
import { goGoNewton } from "./NewtonMethod";

function findIntersection(_objects) {
    const interation = 10.0;
    const cursor = getCursor();
    const best = {
        lenght: 10000,
        point1: {},
        point2: {}
    };
    for(let i = 0.0; i < 1; i += 1.0/interation) {
        for(let j = 0.0; j < 1; j += 1.0/interation) {
            for(let k = 0.0; k < 1; k += 1.0/interation) {
                for(let m = 0.0; m < 1; m += 1.0/interation) {
                    const ev1 = evaluate(_objects[0], i, j);
                    const ev2 = evaluate(_objects[1], k, m);
                    const trans = [ev1, ev2];
                    const _lenght = getVectorLength(trans[0], cursor) + getVectorLength(trans[1], cursor);
                    if(_lenght < best.lenght) {
                        best.point1 = {u: i, v: j};
                        best.point2 = {u: k, v: m};
                        best.lenght = _lenght;
                    }
                }
            }
        }
    }
    //  const p1 = evaluate(_objects[0], best.point1.u, best.point1.v);
    //  const p2 = evaluate(_objects[1], best.point2.u, best.point2.v);
    //  addPoint(p1.x, p1.y, p1.z, "Orange");
    //  addPoint(p2.x, p2.y, p2.z, "Orange");
    countGradientMethod(_objects[0], _objects[1], best);
   // Redraw();
}
function countGradientMethod(ob1, ob2, best){
    const interation = 10;
    let u = [best.point1.u, best.point2.u];
    let v = [best.point1.v, best.point2.v];
    let p1 = evaluate(ob1, u[0], v[0]);
    let p2 = evaluate(ob2, u[1], v[1]);
    addPoint(p1.x, p1.y, p1.z, "Orange");
    addPoint(p2.x, p2.y, p2.z, "Orange");
    for(let i = 0; i < 300; i ++) {
        const help = {
            point1: {u: u[0], v: v[0]},
            point2: {u: u[1], v: v[1]}
        };
        const betterPoint = getGradient(ob1, ob2, help);
        for(let j = 0; j < 4; j ++) {
            betterPoint[j] *= 0.2;
        }
        const uPrev = u;
        const vPrev = v;

        u = [uPrev[0] - betterPoint[0], uPrev[1] - betterPoint[2]];
        v = [vPrev[0] - betterPoint[1], vPrev[1] - betterPoint[3]];
        const p1 = evaluate(ob1, u[0], v[0]);
        const p2 = evaluate(ob2, u[1], v[1]);
        addPoint(p1.x, p1.y, p1.z, "sfdsdfsdf");
        addPoint(p2.x, p2.y, p2.z, "sfdsdfsdf");
        if(u[0] > 1 || u[1] > 1 || v[0] > 1 || v[1] > 1) {
            console.log(u, v);
        }
    }
    p1 = evaluate(ob1, u[0], v[0]);
    p2 = evaluate(ob2, u[1], v[1]);
    addPoint(p1.x, p1.y, p1.z, "Pink");
    addPoint(p2.x, p2.y, p2.z, "Pink");
    if(getVectorLength(p1, p2) > 0.1) {
        alert("Nie znaleziono przecięcia!");
        return;
    }
    best = {
        ob1: ob1,
        ob2: ob2,
        u: u,
        v: v,
    }
    goGoNewton(best);
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
        alert("Niepoprawna liczba obiektów jest wybrana!");
        return false;
    }
    for(let i = 0; i < surfaces.length; i ++) {
        _objects.push(surfaces[i]);
    }
    for(let i = 0; i < toruses.length; i ++) {
        _objects.push(toruses[i]);
    }
    findIntersection(_objects);
    return true;//TODO
}
export function evaluate(object, u, v) {
    if(object.type === "torus") {
       return EvaluateTorus(object.id, u, v);
    } else if(object.type === "C0") {
        return EvaluateSurface(object.id, u, v);
    }
}
export function evaluateDU(object, u, v) {
    if(object.type === "torus") {
       return EvaluateTorusDU(object.id, u, v);
    } else if(object.type === "C0") {
        return EvaluateSurfaceDU(object.id, u, v);
    }
}
export function evaluateDV(object, u, v) {
    if(object.type === "torus") {
       return EvaluateTorusDV(object.id, u, v);
    } else if(object.type === "C0") {
        return EvaluateSurfaceDV(object.id, u, v);
    }
}