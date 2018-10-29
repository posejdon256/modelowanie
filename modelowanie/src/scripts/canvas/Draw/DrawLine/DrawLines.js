import { getPointsToDrill } from "../../../Load/ReadMill/ReadMill";
import { getVertexBufferLine, getIndexBufferLine, getShaderLine, getProjectionMxLine, getModelMxLine } from "../../OpenGL/Init/InitOpenGL";
import { getGLCtx } from "../Draw";
import { TranslateMatrix } from "../OpenGL/DrawOpengl";
import Redraw from "../Redraw";

let indices;
let show = false;
export function ShowPaths() {
    show = !show;
    Redraw();
}
export function DrawLines(update) {
    if(getPointsToDrill().length === 0 || !show) {
        return;
    }
    if(update || indices.length === 0) {
        updateBuffers();
    }
    const gl = getGLCtx();
    const vb = getVertexBufferLine();

    const shaderProgram = getShaderLine();

    gl.useProgram(shaderProgram);
    let coord = gl.getAttribLocation(shaderProgram, "position");

    // Point an attribute to the currently bound VBO
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    TranslateMatrix(getProjectionMxLine(), getModelMxLine());

    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.drawArrays(gl.LINE_LOOP, 0, indices.length);
}
function updateBuffers() {
    const _points = getPointsToDrill();
    const points = [];
    indices = [];
    let i = 0;
    _points.forEach(p => {
        points.push(p.x, p.y, p.z);
        indices.push(i);
        i ++;
    });
    const gl = getGLCtx();
    const vb = getVertexBufferLine();
    const ib = getIndexBufferLine();

    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}