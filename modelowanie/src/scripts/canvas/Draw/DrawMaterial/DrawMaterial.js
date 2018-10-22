import { getMaterial } from '../../Mill/Material/Material';
import Translate, { setTranslationPoints, getLastTranslation }  from '../../Translation/TranslationCenter/TranslationCenter';
import { getCanvas, getGLCtx } from '../Draw';
import { getShaderProgram, getModelMx, getProjectionMx } from '../../OpenGL/Init/InitOpenGL';
import getProjectionMatrix from '../../Translation/Projection/Projection';
import { clearGL } from '../OpenGL/DrawOpengl';

export function DrawMaterial(gl, vb, ib, nb) {
    const { materialPoints, indices, normals} = getMaterial();
    if(materialPoints.length === 0) {
        return;
    }
    const partsM = [];
    const partsI = [];
    const partsN = [];
    let iIndices = 0;
    for(let i = 0; i < materialPoints.length; i += (60000 * 3)) {
        partsM.push(materialPoints.slice(i, i + (60000 * 3)));
        partsI.push(indices.slice(iIndices, iIndices + 60000));
        partsN.push(normals.slice(i, i + (60000 * 3)));
        iIndices += 60000;
    }
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

    DrawLnesOpenGL(partsM[0], partsI[0], partsM[0], gl, vb, ib, nb, true);
     for(let i = 1; i < partsI.length; i ++) {
         DrawLnesOpenGL(partsM[i], partsI[i], partsM[i], gl, vb, ib, nb, false);
     }
    //DrawLinesOnTranslatedPoints(points, {r: 229, g: 114, b: 84});
}
function DrawLnesOpenGL(points, indices, normals, gl, vb, ib, nb, clear) {


    if(clear) {
       clearGL(gl);
    }

    // Create an empty buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
   // gl.bufferSubData(gl.ARRAY_BUFFER, 0, points);
    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

   // gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, indices);

    gl.bindBuffer(gl.ARRAY_BUFFER, nb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

   // gl.bufferSubData(gl.ARRAY_BUFFER, 0, normals);
    /*=================== Shaders ====================*/
    // Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}