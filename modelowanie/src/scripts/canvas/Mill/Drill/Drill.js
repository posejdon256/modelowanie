import { generateMaterial, cutCircle } from "../Material/Material";
import { generateMill, getMillPosition, updateMillPosition, removeMill } from "../Mill/Mill";
import Redraw from "../../Draw/Redraw";
import { getPointsToDrill, getDrillSpecification } from "../../../Load/ReadMill/ReadMill";
import { DiffPoints } from "../../../Helpers/Helpers";
const speed = 0.2;

let i = 0;
export function Drill() {
    i = 0;
    removeMill();
    generateMill();
    const points = cutPoints(getPointsToDrill());
    let id = setInterval(function(){
        const drillPos = getMillPosition();
        const newCenter = DiffPoints([points[i].x, points[i].y, points[i].z] , [drillPos.x, drillPos.y, drillPos.z]);
        const spec = getDrillSpecification();
       // cutCircle(drillPos, spec.mm / 1000, spec.k ? 1: 0);
        updateMillPosition(newCenter[0], newCenter[1], newCenter[2]);
        Redraw();
        i ++;
        if(i === points.length) {
            clearInterval(id);
        }
    }, 10);
}
function cutPoints(points) {
    const _points = [];
    const rAspeed = getDrillSpecification().mm * speed;
    for(let i = 1; i < points.length; i ++) {
        _points.push(points[i - 1]);
        const len = parseInt((2 
        * Math.sqrt(Math.pow(points[i - 1].x - points[i].x, 2) + Math.pow(points[i - 1].y - points[i].y, 2) + Math.pow(points[i - 1].z - points[i].z, 2))) 
        * speed * 80 , 10);
        const stepX = (points[i].x - points[i - 1].x) / len;
        const stepY = (points[i].y - points[i - 1].y) / len;
        const stepZ = (points[i].z - points[i - 1].z) / len;
        for(let j = 0; j < len; j ++) {
            _points.push({x: _points[_points.length - 1].x + stepX, y: _points[_points.length - 1].y + stepY, z: _points[_points.length - 1].z + stepZ});
        }
    }
    return _points;
}