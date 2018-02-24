import React, { Component } from 'react';
import '../../css/canvas/Canvas.css';
import Draw, { setPixelColor, setCanvas, clearCanvas } from './Draw/Draw';
import KeyboardCenter from './Keyboard/KeyboardCenter';
import TranslationCenter, { setTranslationPoints } from './Translation/TranslationCenter/TranslationCenter';
import MouseCenter from './Mouse/MouseCenter';
import generateTorus, { getTorusVertices } from './Torus/Torus';

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
        const torus = getTorusVertices();

        // settings
        setPixelColor(254, 254, 254, 254);
        setCanvas(canvas);
        setTranslationPoints(torus);

        //move torus
        const translatedObject = {
            left: 400,
            top: -700,
            axisY: true,
            alphaY: 2
        };
        const translated = TranslationCenter(translatedObject);

        // set state
        this.setState({
            points: translated
        });
    }
    componentWillReceiveProps(props) {

         generateTorus(50.0, 200.0, props.gridX, props.gridY);
         const torus = getTorusVertices();
         setTranslationPoints(torus);
        //DrawTorus
        if(props.visibleTorus) { 
            clearCanvas();     
            Draw(TranslationCenter({}));
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