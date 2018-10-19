import { getMill } from "../../Mill/Mill/Mill";
import Translate, { setTranslationPoints, getLastTranslation } from "../../Translation/TranslationCenter/TranslationCenter";
import { getGLCtx, getCanvas } from "../Draw";
import { getShaderMill, getModelMx, getProjectionMx, getModelMxMill, getProjectionMxMill } from "../../OpenGL/Init/InitOpenGL";
import getProjectionMatrix from "../../Translation/Projection/Projection";

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
    const canvas = getCanvas();
    const shaderProgram = getShaderMill();
    gl.useProgram(shaderProgram);

    var coord = gl.getAttribLocation(shaderProgram, "position");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    let modelMx = getModelMxMill();
    let projMx = getProjectionMxMill();
    let mx = getLastTranslation();
    gl.uniformMatrix4fv(modelMx, false, mx);
    mx = getProjectionMatrix(1);
    gl.uniformMatrix4fv(projMx, false, mx);

   // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color and depth buffer
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);
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