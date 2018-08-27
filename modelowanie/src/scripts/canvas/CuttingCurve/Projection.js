import { getToruses } from '../Torus/Torus';
import { getSurfaces } from '../Surface/Surface';
import { DrawPoint } from '../Draw/DrawPoints/DrawPoints';
import { getCursor } from '../Cursor/Cursor';
import { evaluate, getGradient, getIntersectionStep } from './FindIntersection';
import { getVectorLength, TryParseInt } from '../../Helpers/Helpers';
import { goGoNewton } from './NewtonMethod';

let projectionState = false;
let oneIntersectionPointState = false;
let showIterations = false;
let newtonStep = 20;
export function setNewtonStep(step) {
    newtonStep = TryParseInt(step, newtonStep);
}
export function setProjectionState(_state) {
    projectionState = _state;
}
export function setOneProjectionPointState(_state) {
    oneIntersectionPointState = _state;
}
export function getOneProjectionPointState() {
    return oneIntersectionPointState;
}
export function getProjectionState() {
    return projectionState;
}
export function setFirstNewtonIt(_state) {
    showIterations = _state;
}
export function getFirstNewtonIt() {
    return showIterations;
}
function findIntersection(_objects) {
    const cursor = getCursor();
    const best = {
        lenght: 10000,
        point1: {},
        point2: {}
    };
    const epsDistance = { x: _objects[0].Width * 0.5, y: _objects[0].Height * 0.5 };
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
                    const _lenght = getVectorLength(ev1, cursor) + getVectorLength(ev2, cursor);
                    if(_lenght < best.lenght && (!sameObjects || (epsDistance.x < Math.abs(i - k) && epsDistance.y < Math.abs(j - m)))) {
                        best.point1 = {u: j, v: i};
                        best.point2 = {u: m, v: k};
                        best.lenght = _lenght;
                    }
                }
            }
        }
    }
    const p1 = evaluate(_objects[0], best.point1.u, best.point1.v);
    const p2 = evaluate(_objects[1], best.point2.u, best.point2.v);

    DrawPoint(p1, "Blue");
    DrawPoint(p2, "Red");
    if(oneIntersectionPointState) {
        countGradientMethod(_objects[0], _objects[1], best);
    }
}
export function projectIntersectionPoints(){
    if(!projectionState) {
        return;
    }
    const surfaces = getSurfaces().filter(x => x.selected === true);
    const toruses = getToruses().filter(x => x.selected ===  true);
    const _objects = [];
    if(surfaces.length  + toruses.length !== 2) {
        if(surfaces.length === 1 && toruses.length === 0) {
            _objects.push(surfaces[0]);
        } else {
            console.log("Niepoprawna liczba obiektów jest wybrana!");
            return false;
        }
    }
    for(let i = 0; i < surfaces.length; i ++) {
        _objects.push(surfaces[i]);
    }
    for(let i = 0; i < toruses.length; i ++) {
        _objects.push(toruses[i]);
    }
    try {
        if(!findIntersection(_objects)) {
            return false
        }
    }  catch(e) {
        console.log("Error: " + e);
        return false;
    }
    return true;//TODO
}
function countGradientMethod(ob1, ob2, best){
    const intersectionStep = getIntersectionStep();
    let u = [best.point1.u, best.point2.u];
    let v = [best.point1.v, best.point2.v];
    let p1 = evaluate(ob1, u[0], v[0]);
    let p2 = evaluate(ob2, u[1], v[1]);
    // DrawPoint(evaluate(ob1, 0, 0), "Green");
    // DrawPoint(evaluate(ob1, 2.1, 3.1), "Green");
    const eps = 0.001;
    let i = 0;
    while(getVectorLength(p1, p2) > eps) {
        i ++;
        if(i > 1000) {
            console.log("Nie znaleziono przecięcia!");
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
            console.log("Nie znaleziono przecięcia :( "  + e);
            return false;
        }
        for(let j = 0; j < 4; j ++) {
            betterPoint[j] *= intersectionStep;
        }
        p1 = evaluate(ob1, u[0], v[0]);
        p2 = evaluate(ob2, u[1], v[1]);
        DrawPoint(p1, "Red");
        DrawPoint(p2, "Red");
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
    DrawPoint(p1, "Red");
    if(showIterations) {
        goGoNewton(best, newtonStep);
    }
    return true;
}