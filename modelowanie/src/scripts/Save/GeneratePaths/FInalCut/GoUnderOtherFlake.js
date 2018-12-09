import { getDatasOfMill } from "../Helpers/GeneratePathsHelper";
import { DiffPoints } from "../../../Helpers/Helpers";
import { isIntersectionClose } from "./IntersectionCollision";

export function proceedPoint(sId, p, pointsInPart, u) {
    const { aboveDraw } = getDatasOfMill();
    if((sId === 2|| sId === 4) && isIntersectionClose(p, 0.005)) {
        return {x: p.x, y: p.y, z: aboveDraw / 100};
    }
    if((sId === 6 || sId === 3 || sId === 5) && isIntersectionClose(p, 0.002)) {
        return {x: p.x, y: p.y, z: aboveDraw / 100};
    }
    if((sId === 1) && isIntersectionClose(p, 0.012)) {
        return {x: p.x, y: p.y, z: aboveDraw / 100};
    }
    if(p.y < -0.40 && sId === 5) {
        return {x: p.x, y: p.y, z: aboveDraw / 100};
    }   
    let minDist = 1000;
    let closestPoint = pointsInPart[0][0];
    for(let i = 0; i < pointsInPart.length; i ++) {
        const part = pointsInPart[i];
        if(part.id === sId) continue;
        for(let j = 0; j < part.length; j ++) {
            const len = getXYVectioLength(p, part[j]);
            if(len < minDist && part[j].z > 0) {
                minDist = len;
                closestPoint = part[j];
            }
        }
    }
    if(closestPoint.z < p.z) {
        return p;
    }
    return {x: p.x, y: p.y, z: aboveDraw / 100};
}
function getXYZVectioLength(p1, p2) {
    const p = DiffPoints(p1, p2);
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2) + Math.pow(p.z, 2));
}
function getXYVectioLength(p1, p2) {
    const p = DiffPoints(p1, p2);
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
}