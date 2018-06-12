import React, { Component } from 'react';
import '../../css/canvas/Canvas.css';
import { setPixelColor, setCanvas, setStereoscopyCanvases } from './Draw/Draw';
import KeyboardCenter from './Keyboard/KeyboardCenter';
import MouseCenter from './Mouse/MouseCenter';
import { setTorusMesh } from './Torus/Torus';
import { setStereoscopy } from './Stereoscopy/Stereoscopy';
import Redraw from './Draw/Redraw';
import { setVisualisationCanvases } from './Draw/RedrawVisualisation/RedrawVisualization';

export default class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visualisate: false
        }
        this.keyFunction = this.keyFunction.bind(this);
        this.mouseFunction = this.mouseFunction.bind(this);
    }
    componentDidMount(){

        //variables
        const canvas = this.refs.abCanvas;
        const canvasStereo = this.refs.stereoscopyHelpCanvas;
        const canvasStereo2 = this.refs.stereoscopyHelpCanvas2;
        const small1 = this.refs.visualization1;
        const small2 = this.refs.visualization2;
        setTorusMesh(this.props.gridX, this.props.gridY);
        // settings
        setPixelColor(254, 254, 254, 254);
        setCanvas(canvas);
        setStereoscopyCanvases(canvasStereo, canvasStereo2);
        setVisualisationCanvases(small1, small2);

        Redraw();
    }
    componentWillReceiveProps(props) {
        if(props.stereoscopy !== this.props.stereoscopy) {
            setStereoscopy(props.stereoscopy);
            Redraw();
        }
        if(props.visualisate !== this.state.visualisate && props.visualisate !== undefined) {
            this.setState({
                visualisate: props.visualisate
            });
        }
    }
    keyFunction(event) {
        KeyboardCenter(event, this.props.refreshNavbar);
    }
    mouseFunction(event) {
        MouseCenter(event, this.props.refreshNavbar);
    }
    render(){
        const visualisate = this.state.visualisate;
        return(
        <div className="ab-canvas-div">
            <canvas tabIndex="1" ref="abCanvas" className="ab-canvas" width="1000px" height="700px" 
            onKeyDown={this.keyFunction} 
            onKeyUp={this.keyFunction}
            onMouseDown={this.mouseFunction}
            onMouseUp={this.mouseFunction}
            onMouseMove={this.mouseFunction}/>
            <canvas ref="stereoscopyHelpCanvas" className="abcanvas ab-canvas-stereopscopy" width="1000px" height="700px" />
            <canvas ref="stereoscopyHelpCanvas2" className="abcanvas ab-canvas-stereopscopy" width="1000px" height="700px" />
            <canvas ref="visualization1" className={(!visualisate ? "" : "ab-canvas-visualization1")} width="250px" height="250px" />
            <canvas ref="visualization2" className={(!visualisate ? "" : "ab-canvas-visualization2")} width="250px" height="250px" />
        </div>);
    }
}