import { getDatasOfMill } from "../Helpers/GeneratePathsHelper";
import { DiffPoints } from "../../../Helpers/Helpers";
import { isIntersectionClose } from "./IntersectionCollision";

export function proceedPoint(sId, p, pointsInPart, u) {
    const { aboveDraw } = getDatasOfMill();
    if(isIntersectionClose(p)) {
        return {x: p.x, y: p.y, z: aboveDraw / 100};
    }
    if(p.y < -0.40 && sId === 5) {
        return {x: p.x, y: p.y, z: aboveDraw / 100};
    }
    for(let i = 0; i < pointsInPart.length; i ++) {
        const part = pointsInPart[i];
        if(part.id === sId) continue;
        for(let j = 0; j < part.length; j ++) {
            if((getXYVectioLength(p, part[j]) < 0.005 && p.z < part[j].z)
            || (getXYVectioLength(p, part[j]) < 0.005 && p.z < part[j].z && part.id === 1)) {
                return {x: p.x, y: p.y, z: aboveDraw / 100};
            }
        }
    }
    return p;
}
function getXYZVectioLength(p1, p2) {
    const p = DiffPoints(p1, p2);
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2) + Math.pow(p.z, 2));
}
function getXYVectioLength(p1, p2) {
    const p = DiffPoints(p1, p2);
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
}