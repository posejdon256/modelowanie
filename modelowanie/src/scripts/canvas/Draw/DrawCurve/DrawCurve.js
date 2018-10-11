import { getCurves, getCurvesPoints } from "../../Bezier/Curve";
import { DrawLines } from "../DrawLine/DrawLines";

export function _DrawCurves() {
    const points = getCurvesPoints();
    drawChaines();
    let color = {r: 80, g: 168, b: 227, a: 1};
    if(points.length > 0 && points[0].selected){
        color = {r: 255, g: 0, b: 0, a: 1};
    }
    DrawLines([{points: points, trim: false}], color);
}

function drawChaines() {
    const curves = getCurves();
    let points;
    for(let i = 0; i < curves.length; i ++) {
        if(!curves[i].chain)
            continue;
        if(curves[i].surface && curves[i].type === "C2") {
            points = curves[i].pointsBspline; 
            DrawLines([{points: points, trim: false}]);
        } else {
            points = curves[i].points;
            DrawLines([{points: points, trim: false}]);
        }
    }
}