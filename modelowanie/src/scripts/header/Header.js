import React, { Component } from 'react';
import '../../css/header/Header.css';
import torus from '../../pictures/torus.png';
import point from '../../pictures/point.png';

export default class Header extends Component {
    constructor(props) {
        super(props);
        
        this.toggleTorus = this.toggleTorus.bind(this);
        this.addPoint = this.addPoint.bind(this);
    }
    toggleTorus(){
        this.props.toggleTorus();
    }
    addPoint(){
        this.props.addPoint();
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
        </div>);
    }
}