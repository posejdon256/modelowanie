import { getMaterial } from '../../Mill/Material/Material';
import Translate, { setTranslationPoints }  from '../../Translation/TranslationCenter/TranslationCenter';
import { getCanvas, getGLCtx } from '../Draw';

export function DrawMaterial(gl, vb, ib) {
    const { materialPoints, materialTransformedBottom, indices} = getMaterial();
    if(materialPoints.length === 0) {
        return;
    }
    let points = [].concat(...materialPoints).concat(...materialTransformedBottom);
    //setTranslationPoints(points);
    //const _points = Translate({});
    DrawLnesOpenGL(points, indices, gl, vb, ib);
    //DrawLinesOnTranslatedPoints(points, {r: 229, g: 114, b: 84});
}
function DrawLnesOpenGL(points, indices, gl, vb, ib) {
    // Create an empty buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // Bind appropriate array buffer to it
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    /*=================== Shaders ====================*/
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    // Draw the triangle
    gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
}