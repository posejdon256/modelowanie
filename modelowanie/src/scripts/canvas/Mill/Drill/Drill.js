import { generateMill, getMillPosition, updateMillPosition, removeMill } from "../Mill/Mill";
import Redraw from "../../Draw/Redraw";
import { getPointsToDrill, getDrillSpecification } from "../../../Load/ReadMill/ReadMill";
import { DiffPoints } from "../../../Helpers/Helpers";
import { Bresenham, updateZInBrezenhamy } from "../Bresenham/Bresenham";
import { convertFromPlaceToIndex, convertFromIndexToPlace, createBananaFirstStep, createBananaSecondStep, cut, settArrayWidthAndHeight } from "../Material/Drilling";
import { getMaterial, getxSize, getySize } from "../Material/Material";
const speed = 0.2;

let i;
export function Drill() {
    i = 0;
    removeMill();
    generateMill();
    const points = cutPoints(getPointsToDrill());
    const spec = getDrillSpecification();
    let id = setInterval(function(){

        const drillPos = getMillPosition();
        const p = convertFromIndexToPlace(points[i].x, points[i].y, points[i].z);
        const newCenter = DiffPoints([p.x, p.y, p.z] , [drillPos.x, drillPos.y, drillPos.z]);

        if(points[i].banana1) {
            createBananaFirstStep(p, spec.mm, spec.k);
        } else if(points[i].banana2) {
            createBananaSecondStep(p, spec.k);
        }
        cut(points[i].x, points[i].y);
        
        updateMillPosition(newCenter[0], newCenter[1], newCenter[2]);
        Redraw();

        i ++;
        if(i === points.length) {
            clearInterval(id);
        }
    }, 10 * speed);
}
function cutPoints(points) {
    let _points = [];
    const { material2D } = getMaterial();

    settArrayWidthAndHeight(material2D.length, material2D[0].length);

    for(let i = 1; i < points.length; i ++) {
        const p1 = convertFromPlaceToIndex(points[i - 1]);
        const p2 = convertFromPlaceToIndex(points[i]);
        const brezenhamy = Bresenham(p1.x, p1.y, p2.x, p2.y);
        _points = _points.concat(updateZInBrezenhamy(points[i- 1], points[i], brezenhamy));
    }
    return _points;
}