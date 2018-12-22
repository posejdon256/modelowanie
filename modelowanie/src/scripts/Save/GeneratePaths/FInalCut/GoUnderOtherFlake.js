import { getDatasOfMill } from "../Helpers/GeneratePathsHelper";
import { DiffPoints } from "../../../Helpers/Helpers";
import { isIntersectionClose, findSmallestIntersection } from "./IntersectionCollision";

export function proceedPoint(sId, p, pointsInPart, uvPoint) {
    const { aboveDraw } = getDatasOfMill();
    let interPoint;
    if(sId === 1) {
        interPoint = isIntersectionClose(p, 0.005, uvPoint, sId);
    } else if(sId === 5) {
        interPoint = isIntersectionClose(p, 0.005, uvPoint, sId);
    }
     else {
        interPoint = isIntersectionClose(p, 0.005, uvPoint, sId);
    } 
    if(interPoint) {
        return interPoint;
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
    
    if(sId === 1 && Math.abs(closestPoint.z - p.z) < 0.001) {
        return {x: p.x, y: p.y, z: aboveDraw / 100};
    }
    if(closestPoint.z < p.z){
        return p;
    }
    return {x: p.x, y: p.y, z: aboveDraw / 100};
}
function getXYVectioLength(p1, p2) {
    const p = DiffPoints(p1, p2);
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
}