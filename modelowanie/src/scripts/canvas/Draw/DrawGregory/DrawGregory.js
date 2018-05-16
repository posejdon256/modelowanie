import { getContexts, drawLine } from "../Draw";
import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getGregoryVectors, getGregoryPoints, getGrzegorzys, createSmallPatch, RebuildGregory } from "../../Gregory/Gregory";
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
    const grzegorzes = getGrzegorzys();
    grzegorzes.forEach(greg => {
            RebuildGregory(greg.importantArrays, greg.points, greg.u, greg.v);
            if(greg.normals) {
                const vectors = getGregoryVectors();
                vectors.forEach(vec => {
                    DrawGregoryVector(vec[0], vec[1]);
                });
            }
    });
}