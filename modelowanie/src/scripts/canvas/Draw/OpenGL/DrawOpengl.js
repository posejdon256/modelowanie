import { DrawMaterial } from '../DrawMaterial/DrawMaterial';
import { DrawMill } from '../DrawMill/DrawMill';
import mat4 from 'gl-matrix-mat4';
import { getGLCtx } from '../Draw';
import { getTranslationVector, getZooming, getRotationDatas } from '../../Translation/TranslationCenter/TranslationCenter';

export function OpenGLDrawScene(update) {
    DrawMaterial(update);
    DrawMill(update);
}
export function clearGL(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);
    // Set the view port
}
export function TranslateMatrix(pMatrix, mMatrix) {

    const gl = getGLCtx();

    let mxProjection = Array(16); 

    mat4.perspective(mxProjection, 0.3, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    gl.uniformMatrix4fv(pMatrix, false, mxProjection);
    
    let mxModel = Array(16);

    const rot = getRotationDatas();

    mat4.identity(mxModel);
    mat4.translate(mxModel, mxModel, [0, 0, -7]);
    mat4.translate(mxModel, mxModel, getTranslationVector());
    mat4.rotateX(mxModel,mxModel, rot.x);
    mat4.rotateY(mxModel, mxModel, rot.y);
    mat4.scale(mxModel, mxModel, getZooming());

    gl.uniformMatrix4fv(mMatrix, false, mxModel);
}