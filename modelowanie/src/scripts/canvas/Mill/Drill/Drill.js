import { DiffPoints, TryParseFloat, TryParseFloat2 } from '../../../Helpers/Helpers';
import { getRectangleCorners, getRectangleLines } from '../../../Helpers/LinesHelper';
import { getDrillSpecification, getPointsToDrill } from '../../../Load/ReadMill/ReadMill';
import Redraw from '../../Draw/Redraw';
import { getPointsDependsOnSpeed } from '../Bresenham/Bresenham';
import {
    convertFromIndexToPlace,
    convertFromPlaceToIndex,
    cut,
    findCircle,
    settArrayWidthAndHeight,
} from '../Material/Drilling';
import { getMaterial } from '../Material/Material';
import { generateMill, getMillPosition, removeMill, updateMillPosition } from '../Mill/Mill';
import { ScanLine } from './ScanLine';

let speed = 1;
let automatic = false;
let minimumValue = 0.2;
let id;


let i;
export function _setMinimumValue(_val) {
    const prev = minimumValue;
    minimumValue = TryParseFloat2(_val, 2);
    if(minimumValue !== prev) {
        minimumValue /= 10;
    }
}
export function _stop() {
    clearInterval(id);
}
export function _setAutomatic() {
    automatic = !automatic;
}
export function _setSpeed(_speed) {
    speed = TryParseFloat(_speed, speed);
}
export function Drill() {
    i = 1;
    removeMill();
    generateMill();
    updateMillPosition(0, 0, 1);
    const drillPoints = getPointsToDrill();
    const { materialPoints } = getMaterial();
    if(materialPoints.length === 0) {
        alert("Please add material");
        return;
    }
    let points;
    try{
        points = cutPoints(drillPoints);
    }
    catch(e) {
        alert(e);
        return;
    }
    const spec = getDrillSpecification();
    if(automatic) {
        for(let j = 1; j < points.length; j ++) {
            updatePoint(points, j, spec);
        }
        Redraw();
        return;
    }
    id = setInterval(function(){

        const drillPos = getMillPosition();
        if(!points[i] || i >= points.length) {
            clearInterval(id);
            if(automatic) {
                Redraw();
            }
            return;
        }
        const p = convertFromIndexToPlace(points[i].x, points[i].y, points[i].z);
        const p1 = convertFromIndexToPlace(points[i - 1].x, points[i - 1].y, points[i - 1].z);
        const p2 = convertFromIndexToPlace(points[i].x, points[i].y, points[i].z);

        let pointsToDrill = ScanLine(getRectangleCorners(p1, p2, spec.mm), getRectangleLines(p1, p2, spec.mm), p1, p2);
        pointsToDrill = pointsToDrill.concat(findCircle(p1, spec.mm,spec.k));
        pointsToDrill = pointsToDrill.concat(findCircle(p2, spec.mm,spec.k));
        const newCenter = DiffPoints([p.x, p.y, p.z] , [drillPos.x, drillPos.y, drillPos.z]);

        try{
            cut(points[i].z, points[i - 1].z, pointsToDrill);
        }
        catch(e) {
            clearInterval(id);
            alert(e);
        }

        updateMillPosition(newCenter[0], newCenter[1], newCenter[2]);
        if(i % speed === 0 && !automatic) {
            Redraw();
        }

        i ++;
    }, 1);
}
function updatePoint(points, j, spec) {

    const p1 = convertFromIndexToPlace(points[j - 1].x, points[j - 1].y, points[j - 1].z);
    const p2 = convertFromIndexToPlace(points[j].x, points[j].y, points[j].z);
    let pointsToDrill = ScanLine(getRectangleCorners(p1, p2, spec.mm), getRectangleLines(p1, p2, spec.mm), p1, p2);
    pointsToDrill = pointsToDrill.concat(findCircle(p1, spec.mm,spec.k));
    pointsToDrill = pointsToDrill.concat(findCircle(p2, spec.mm,spec.k));
    cut(points[j- 1].z, points[j].z, pointsToDrill);
}
function cutPoints(points) {
    let _points = [];
    const { material2D } = getMaterial();

    settArrayWidthAndHeight(material2D.length, material2D[0].length);

    for(let i = 1; i < points.length; i += 2) {
        const p1 = convertFromPlaceToIndex(points[i - 1]);
        const p2 = convertFromPlaceToIndex(points[i]);
        //const p2 = convertFromPlaceToIndex(points[i]);
        if(p1.z < minimumValue || p2.z < minimumValue) {
            throw Error("The cutter drills into the stand.");
        }
        const _pointsBetweend = getPointsDependsOnSpeed(p1, p2, speed);
        _points = _points.concat(_pointsBetweend);
    }
    return _points;
}