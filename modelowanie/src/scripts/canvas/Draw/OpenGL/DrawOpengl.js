import { DrawMill } from "../DrawMill/DrawMill";
import { DrawMaterial } from "../DrawMaterial/DrawMaterial";
import { getCanvas, getGLCtx } from "../Draw";
import { getShaderProgram, getModelMx, getProjectionMx } from "../../OpenGL/Init/InitOpenGL";
import { getLastTranslation } from "../../Translation/TranslationCenter/TranslationCenter";
import getProjectionMatrix from "../../Translation/Projection/Projection";

export function OpenGLDrawScene() {
    let gl = getGLCtx();

    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    var Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

    var normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);

    // Get the attribute location
    /*============ Drawing the triangle =============*/

    // Clear the canvas

    DrawMaterial(gl, vertex_buffer, Index_Buffer, normalsBuffer);
    DrawMill(gl, vertex_buffer, Index_Buffer);
}
export function clearGL(gl) {
    const canvas = getCanvas();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);
    // Set the view port
}