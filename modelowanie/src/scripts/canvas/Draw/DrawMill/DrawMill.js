import { getMill } from "../../Mill/Mill/Mill";
import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { getGLCtx, getCanvas } from "../Draw";

export function DrawMill(gl, vb, ib) {
    const { vertices, indices} = getMill();
    if(vertices.length === 0) {
        return;
    }
    //setTranslationPoints(vertices);
    //const _points = Translate({});
    DrawLnesOpenGL(vertices, indices, gl, vb, ib);
}
function DrawLnesOpenGL(points, indices, gl, vb, ib) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    //gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // Bind appropriate array buffer to it
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
   // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);

    // Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}