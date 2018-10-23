import { DrawMill } from "../DrawMill/DrawMill";
import { DrawMaterial } from "../DrawMaterial/DrawMaterial";
import { getCanvas, getGLCtx } from "../Draw";
import { getShaderProgram, getModelMx, getProjectionMx } from "../../OpenGL/Init/InitOpenGL";
import { getLastTranslation } from "../../Translation/TranslationCenter/TranslationCenter";
import getProjectionMatrix from "../../Translation/Projection/Projection";

export function OpenGLDrawScene() {
    DrawMaterial();
    DrawMill();
}
export function clearGL(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);
    // Set the view port
}