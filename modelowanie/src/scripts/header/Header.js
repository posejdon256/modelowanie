import React, { Component } from 'react';
import '../../css/header/Header.css';
import torus from '../../pictures/torus.png';
import point from '../../pictures/point.png';
import bezierc1 from '../../pictures/bezierc1.png';
import bezierc2 from '../../pictures/bezierc2.png';
import { getAddCurveState, setAddCurveState } from '../canvas/Bezier/Bezier';

export default class Header extends Component {
    constructor(props) {
        super(props);
        
        this.toggleTorus = this.toggleTorus.bind(this);
        this.addPoint = this.addPoint.bind(this);
        this.addCurve = this.addCurve.bind(this);
    }
    toggleTorus(){
        this.props.toggleTorus();
    }
    addPoint(){
        this.props.addPoint();
    }
    addCurve(){
        if(getAddCurveState()) {
            setAddCurveState(false);
            return;
        }
        this.props.addCurve();
    }
    render(){
        return(
        <div className="ab-header">
            <button className="ab-torus-button" onClick={this.toggleTorus}>
                <img className="ab-torus-image" src={torus} alt="torus" />
            </button>
            <button className="ab-torus-button" onClick={this.addPoint}>
                <img className="ab-point-image" src={point} alt="point" />
            </button>
            <button className="ab-torus-button" onClick={this.addCurve}>
                <img className="ab-point-image" src={bezierc1} alt="point" />
            </button>
            <button className="ab-torus-button" onClick={this.addCurve}>
                <img className="ab-point-image" src={bezierc2} alt="point" />
            </button>
        </div>);
    }
}