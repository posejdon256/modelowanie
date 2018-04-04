import React, { Component } from 'react';
import '../../css/header/Header.css';
import torus from '../../pictures/torus.png';
import point from '../../pictures/point.png';
import bezierc1 from '../../pictures/bezierc1.png';
import bezierc2 from '../../pictures/bezierc2.png';
import { getAddBezierState, setAddBezierState } from '../canvas/Bezier/Bezier';
import { getAddingC2State, setAddingC2State } from '../canvas/Bezier/BSpline';

export default class Header extends Component {
    constructor(props) {
        super(props);
        
        this.toggleTorus = this.toggleTorus.bind(this);
        this.addPoint = this.addPoint.bind(this);
        this.addCurve = this.addCurve.bind(this);
        this.addBesplineCurve = this.addBesplineCurve.bind(this);
    }
    toggleTorus(){
        this.props.toggleTorus();
    }
    addPoint(){
        this.props.addPoint();
    }
    addBesplineCurve() {
        if(getAddingC2State()) {
            setAddingC2State(false);
            return;
        }
        this.props.addCurve("Bspline");
    }
    addCurve(){
        if(getAddBezierState()) {
            setAddBezierState(false);
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
            <button className="ab-torus-button" onClick={this.addBesplineCurve}>
                <img className="ab-point-image" src={bezierc2} alt="point" />
            </button>
        </div>);
    }
}