import { getMaterial } from '../../Mill/Material/Material';
import Translate, { setTranslationPoints, getLastTranslation }  from '../../Translation/TranslationCenter/TranslationCenter';
import { getCanvas, getGLCtx } from '../Draw';
import { getShaderProgram, getModelMx, getProjectionMx } from '../../OpenGL/Init/InitOpenGL';
import getProjectionMatrix from '../../Translation/Projection/Projection';

export function DrawMaterial(gl, vb, ib, nb) {
    const { materialPoints, indices, normals} = getMaterial();
    if(materialPoints.length === 0) {
        return;
    }
    DrawLnesOpenGL(materialPoints, indices, normals, gl, vb, ib, nb);
    //DrawLinesOnTranslatedPoints(points, {r: 229, g: 114, b: 84});
}
function DrawLnesOpenGL(points, indices, normals, gl, vb, ib, nb) {

    
    const canvas = getCanvas();
    const shaderProgram = getShaderProgram();
    gl.useProgram(shaderProgram);

    var coord = gl.getAttribLocation(shaderProgram, "position");
    var normal = gl.getAttribLocation(shaderProgram, "normal");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    gl.enableVertexAttribArray(normal);

    let modelMx = getModelMx();
    let projMx = getProjectionMx();
    let mx = getLastTranslation();
    gl.uniformMatrix4fv(modelMx, false, mx);
    mx = getProjectionMatrix(1);
    gl.uniformMatrix4fv(projMx, false, mx);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);


    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    // Create an empty buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    // Bind appropriate array buffer to it
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, nb);
    /*=================== Shaders ====================*/
    // Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}