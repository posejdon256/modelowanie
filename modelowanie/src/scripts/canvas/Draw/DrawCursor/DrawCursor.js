import { getCursor } from "../../Cursor/Cursor";
import { DrawLine } from "../DrawLine/DrawLine";

export function _DrawCursor(_ctx, _ctxStereo, _ctxStereo2) {
    const cursorLX = 0.1;
    const cursorLZ = 0.1;
    const cursorLY = 0.1;
    const cursor = getCursor();

    const points = [];
    points.push({x: 0, y: -cursor.y, z: cursor.z});
    points.push({x: cursor.x + cursorLX, y: -cursor.y, z: cursor.z});
    points.push({x: cursor.x, y: 0, z: cursor.z});
    points.push({x: cursor.x, y: -cursor.y - cursorLY, z: cursor.z});
    points.push({x: cursor.x, y: -cursor.y, z: 0});
    points.push({x: cursor.x, y: -cursor.y, z: cursor.z + cursorLZ});

    DrawLine(points[0], points[1], {r: 255, g: 0, b: 0}); //x is red
    DrawLine(points[2], points[3], {r: 0, g: 255, b: 0}); //y is green
    DrawLine(points[4], points[5], {r: 0, g: 0, b: 255});// z is blue
    //_ctx.strokeStyle = "rgba(206, 76, 76, 1)";

}