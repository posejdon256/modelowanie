import { getRAndr, getTorusLines, getTorusVisibility } from "../../Torus/Torus";
import { drawLine, getPixelColor, stereoscopyDraw } from "../Draw";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";

function drawTorusLines(lines, ctx, points) {
    const rs = getRAndr();
    ctx.beginPath();
    lines.forEach(line => {
        let bla = 10;
        let blaZ = 100;
        if(line[1] < points.length && line[0] < points.length && points[line[0]].z < 1 && points[line[0]].z > -blaZ && points[line[0]].x < bla && points[line[0]].x > -bla
            && points[line[0]].y < bla  && points[line[0]].y > -bla && points[line[1]].z < 1 && points[line[1]].z > -blaZ && points[line[1]].x < bla && points[line[1]].x > -bla
            && points[line[1]].y < bla && points[line[1]].y > -bla) {
            //console.log(points[line[0]].z, points[line[1]].x);
             drawLine(points[line[0]].x * (rs.R + rs.r) + (500), points[line[0]].y * (rs.R + rs.r)+ (350), points[line[1]].x * (rs.R + rs.r)+ (500), points[line[1]].y * (rs.R + rs.r)+ (350), ctx);
         }
    });
    ctx.stroke();
}
export function _DrawTorus(points, _ctx, _ctxStereo, _ctxStereo2){
    const torusVisible = getTorusVisibility();
    const stereoscopy = getStereoscopy();
    if(torusVisible) {
        drawTorus(points, _ctx, _ctxStereo, _ctxStereo2);
    }
    
    if(stereoscopy){
        stereoscopyDraw();
    }
}
function drawTorus(points, _ctx, _ctxStereo, _ctxStereo2) {
    const lines = getTorusLines();
    const stereoscopy = getStereoscopy();
    const {r, g, b, a} = getPixelColor();
    if(!stereoscopy) {
        _ctx.strokeStyle = "rgba("+r+","+g+","+b+","+a+")";
        drawTorusLines(lines, _ctx, points);
    } else {
        const { left, right } = points;
        
        _ctxStereo.strokeStyle = "rgba(236, 4, 0, 1)";
        _ctxStereo2.strokeStyle = "rgba(0, 249, 247, 1)";
        if(drawTorusLines) {
            drawTorusLines(lines, _ctxStereo2, left);
            drawTorusLines(lines, _ctxStereo, right);
        }
    }
}