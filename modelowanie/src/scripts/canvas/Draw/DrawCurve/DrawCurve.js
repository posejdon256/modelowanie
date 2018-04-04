import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { drawPixel, getCanvas, drawLine, stereoscopyDraw } from "../Draw";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";
import { getCurves, getCurvesPoints } from "../../Bezier/Curve";

export function _DrawCurves(ctx, ctxS1, ctxS2) {
    const points = getCurvesPoints();
    const stereoscopy = getStereoscopy();
    drawChaines(ctx, ctxS1, ctxS2);
    setTranslationPoints(points);
    const translated =  Translate({});
    let rgb = {r: 255, g: 255, b: 255, a: 255};
    const canvas = getCanvas();
    if(stereoscopy) {
        const { right, left} = translated;
        let img = ctxS1.getImageData(0, 0, canvas.width, canvas.height);
        rgb = {r: 236, g: 4, b: 0};
        for(let i = 0; i < left.length; i ++) {
            const x = (left[i].x + 1) * 500;
            const y = (left[i].y + 1) * 300;
            const z = left[i].z;
            if(x < 0 || y < 0 || x > 1000 || y > 700 || z < -100 || z > 100)
                continue;
            drawPixel(x, y, img, ctxS1, rgb);
        }
        ctxS1.putImageData(img, 0, 0);
        img = ctxS2.getImageData(0, 0, canvas.width, canvas.height);
        rgb = {r: 0, g: 249, b: 247};
        for(let i = 0; i < right.length; i ++) {
            const x = (right[i].x + 1) * 500;
            const y = (right[i].y + 1) * 300;
            const z = right[i].z;
            if(x < 0 || y < 0 || x > 1000 || y > 700 || z < -100 || z > 100)
                continue;
            drawPixel(x, y, img, ctxS2, rgb);
        }
        ctxS2.putImageData(img, 0, 0);
        stereoscopyDraw();
    } else {
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < translated.length; i ++) {
            const x = (translated[i].x + 1) * 500;
            const y = (translated[i].y + 1) * 300;
            const z = translated[i].z;
            if(x < 0 || y < 0 || x > 1000 || y > 700 || z < -100 || z > 100)
                continue;
            if(points[i].selected)
                rgb = {r: 255, g: 0, b: 0, a: 1};
            else 
                rgb = {r: 255, g: 255, b: 255, a: 255}
            drawPixel(x, y, img, ctx, rgb);
        }
        ctx.putImageData(img, 0, 0);
    }
}

function drawChaines(ctx, ctxS1, ctxS2) {
    const curves = getCurves();
    const stereoscopy = getStereoscopy();
    for(let i = 0; i < curves.length; i ++) {
        if(!curves[i].chain)
            continue;
        setTranslationPoints(curves[i].points);
        const translated = Translate({});
        
        if(!stereoscopy) {
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