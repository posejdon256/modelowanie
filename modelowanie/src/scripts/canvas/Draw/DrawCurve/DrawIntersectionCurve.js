import { getCuttingCurves } from "../../CuttingCurve/CuttingCurve";
import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getContexts, drawLine } from "../Draw";

export function _DrawIntersectionCurves() {
    const curves = getCuttingCurves();
    curves.forEach(curve => {
        if(curve.points.length > 0) {         
            setTranslationPoints(curve.points);
            const points = Translate({});
            const { ctx } = getContexts();
            ctx.strokeStyle = "rgba(255, 0, 0, 1)";
            ctx.beginPath();
            for(let i = 1; i < points.length; i ++) {
                const x1 = (points[i - 1].x + 1) * 500;
                const y1 = (points[i - 1].y + 1) * 350;
                const z1 = points[i - 1].z;

                const x2 = (points[i].x + 1) * 500;
                const y2 = (points[i].y + 1) * 350;
                const z2 = points[i].z;
                if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -5 || z1 > 5
                    || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -5 || z2 > 5)
                    continue;
                drawLine(x1, y1, x2, y2, ctx);
            }
            ctx.stroke();
        } 
    });
}