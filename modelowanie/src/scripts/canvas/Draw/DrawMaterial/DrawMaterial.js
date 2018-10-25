import { getMaterial } from '../../Mill/Material/Material';
import {
    getIndexBuffer,
    getModelMx,
    getNormalBuffer,
    getProjectionMx,
    getShaderProgram,
    getVertexBuffer,
    getTexture,
} from '../../OpenGL/Init/InitOpenGL';
import { getGLCtx } from '../Draw';
import { clearGL, TranslateMatrix } from '../OpenGL/DrawOpengl';

export function DrawMaterial(update) {

    const { materialPoints, indices, normals} = getMaterial();
    if(materialPoints.length === 0) {
        return;
    }
    if(update) {
        updateBuffers(materialPoints, indices, normals);
    }
    DrawLnesOpenGL(materialPoints, indices, normals);
}
function DrawLnesOpenGL(points, indices, normals) {

    const gl = getGLCtx();
    const vb = getVertexBuffer();
    const ib = getIndexBuffer();
    const nb = getNormalBuffer();

    const shaderProgram = getShaderProgram();

    gl.useProgram(shaderProgram);

    let coord = gl.getAttribLocation(shaderProgram, "position");
    let normal = gl.getAttribLocation(shaderProgram, "normal");

    // Point an attribute to the currently bound VBO
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, nb);
    gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    gl.enableVertexAttribArray(normal);
    //var buffer = gl.createBuffer();
    clearGL(gl);

    TranslateMatrix(getProjectionMx(), getModelMx());

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, getTexture());
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.drawArrays(gl.TRIANGLES, 0, indices.length);
}
function updateBuffers(points, indices, normals) {
    const gl = getGLCtx();
    const vb = getVertexBuffer();
    const ib = getIndexBuffer();
    const nb = getNormalBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    gl.bindBuffer(gl.ARRAY_BUFFER, nb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
}