import { getMaterial } from '../../Mill/Material/Material';
import { DrawLinesOnTranslatedPoints, DrawLnesOpenGL } from '../DrawLine/DrawLines';
import Translate, { setTranslationPoints }  from '../../Translation/TranslationCenter/TranslationCenter';

export function DrawMaterial() {
    const { materialPoints, materialTransformedBottom, indices} = getMaterial();
    if(materialPoints.length === 0) {
        return;
    }
    let points = [].concat(materialPoints).concat(materialTransformedBottom);
    let max = 0;
    for(let i = 0; i < indices.length; i ++) {
        max = max < indices[i] ? indices[i] : max;
    }
   console.log(max);
    setTranslationPoints(points);
    const _points = Translate({});
    DrawLnesOpenGL(_points, indices);
    //DrawLinesOnTranslatedPoints(_points, {r: 229, g: 114, b: 84});
}