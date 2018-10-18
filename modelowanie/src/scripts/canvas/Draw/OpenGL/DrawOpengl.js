import { DrawMill } from "../DrawMill/DrawMill";
import { DrawMaterial } from "../DrawMaterial/DrawMaterial";
import { getCanvas, getGLCtx } from "../Draw";
import { getShaderProgram, getModelMx, getProjectionMx } from "../../OpenGL/Init/InitOpenGL";
import { getLastTranslation } from "../../Translation/TranslationCenter/TranslationCenter";
import getProjectionMatrix from "../../Translation/Projection/Projection";

export function OpenGLDrawScene() {
    const canvas = getCanvas();
    let gl = getGLCtx();

    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    var Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    let shaderProgram = getShaderProgram();
    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "position");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    let modelMx = getModelMx();
    let projMx = getProjectionMx();
    let mx = getLastTranslation();
    gl.uniformMatrix4fv(modelMx, false, mx);
    mx = getProjectionMatrix(1);
    gl.uniformMatrix4fv(projMx, false, mx);
    /*============ Drawing the triangle =============*/

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    DrawMaterial(gl, vertex_buffer, Index_Buffer);
    DrawMill(gl, vertex_buffer, Index_Buffer);
}