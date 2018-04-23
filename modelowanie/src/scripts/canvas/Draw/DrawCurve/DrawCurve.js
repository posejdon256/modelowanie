import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getCanvas, drawLine, stereoscopyDraw } from "../Draw";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";
import { getCurves, getCurvesPoints } from "../../Bezier/Curve";

export function _DrawCurves(ctx, ctxS1, ctxS2) {
    const points = getCurvesPoints();
    const stereoscopy = getStereoscopy();
    drawChaines(ctx, ctxS1, ctxS2);
    setTranslationPoints(points);
    const translated =  Translate({});
    const canvas = getCanvas();
    if(stereoscopy) {
        const { right, left} = translated;
        let img = ctxS1.getImageData(0, 0, canvas.width, canvas.height);
        ctxS1.strokeStyle = "rgba(236, 4, 0, 1)";
        ctxS2.strokeStyle = "rgba(0, 249, 247, 1)";
        ctxS1.beginPath();
        ctxS2.beginPath();
        for(let i = 1; i < left.length; i ++) {
            const x1 = (left[i - 1].x + 1) * 500;
            const y1 = (left[i - 1].y + 1) * 300;
            const z1 = left[i - 1].z;

            const x2 = (left[i].x + 1) * 500;
            const y2 = (left[i].y + 1) * 300;
            const z2 = left[i].z;

            if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -100 || z1 > 100
            || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -100 || z2 > 100)
                continue;
            drawLine(x1, y1, x2, y2, ctxS1);
            //drawPixel(x, y, img, ctxS1, rgb);
        }
        ctxS1.putImageData(img, 0, 0);
        for(let i = 1; i < right.length; i ++) {
            const x1 = (right[i - 1].x + 1) * 500;
            const y1 = (right[i - 1].y + 1) * 300;
            const z1 = right[i - 1].z;

            const x2 = (right[i].x + 1) * 500;
            const y2 = (right[i].y + 1) * 300;
            const z2 = right[i].z;

            if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -100 || z1 > 100
                || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -100 || z2 > 100)
                continue;
            drawLine(x1, y1, x2, y2, ctxS2);
        }
        ctxS1.stroke();
        ctxS2.stroke()
        //stereoscopyDraw();
    } else {
        if(points.length > 0 && points[0].selected)
            ctx.strokeStyle = "rgba(255, 0, 0, 1)";
        else
            ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        ctx.beginPath();
        for(let i = 1; i < translated.length; i ++) {
            const x1 = (translated[i - 1].x + 1) * 500;
            const y1 = (translated[i - 1].y + 1) * 300;
            const z1 = translated[i - 1].z;

            const x2 = (translated[i].x + 1) * 500;
            const y2 = (translated[i].y + 1) * 300;
            const z2 = translated[i].z;
            if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -100 || z1 > 100
                || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -100 || z2 > 100)
                continue;
            if(points[i].break) {
                ctx.closePath();
                if(i !== points.length - 1 && points[i + 1].selected)
                    ctx.strokeStyle = "rgba(255, 0, 0, 1)";
                else
                    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
                continue;
            }
            drawLine(x1, y1, x2, y2, ctx);
        }
        ctx.stroke();
       // ctx.putImageData(img, 0, 0);
    }
}

function drawChaines(ctx, ctxS1, ctxS2) {
    const curves = getCurves();
    const stereoscopy = getStereoscopy();
    for(let i = 0; i < curves.length; i ++) {
        if(!curves[i].chain)
            continue;
        if(curves[i].surface && curves[i].type === "C2") {
                setTranslationPoints(curves[i].pointsBspline);
        } else {
               setTranslationPoints(curves[i].points);
        }
        const translated = Translate({});
        
        if(!stereoscopy) {
            ctx.strokeStyle = "rgba(0, 0, 255, 1)";
            ctx.beginPath();
            for(let j = 0; j < curves[i].points.length-1; j ++) {
                drawLine(parseInt((translated[j].x + 1) * 500, 10), parseInt((translated[j].y + 1) * 300, 10), parseInt((translated[j + 1].x + 1) * 500, 10), parseInt((translated[j + 1].y + 1) *300, 10), ctx);
            }
            ctx.stroke();
        } else {
            const {left, right} = translated;
            ctxS1.strokeStyle = "rgba(236, 4, 0, 1)";
            ctxS2.strokeStyle = "rgba(0, 249, 247, 1)";  
            ctxS1.beginPath();
            for(let j = 0; j < curves[i].points.length-1; j ++) {
                drawLine(parseInt((left[j].x + 1) * 500, 10), parseInt((left[j].y + 1) * 300, 10), parseInt((left[j + 1].x + 1) * 500, 10), parseInt((left[j + 1].y + 1) *300, 10), ctxS1);
            }
            ctxS1.stroke();    
            ctxS2.beginPath();
            for(let j = 0; j < curves[i].points.length-1; j ++) {
                drawLine(parseInt((right[j].x + 1) * 500, 10), parseInt((right[j].y + 1) * 300, 10), parseInt((right[j + 1].x + 1) * 500, 10), parseInt((right[j + 1].y + 1) *300, 10), ctxS2);
            }
            ctxS2.stroke();
            stereoscopyDraw();   
        }
    }
}