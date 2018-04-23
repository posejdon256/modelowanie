import { clearCurves, addPointToCurve } from "../canvas/Bezier/Curve";
import { clearPoints, addPoint, updatePointName, getPoints } from "../canvas/Points/Points";
import { clearSurfaces, addSurface, setAddingSurfaceState } from "../canvas/Surface/Surface";
import { addBezierCurve, setAddBezierState } from "../canvas/Bezier/Bezier";
import { addBsplineCurve, setAddingC2State } from "../canvas/Bezier/BSpline";
import { addInterpolationCurve, setInterpolationState } from "../canvas/Bezier/Interpolation";
import Redraw from "../canvas/Draw/Redraw";
import { turnOffAllStates } from "../canvas/StatesCenter/StatesCenter";



export function Load() {
    const json = require("./../../Project.json");
    clearCurves();
    clearPoints();
    clearSurfaces();
    json.points.forEach(point => {
        let p = addPoint(point.x, point.y, point.z, "load");
        point.id = p.id;
        updatePointName(p.id, point.name);
    });
    const _points = getPoints();
    json.curvesC0.forEach(curve => {
        if(curve.surface) {
            setAddBezierState(true);
            addBezierCurve();
            curve.pointsId.forEach(point => {
                addPointToCurve(_points.find(x => x.id === json.points[point].id));
            });
        }
    });
    turnOffAllStates();
    json.curvesC2.forEach(curve => {
        if(curve.surface) {
            setAddingC2State(true);
            addBsplineCurve();
            curve.pointsId.forEach(point => {
                addPointToCurve(_points.find(x => x.id === json.points[point].id));
            });
        }
    });
    turnOffAllStates();
    json.curvesC2I.forEach(curve => {
        setInterpolationState(true);
        addInterpolationCurve();
        curve.pointsId.forEach(point => {
            addPointToCurve(_points.find(x => x.id === json.points[point].id));
        });
    });
    turnOffAllStates();
    json.surfacesC0.forEach(surface => {// cylinder - TODO
        setAddingSurfaceState(true);
        let _surface = addSurface(surface.width, surface.height, false, surface.u, surface.v, "C0");
        _surface.pointsMap = [];
        surface.points.forEach(pointRow => {
            _surface.pointsMap.push([]);
            for(let i = 0; i < pointRow.length; i ++) {
                let len = _surface.pointsMap.length - 1;
                _surface.pointsMap[len].push(_points.find(x => x.id === json.points[surface.points[len][i]].id));
            }
        });
    });
    turnOffAllStates();
    json.surfacesC2.forEach(surface => {
        setAddingSurfaceState(true);
        let _surface = addSurface(surface.width, surface.height, false, surface.u, surface.v, "C2");
        _surface.pointsMap = [];
        surface.points.forEach(pointRow => {
            _surface.pointsMap.push([]);
            for(let i = 0; i < pointRow.length; i ++) {
                let len = _surface.pointsMap.length - 1;
                _surface.pointsMap[len].push(_points.find(x => x.id === json.points[surface.points[len][i]].id));
            }
        });
    });
    turnOffAllStates();
    Redraw();
}