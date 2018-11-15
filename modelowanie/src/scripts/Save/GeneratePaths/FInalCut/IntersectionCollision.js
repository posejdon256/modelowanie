import { DiffPoints } from '../../../Helpers/Helpers';

export function isIntersectionClose(p, pointsBefore) {
    for(let i = 0; i < pointsBefore.length; i ++) {
        if(getXYVectioLength(p, pointsBefore[i]) < 0.05) {
            return true;
        }
    }
    return false
}
function getXYVectioLength(p1, p2) {
    const p = DiffPoints(p1, p2);
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2));
}