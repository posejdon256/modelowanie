import { clearCurves, addPointToCurve } from "../canvas/Bezier/Curve";
import { clearPoints, addPoint, updatePointName, getPoints, removePoint } from "../canvas/Points/Points";
import { clearSurfaces, addSurface, setAddingSurfaceState } from "../canvas/Surface/Surface";
import { addBezierCurve, setAddBezierState } from "../canvas/Bezier/Bezier";
import { addBsplineCurve, setAddingC2State } from "../canvas/Bezier/BSpline";
import { addInterpolationCurve, setInterpolationState } from "../canvas/Bezier/Interpolation";
import Redraw from "../canvas/Draw/Redraw";
import { turnOffAllStates } from "../canvas/StatesCenter/StatesCenter";
import { addTorus } from "../canvas/Torus/Torus";

let path ="Ania3.json";

export function setPath(_path) {
    path =_path.substr(12, _path.length - 12);
}
export function Load() {
    console.log(path);
   // console.log(require);
    const json = require(`./../../DzialajaceTesty/${path}`);
    clearCurves();
    clearPoints();
    clearSurfaces();
    json.points.forEach(point => {
        let p = addPoint(point.x/10, point.y/10, point.z/10, "load");
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
    json.surfacesC0.forEach(surface => {
        setAddingSurfaceState(true);
        let _surface = addSurface(surface.flakeU, surface.flakeV, surface.cylinder, surface.u, surface.v, surface.name, "C0");
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
        setAddingC2State(true);
        let _surface = addSurface(surface.flakeU, surface.flakeV, surface.cylinder, surface.u, surface.v, surface.name, "C2");
        _surface.pointsMap = [];
        surface.points.forEach(pointRow => {
            _surface.pointsMap.push([]);
            const curve = addBsplineCurve({surface: true});
            _surface.curves.push(curve);
            for(let i = 0; i < pointRow.length; i ++) {
                let len = _surface.pointsMap.length - 1;
                _surface.pointsMap[len].push(_points.find(x => x.id === json.points[surface.points[len][i]].id));
                addPointToCurve(_surface.pointsMap[len][i]);
            }
        });
        for(var i = 0; i < surface.points[0].length; i ++) {
            const curve = addBsplineCurve({surface: true});
            _surface.curves.push(curve);
            for(var j = 0; j < surface.points.length; j ++) {
                addPointToCurve(_surface.pointsMap[j][i]);
            }
        }
    });
    json.points.forEach(point => {
        if(point.remove) {
            removePoint(point.id);
        }
    });
    json.toruses.forEach(torus => {
        addTorus(torus.r, torus.R, torus.u, torus.v, torus.center, torus.rotation, torus.scale);
    });
    turnOffAllStates();
    Redraw();
}