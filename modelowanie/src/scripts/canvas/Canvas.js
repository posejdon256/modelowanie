import React, { Component } from 'react';
import '../../css/canvas/Canvas.css';
import { DrawTorus, setPixelColor, setCanvas, clearCanvas, DrawElipsoid } from './Draw/Draw';
import KeyboardCenter from './Keyboard/KeyboardCenter';
import { setTranslationPoints } from './Translation/TranslationCenter/TranslationCenter';
import MouseCenter from './Mouse/MouseCenter';
import generateTorus, { getTorusVertices, TranslateTorus } from './Torus/Torus';
import { generateElipsoid, TranslateElipsoid } from './Elipsoid/Elipsoid';

export default class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.keyFunction = this.keyFunction.bind(this);
        this.mouseFunction = this.mouseFunction.bind(this);
    }
    componentDidMount(){

        //variables
        const canvas = this.refs.abCanvas;
        generateTorus(50.0, 200.0, this.props.gridX, this.props.gridY);

        // settings
        setPixelColor(255, 255, 0, 254);
        setCanvas(canvas);
        clearCanvas();
        generateElipsoid(1000,16000,10000);
        DrawElipsoid(TranslateElipsoid({}));
    }
    componentWillReceiveProps(props) {
        
        //DrawTorus
        if(props.visibleTorus) { 
            generateTorus(50.0, 200.0, props.gridX, props.gridY);

            //DrawTorus
          //  clearCanvas();     
          //  DrawTorus(TranslateTorus({}));
        } else {
            clearCanvas();
        }
    }
    keyFunction(event) {
        KeyboardCenter(event);
    }
    mouseFunction(event) {
        MouseCenter(event);
    }
    render(){
        return(
        <div className="ab-canvas-div">
            <canvas tabIndex="1" ref="abCanvas" className="ab-canvas" width="1000px" height="700px" 
            onKeyDown={this.keyFunction} 
            onKeyUp={this.keyFunction}
            onMouseDown={this.mouseFunction}
            onMouseUp={this.mouseFunction}
            onMouseMove={this.mouseFunction}/>
        </div>);
    }
}