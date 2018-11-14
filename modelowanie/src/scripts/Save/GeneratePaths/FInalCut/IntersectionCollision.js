import { DiffPoints } from '../../../Helpers/Helpers';

// 0 - no intersection
// 1 - go above
// 2 - go back
export function isIntersectionClose(p, interseciotns) {
    let minimum = Infinity;
    for(let j = 0; j < interseciotns.length; j ++) {
        const inter = interseciotns[j];
        for(let i = 0; i < inter.points.length; i ++) {
            const newInter = {x: inter.points[i].x, y: inter.points[i].y, z: 0};
            const newP = {x: p.x, y: p.y, z: 0};
            minimum = Math.min(minimum, getXYZVectioLength(newInter, newP));
            if(getXYZVectioLength(newInter, newP) <= 0.08) {
                if(inter.back === true) {
                    return 2;
                } else {
                    return 1;
                }
            }
        }
    }
    console.log(minimum);
    return 0;
}
function getXYZVectioLength(p1, p2) {
    const p = DiffPoints(p1, p2);
    return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2) + Math.pow(p.z, 2));
}