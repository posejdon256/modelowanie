import { getMill } from '../../Mill/Mill/Mill';
import {
    getIndexBufferMill,
    getModelMxMill,
    getProjectionMxMill,
    getShaderMill,
    getVertexBufferMill,
    getNormalBufferMill,
} from '../../OpenGL/Init/InitOpenGL';
import { getCanvas, getGLCtx } from '../Draw';
import { TranslateMatrix } from '../OpenGL/DrawOpengl';

export function DrawMill(update) {
    const { vertices, indices, normals} = getMill();
    if(vertices.length === 0) {
        return;
    }
    if(update) {
        updateBuffers(vertices, indices, normals);
    }

    DrawLnesOpenGL(vertices, indices, normals);
}
function DrawLnesOpenGL(points, indices, normals) {

    const canvas = getCanvas();
    const gl = getGLCtx();
    const shaderProgram = getShaderMill();

    const vb = getVertexBufferMill();
    const ib = getIndexBufferMill();
    const nb = getNormalBufferMill();

    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    let coord = gl.getAttribLocation(shaderProgram, "position");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    TranslateMatrix(getProjectionMxMill(), getModelMxMill());
    
    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    // Draw the triangle
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}
function updateBuffers(points, indices, normals) {
    const gl = getGLCtx();
    const vb = getVertexBufferMill();
    const ib = getIndexBufferMill();
    const nb = getNormalBufferMill();

    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    // gl.bindBuffer(gl.ARRAY_BUFFER, nb);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
}