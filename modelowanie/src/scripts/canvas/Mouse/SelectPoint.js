import { getPoints, selectPoint } from "../Points/Points";
import Translate, { setTranslationPoints } from "../Translation/TranslationCenter/TranslationCenter";
import Redraw from "../Draw/Redraw";
import { getStereoscopy } from "../Stereoscopy/Stereoscopy";
import { setCursor, getCursor } from "../Cursor/Cursor";

export function selectPoints(x, y, byCursor, z) {
    const points = getPoints("on-scene");
    setTranslationPoints(points);
    let translatedPoints = Translate({});
    translatedPoints = getStereoscopy() ? translatedPoints.left : translatedPoints;
    for(let i = 0; i < points.length; i ++) {
        if(byCursor && Math.sqrt(Math.pow(points[i].x - x, 2) + Math.pow(points[i].y - y, 2) + Math.pow(points[i].z - z, 2)) < 0.05) {
            selectPoint(points[i].id);
            Redraw();
            return points[i];
        } else if(Math.sqrt(Math.pow(((translatedPoints[i].x + 1) * 500) - x, 2) + Math.pow(((translatedPoints[i].y + 0.8) * 450) - y, 2)) < 10 ) {
            selectPoint(points[i].id);
            const _cursor = getCursor();
            // if(byCursor)
             setCursor(points[i].x, points[i].y, points[i].z);
            Redraw();
            return points[i];
        }
    }
    return undefined;
}