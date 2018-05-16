import { getContexts, drawLine } from "../Draw";
import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getGregoryVectors, getGregoryPoints } from "../../Gregory/Gregory";
import { UpdatePointsForCanvas } from "../../../Helpers/Helpers";

export function DrawGregoryVector(a, b) {
    
    const contexts = getContexts();
    contexts.ctx.strokeStyle = "rgba(255,220,0, 1)";
    contexts.ctx.beginPath();
    setTranslationPoints([a, b]);
    const points = UpdatePointsForCanvas(Translate({}));
    drawLine(points[0].x, points[0].y, points[1].x, points[1].y, contexts.ctx);
    contexts.ctx.stroke();
}
export function DrawGregor() {
    const points = getGregoryPoints();
    DrawGregoryPoints(points);
    const vectors = getGregoryVectors();
    vectors.forEach(vec => {
        DrawGregoryVector(vec[0], vec[1]);
    });
}
function DrawGregoryPoints(points) {
    const contexts = getContexts();
    contexts.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    setTranslationPoints(points);
    const _points = UpdatePointsForCanvas(Translate({}));
    _points.forEach(p => {
        contexts.ctx.beginPath();
        drawLine(p.x, p.y, p.x + 2, p.y + 2, contexts.ctx);
        contexts.ctx.stroke();
    });
}