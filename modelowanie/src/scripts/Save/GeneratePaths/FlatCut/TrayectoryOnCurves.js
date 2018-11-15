import { getCuttingCurves } from '../../../canvas/CuttingCurve/CuttingCurve';
import { DiffPoints, getVectorLength, SumPoints } from '../../../Helpers/Helpers';
import { getCross } from '../Helpers/GeneratePathsHelper';

export function trayectoryOnCurves() {
    const curves = getCuttingCurves();
    let points = [];
    //nose to leg1
    let ret = goOnCurveToCurve(curves[6], curves[8], 0, 1);
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
    
    //bely to tail2
    ret = goOnCurveToCurve(curves[6], curves[1], ret.ind1, ret.ind1 + 1);
    points = points.concat(ret._points);
    
    //tail2 to tail1
    ret = goOnCurveToCurve(curves[1], curves[2], ret.ind1, ret.ind1 + 1);
    points = points.concat(ret._points);
    
    //tail1 to back
    ret = goOnCurveToCurve(curves[2], curves[5], ret.ind1, ret.ind1 + 1);
    points = points.concat(ret._points);
    
    //back to stand
    ret = goOnCurveToCurve(curves[5], curves[3], ret.ind1, ret.ind1 + 1, true);
    points = points.concat(ret._points);
    
    //stand to propeller
    ret = goOnCurveToCurve(curves[3], curves[0], ret.ind1, ret.ind1 - 1);
    points = points.concat(ret._points);
    
    //propeller to stand
    ret = goOnCurveToCurve(curves[0], curves[4], ret.ind1 + 5, ret.ind1 + 6);
    points = points.concat(ret._points);
    

    ret = goOnCurveToCurve(curves[0], curves[4], ret.ind1, ret.ind1 + 1, true);
    points = points.concat(ret._points);
    
    //stand to back
    ret = goOnCurveToCurve(curves[4], curves[5], ret.ind1, ret.ind1 - 1);
    points = points.concat(ret._points);
    
    //back to bely
    ret = goOnCurveToCurve(curves[5], curves[10], ret.ind1, ret.ind1 + 1);
    points = points.concat(ret._points);
    
    return points;

}
function goOnCurveToCurve(c1, c2, ind1, ind2, derrrivativeChange) {
    let j, i;
    const points = [];
    if(ind1 < ind2) {
        for(i = ind2; i < c1.points.length - 1; i ++) {
            let cross1 = getCross(c1.ob, c1.u[i], c1.v[i]);
            //addPoint(c1.points[i].x - cross1.x, c1.points[i].y - cross1.y, 0, "mill");
            points.push(DiffPoints(c1.points[i], cross1));
            for(j = 0; j < c2.points.length - 1; j ++) {
                const cross2 = getCross(c2.ob, c2.u[j], c2.v[j]);
                if(getVectorLength(DiffPoints(c1.points[i], cross1), DiffPoints(c2.points[j], cross2)) < 0.01 && !derrrivativeChange) {
                    return {_points: points, ind1: j};
                } else if(getVectorLength(DiffPoints(c1.points[i], cross1), SumPoints(c2.points[j], cross2)) < 0.01 && derrrivativeChange) {
                    return {_points: points, ind1: j};
                }
            }
        }
    } else {
        for(i = ind2; i >= 1; i --) {
            let cross1 = getCross(c1.ob, c1.u[i], c1.v[i]);
           // addPoint(c1.points[i].x + cross1.x, c1.points[i].y + cross1.y, 0, "mill");
            //addPoint(c1.points[i].x, c1.points[i].y, c1.points[i].z, "mill");
            points.push(SumPoints(c1.points[i], cross1));
           // points.push(c1.points[i]);
            for(j = 0; j < c2.points.length - 1; j ++) {
                const cross2 = getCross(c2.ob, c2.u[j], c2.v[j]);
                if(getVectorLength(SumPoints(c1.points[i], cross1), DiffPoints(c2.points[j], cross2)) < 0.01) {
                    return {_points: points, ind1: j};
                }
            }
        }
    }
    console.log("problem with connection");
    return {_points: points, ind1: 0} ;
}