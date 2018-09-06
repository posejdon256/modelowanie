import React, { Component } from 'react';
import '../../css/navbar/Navbar.css';
import'../../css/formbase.min.css';

import { setIntersectionStep, setEpsilonOfFindingIntersection } from '../canvas/CuttingCurve/FindIntersection';
import { setNewtonAlpa, setFinalEpsilon } from '../canvas/CuttingCurve/NewtonMethod';
import { setOneProjectionPointState, setFirstNewtonIt, setNewtonStep } from '../canvas/CuttingCurve/Projection';
import { trim } from '../canvas/CuttingCurve/Trimming';

export default class NavbarIntersection extends Component {
    constructor(props) {
        super(props);

        this.setIntersectionStep = this.setIntersectionStep.bind(this);
        this.setNewton = this.setNewton.bind(this);
        this.setFinalEpsilon = this.setFinalEpsilon.bind(this);
        this.showNewtonIt = this.showNewtonIt.bind(this);
        this.setNewtonStep = this.setNewtonStep.bind(this);
        this.setIntersectionEpsilon = this.setIntersectionEpsilon.bind(this);
        this.trim = this.trim.bind(this);
    }
    setOneProjectionPointState(event) {
        setOneProjectionPointState(event.target.checked);
    }
    setIntersectionStep(event) {
        setIntersectionStep(event.target.value);
    }
    setNewton(event) {
        setNewtonAlpa(event.target.value);
    }
    setFinalEpsilon(event) {
        setFinalEpsilon(event.target.value);
    }
    showNewtonIt(event) {
        setFirstNewtonIt(event.target.checked);
    }
    setNewtonStep(event) {
        setNewtonStep(event.target.value);
    }
    setIntersectionEpsilon(event) {
        setEpsilonOfFindingIntersection(event.target.value);
    }
    trim() {
        trim(this.refs.trimSelect1.value, this.refs.trimSelect2.value);
    }
    render(){
        return(
        <div className="ab-bicubic">
            <div className="ab-grid">
                <label>Set step of finding intersection:</label>
                <input className="input-ab" type="text" onChange={this.setIntersectionStep} defaultValue="3"/>
            </div>
            <div className="ab-grid">
                <label>Set epsilon of finding intersection:</label>
                <input className="input-ab" type="text" onChange={this.setIntersectionEpsilon} defaultValue="0.001"/>
            </div>
            <div className="ab-grid">
                <label>Set Newton Algorithm step:</label>
                <input className="input-ab" type="text" onChange={this.setNewton} defaultValue="0.002"/>
            </div>
            <div className="ab-grid">
                <label>Set epsilon of final condition:</label>
                <input className="input-ab" type="text" onChange={this.setFinalEpsilon} defaultValue="0.001"/>
            </div>
            <div className="ab-grid">
                <label>Show preview of finding intersection:</label>
                <input type="checkbox" onChange={this.setOneProjectionPointState}/>
            </div>
            <div className="ab-grid">
                <label>Show first steps of Newton Algorithm iterations:</label>
                <input type="checkbox" onChange={this.showNewtonIt} defaultChecked={false}/>
            </div>
            <div className="ab-grid">
                <label>Set number of Newton Algorithm steps in preview:</label>
                <input className="input-ab" type="text" onChange={this.setNewtonStep} defaultValue="20"/>
            </div>
            <div className="ab-grid">
                <button className="btn" onClick={this.convertToInterpolation}>Convert to interpolation curve</button>
            </div>
            <div className="ab-grid">
                <label>Trimming</label>
                <select ref="trimSelect1">
                    <option value="all">Whole first object</option>
                    <option value="left">First part of first object</option>
                    <option value="right">Second part of first object</option>
                </select>
                <select ref="trimSelect2">
                    <option value="all">Whole second object</option>
                    <option value="left">First part of second object</option>
                    <option value="right">Second part of second object</option>
                </select>
                <button onClick={this.trim} className="btn">Trim</button>
            </div>
        </div>);
    }
}