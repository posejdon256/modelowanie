import { DiffPoints, TryParseFloat } from '../../../Helpers/Helpers';
import { getDrillSpecification, getPointsToDrill } from '../../../Load/ReadMill/ReadMill';
import Redraw from '../../Draw/Redraw';
import { Bresenham, updateZInBrezenhamy } from '../Bresenham/Bresenham';
import {
    convertFromIndexToPlace,
    convertFromPlaceToIndex,
    createBananaFirstStep,
    cut,
    settArrayWidthAndHeight,
} from '../Material/Drilling';
import { getMaterial } from '../Material/Material';
import { generateMill, getMillPosition, removeMill, updateMillPosition } from '../Mill/Mill';

let speed = 1;
let automatic = false;

let i;
export function _setAutomatic() {
    automatic = !automatic;
}
export function _setSpeed(_speed) {
    speed = TryParseFloat(_speed, speed);
}
export function Drill() {
    i = 0;
    removeMill();
    generateMill();
    const drillPoints = getPointsToDrill();
    const { materialPoints } = getMaterial();
    if(materialPoints.length === 0) {
        alert("Please add material");
        return;
    }
    const points = cutPoints(drillPoints);
    const spec = getDrillSpecification();
    if(automatic) {
        for(let j = 0; j < points.length; j ++) {
            updatePoint(points, j, spec);
        }
        Redraw();
        return;
    }
    let id = setInterval(function(){

        const drillPos = getMillPosition();
        if(!points[i] || i >= points.length) {
            clearInterval(id);
            if(automatic) {
                Redraw();
            }
            return;
        }
        const p = convertFromIndexToPlace(points[i].x, points[i].y, points[i].z);
        const newCenter = DiffPoints([p.x, p.y, p.z] , [drillPos.x, drillPos.y, drillPos.z]);

        if(points[i].banana1) {
            createBananaFirstStep(p, spec.mm, spec.k);
        } else if(points[i].banana2) {
         //   createBananaSecondStep(p, spec.k);
        }
        cut(points[i].x, points[i].y);

        updateMillPosition(newCenter[0], newCenter[1], newCenter[2]);
        if(i % speed === 0 && !automatic) {
            Redraw();
        }

        i ++;
    }, 1);
}
function updatePoint(points, j, spec) {
    const p = convertFromIndexToPlace(points[j].x, points[j].y, points[j].z);
    if(points[j].banana1) {
        createBananaFirstStep(p, spec.mm, spec.k);
    }
    cut(points[j].x, points[j].y);
}
function cutPoints(points) {
    let _points = [];
    const { material2D } = getMaterial();

    settArrayWidthAndHeight(material2D.length, material2D[0].length);

    for(let i = 1; i < points.length; i ++) {
        const p1 = convertFromPlaceToIndex(points[i - 1]);
        const p2 = convertFromPlaceToIndex(points[i]);
        const brezenhamy = Bresenham(p1.x, p1.y, p2.x, p2.y, i);
        _points = _points.concat(updateZInBrezenhamy(points[i- 1], points[i], brezenhamy));
    }
    return _points;
}