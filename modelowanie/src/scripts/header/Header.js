import React, { Component } from 'react';
import '../../css/header/Header.css';
import torus from '../../pictures/torus.png';

export default class Header extends Component {
    constructor(props) {
        super(props);
        
        this.toggleTorus = this.toggleTorus.bind(this);
    }
    toggleTorus(){
        this.props.toggleTorus();
    }
    render(){
        return(
        <div className="ab-header">
            <button className="ab-torus-button" onClick={this.toggleTorus}>
                <img className="ab-torus-image" src={torus} alt="torus" />
            </button>
        </div>);
    }
}