import { getCuttingCurves } from '../../../canvas/CuttingCurve/CuttingCurve';
import { DiffPoints, getVectorLength, SumPoints } from '../../../Helpers/Helpers';
import { getCross } from '../Helpers/GeneratePathsHelper';
import { addPoint } from '../../../canvas/Points/Points';
import { DrawPoint } from '../../../canvas/Draw/DrawPoints/DrawPoints';
import { getXYVectioLength } from '../FInalCut/IntersectionCollision';

export function trayectoryOnCurves() {
    const curves = getCuttingCurves();
    let points = [];
    //nose to leg1
    points.push({x: -0.6, y: 0});
    points.push({x: -0.6, y: 0, z: 0.2});
    let ret = goOnCurveToCurve(curves[6], curves[8], 0, 1, true);
    points = points.concat(ret._points);
    
    //leg1 to skid1
    ret = goOnCurveToCurve(curves[8], curves[9], ret.ind1, ret.ind1 + 1);
    points = points.concat(ret._points);
    
    //skid1 to skid2
    ret = goOnCurveToCurve(curves[9], curves[10], ret.ind1, ret.ind1 + 1);
    points = points.concat(ret._points);
    
    //skid2 to skid1
    ret = goOnCurveToCurve(curves[10], curves[9], ret.ind1 + 8, ret.ind1 + 9);
    points = points.concat(ret._points);
    
    //skid1 to leg2
    ret = goOnCurveToCurve(curves[9], curves[8], ret.ind1, ret.ind1 + 1);
    points = points.concat(ret._points);
    
    //leg2 to bely
    ret = goOnCurveToCurve(curves[8], curves[6], ret.ind1, ret.ind1 + 1);
    points = points.concat(ret._points);
    
    //bely to back
    ret = goOnCurveToCurve(curves[6], curves[5], ret.ind1, ret.ind1 + 1, true);
    points = points.concat(ret._points);

    //back to tail2
    ret = goOnCurveToCurve(curves[5], curves[1], ret.ind1, ret.ind1 + 1, true);
    points = points.concat(ret._points);
    
    //tail2 to tail1
    ret = goOnCurveToCurve(curves[1], curves[2], ret.ind1, ret.ind1 + 1);
    points = points.concat(ret._points);
    
    //tail1 to back
    ret = goOnCurveToCurve(curves[2], curves[5], ret.ind1, ret.ind1 + 1);
    points = points.concat(ret._points);
    
    //back to stand
     ret = goOnCurveToCurve(curves[5], curves[3], ret.ind1, ret.ind1 + 1);
     points = points.concat(ret._points);
    
    // //stand to propeller
     ret = goOnCurveToCurve(curves[3], curves[0], ret.ind1, ret.ind1 - 1);
     points = points.concat(ret._points);
    
    // //propeller to stand
     ret = goOnCurveToCurve(curves[0], curves[5], ret.ind1 + 5, ret.ind1 + 6);
     points = points.concat(ret._points);
    

     ret = goOnCurveToCurve(curves[0], curves[4], 0, 1);
     points = points.concat(ret._points);
    
    // //stand to back
     ret = goOnCurveToCurve(curves[4], curves[5], ret.ind1, ret.ind1 - 1);
     points = points.concat(ret._points);
    
    // //back to bely
     ret = goOnCurveToCurve(curves[5], curves[10], ret.ind1, ret.ind1 + 1);
     points = points.concat(ret._points);
     points.push({x: points[2].x, y: points[2].y, z: points[2].z });
    
    return points;

}
export function goOnCurveToCurve(c1, c2, ind1, ind2, veryClose) {
    let j, i;
    let close = (veryClose ? 0.003 :0.02);
     if(c2.ob1.id === 5 && c1.ob1.id === 1) {
         close = 0.027;
     }
    const points = [];
    if(ind1 < ind2) {
        for(i = ind2; i < c1.points.length - 1; i ++) {
            const cross1 = c1.ob1.id === 5 ? SumPoints(c1.points[i], getCross(c1.ob1, c1.u1[i], c1.v1[i])) : DiffPoints(c1.points[i], getCross(c1.ob1, c1.u1[i], c1.v1[i]));
            points.push(cross1);
            for(j = 0; j < c2.points.length - 1; j ++) {
                const cross2 = c2.ob1.id === 5 ? SumPoints(c2.points[j], getCross(c2.ob1, c2.u1[j], c2.v1[j])) :  DiffPoints(c2.points[j], getCross(c2.ob1, c2.u1[j], c2.v1[j]));
                if(getXYVectioLength(cross1, cross2) < close && Math.abs(ind2 - i) > 5) {
                    return {_points: points, ind1: j};
                }
            }
        }
    } else {
        for(i = ind2; i >= 1; i --) {
             const cross1 = c1.ob1.id === 5 ? SumPoints(c1.points[i], getCross(c1.ob1, c1.u1[i], c1.v1[i])) : DiffPoints(c1.points[i], getCross(c1.ob1, c1.u1[i], c1.v1[i]));
            points.push(cross1);
           // points.push(c1.points[i]);
            for(j = 0; j < c2.points.length - 1; j ++) {
                const cross2 = c2.ob1.id === 5 ? SumPoints(c2.points[j], getCross(c2.ob1, c2.u1[j], c2.v1[j])) :  DiffPoints(c2.points[j], getCross(c2.ob1, c2.u1[j], c2.v1[j]));
                if(getVectorLength(cross1, cross2) < close && Math.abs(ind2 - i) > 5) {
                    return {_points: points, ind1: j};
                }
            }
        }
    }
    console.log("problem with connection");
    return {_points: points, ind1: 0} ;
}