import { getSurfaces } from "../../../canvas/Surface/Surface";
import { evaluate } from "../../../canvas/CuttingCurve/FindIntersection";
import { DrawPoint } from "../../../canvas/Draw/DrawPoints/DrawPoints";
import { addPoint } from "../../../canvas/Points/Points";
import { getDatasOfMill } from "../Helpers/GeneratePathsHelper";
import { evaluatePointWithCross } from "./Third";

export function cutUnderProperller() {
    const propeller = getSurfaces().find(x => x.id === 1);
    const points = [];
    const { aboveDraw } = getDatasOfMill();

    let _eval = evaluate(propeller,  0, 1);
    points.push({x: _eval.x, y: _eval.y, z: aboveDraw / 100});

    for(let i = 0; i < 100; i ++) {
        _eval = evaluatePointWithCross(propeller, (3 * i / 100), 1);
        points.push({x: _eval.x, y: _eval.y, z: _eval.z});
    }
    return points;
}