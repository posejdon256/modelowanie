import Translate, { setTranslationPoints } from "../../Translation/TranslationCenter/TranslationCenter";
import { drawLine, getContexts, stereoscopyDraw, getCanvas, getGLCtx } from "../Draw";
import { getStereoscopy } from "../../Stereoscopy/Stereoscopy";
import { trimIsMet } from "../../CuttingCurve/Trimming";

/**
 * 
 * @param {Point} p1 {x: 1, y: 1, z: 1}
 * @param {Point} p2 {x: 1, y: 1, z: 1}
 * @param {rgb} color {r: 255, g: 0, b: 0} 
 */
export function DrawLines(points, color) {

    const { ctx, ctxS1, ctxS2 } = getContexts();
    const _color = color ? color : { r: 255, g: 255, b: 255 };
    points.forEach(_points => {
        const ops = {};
        if(_points.trim) {
            const ctx = _points.trimOptions.canvas.getContext('2d');
            const img = ctx.getImageData(0, 0, _points.trimOptions.canvas.width, _points.trimOptions.canvas.height);
            ops.img = img;
            ops.op = _points.trimOptions.op;
            ops.canvas = _points.trimOptions.canvas;
        }
        setTranslationPoints(_points.points);
        const stereoscopy = getStereoscopy();
        let x1, x2, y1, y2, z1, z2;
        if(stereoscopy) {
            const { left, right } = Translate({});
            ctxS1.strokeStyle = "rgba(236, 4, 0, 1)";
            ctxS2.strokeStyle = "rgba(0, 249, 247, 1)";
            ctxS1.beginPath();
            for(let i = 1; i < left.length; i ++) {
                if(_points.points[i].break) {
                    ctxS1.closePath();
                    ctxS1.beginPath();
                    ctxS2.closePath();
                    ctxS2.beginPath();
                    continue;
                }
                x1 = (left[0].x + 1) * 500;
                y1 = (left[0].y + 0.8) * 450;
                z1 = left[0].z;
            
                x2 = (left[i].x + 1) * 500;
                y2 = (left[i].y + 0.8) * 450;
                z2 = left[i].z;
                if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -5 || z1 > 5
                    || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -5 || z2 > 5)
                    continue;
                    drawLine(parseInt(x1, 10), parseInt(y1, 10), parseInt(x2, 10), parseInt(y2, 10), ctxS1);
    
                x1 = (right[0].x + 1) * 500;
                y1 = (right[0].y + 0.8) * 450;
                z1 = right[0].z;
            
                x2 = (right[i].x + 1) * 500;
                y2 = (right[i].y + 0.8) * 450;
                z2 = right[i].z;
                if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -5 || z1 > 5
                    || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -5 || z2 > 5)
                    continue;
                    drawLine(parseInt(x1, 10), parseInt(y1, 10), parseInt(x2, 10), parseInt(y2, 10), ctxS2);
            }
            ctxS1.stroke();
            ctxS2.stroke();
            stereoscopyDraw();
            return;
        }
        const translated = Translate({});
        ctx.strokeStyle = "rgba("+_color.r+","+_color.g+","+_color.b+","+(!_color.a ? 1.0 : _color.a)+")";
        ctx.beginPath();
        for(let i = 1; i < translated.length; i ++) {
            if(_points.points[i].break || (_points.trim 
                && (!trimIsMet(_points.points[i].u, _points.points[i].v, ops) || !trimIsMet(_points.points[i - 1].u, _points.points[i - 1].v, ops)))) {
                ctx.stroke();
                ctx.beginPath();
                continue;
            }
            x1 = (translated[i - 1].x + 1) * 500;
            y1 = (translated[i - 1].y + 0.8) * 450;
            z1 = translated[i - 1].z;
    
            x2 = (translated[i].x + 1) * 500;
            y2 = (translated[i].y + 0.8) * 450;
            z2 = translated[i].z;
            if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -5 || z1 > 5
                || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -5 || z2 > 5)
                continue;
            
                drawLine(parseInt(x1, 10), parseInt(y1, 10), parseInt(x2, 10), parseInt(y2, 10), ctx);
        }
        ctx.stroke();
    });
}
export function DrawLinesOnTranslatedPoints(points, color) {
    const { ctx } = getContexts();
    ctx.strokeStyle = "rgba("+color.r+","+color.g+","+color.b+","+(!color.a ? 1.0 : color.a)+")";
    for(let i = 1; i < points.length; i ++) {
        if(points[i].break) {
            ctx.stroke();
            ctx.beginPath();
            continue;
        }
        let x1, y1, z1, x2, y2, z2;
        x1 = (points[i - 1].x + 1) * 500;
        y1 = (points[i - 1].y + 0.8) * 450;
        z1 = points[i - 1].z;

        x2 = (points[i].x + 1) * 500;
        y2 = (points[i].y + 0.8) * 450;
        z2 = points[i].z;
        if(x1 < 0 || y1 < 0 || x1 > 1000 || y1 > 700 || z1 < -5 || z1 > 5
            || x2 < 0 || y2 < 0 || x2 > 1000 || y2 > 700 || z2 < -5 || z2 > 5) {
            continue;
        }   
        drawLine(parseInt(x1, 10), parseInt(y1, 10), parseInt(x2, 10), parseInt(y2, 10), ctx);
    }
    ctx.stroke();
}
export function DrawLnesOpenGL(points, indices) {
    const canvas = getCanvas();
    let gl = getGLCtx();
    // Create an empty buffer object
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // Bind appropriate array buffer to it
    var Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    /*=================== Shaders ====================*/

    // Vertex shader source code
    var vertCode =
       'attribute vec3 coordinates;' +
       'void main(void) {' +
          ' gl_Position = vec4(coordinates, 1.0);' +
       '}';

    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);

    // Compile the vertex shader
    gl.compileShader(vertShader);

    // Fragment shader source code
    var fragCode =
       'void main(void) {' +
          'gl_FragColor = vec4(255.0, 255.0, 255.0, 1.0);' +
       '}';

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);

    // Compile the fragmentt shader
    gl.compileShader(fragShader);

    // Create a shader program object to store
    // the combined shader program
    var shaderProgram = gl.createProgram();

    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);

    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);

    // Link both the programs
    gl.linkProgram(shaderProgram);

    // Use the combined shader program object
    gl.useProgram(shaderProgram);

    /*======= Associating shaders to buffer objects ======*/

    // Bind vertex and index buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    /*============ Drawing the triangle =============*/

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    // Draw the triangle
    gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
}