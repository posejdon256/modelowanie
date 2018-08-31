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
                <label>Ustaw krok znajdowania przecięcia:</label>
                <input className="input-ab" type="text" onChange={this.setIntersectionStep} defaultValue="3"/>
            </div>
            <div className="ab-grid">
                <label>Ustaw epsilon znajdowania przecięcia:</label>
                <input className="input-ab" type="text" onChange={this.setIntersectionEpsilon} defaultValue="0.001"/>
            </div>
            <div className="ab-grid">
                <label>Ustaw krok Newtona:</label>
                <input className="input-ab" type="text" onChange={this.setNewton} defaultValue="0.002"/>
            </div>
            <div className="ab-grid">
                <label>Ustaw Epsilon warunku końcowego:</label>
                <input className="input-ab" type="text" onChange={this.setFinalEpsilon} defaultValue="0.001"/>
            </div>
            <div className="ab-grid">
                <label>Włącz/wyłącz podgląd ze znajdowaniem punktu przecięcia:</label>
                <input type="checkbox" onChange={this.setOneProjectionPointState}/>
            </div>
            <div className="ab-grid">
                <label>Włącz/wyłącz widok pierwszych 20 iteracji Newtona:</label>
                <input type="checkbox" onChange={this.showNewtonIt} defaultChecked={false}/>
            </div>
            <div className="ab-grid">
                <label>Ustaw liczbę pokazywanych kroków Newtona:</label>
                <input className="input-ab" type="text" onChange={this.setNewtonStep} defaultValue="20"/>
            </div>
            <div className="ab-grid">
                <button className="btn" onClick={this.convertToInterpolation}>Konvertuj do interpolacyjnej</button>
            </div>
            <div className="ab-grid">
                <label>Trimowanie</label>
                <select ref="trimSelect1">
                    <option value="all">Calość obiektu 1</option>
                    <option value="left">Pierwsza część obiektu 1</option>
                    <option value="right">Druga część obiektu 1</option>
                </select>
                <select ref="trimSelect2">
                    <option value="all">Calość obiektu 2</option>
                    <option value="left">Pierwsza część obiektu 2</option>
                    <option value="right">Druga część obiektu 2</option>
                </select>
                <button onClick={this.trim} className="btn">Trimuj</button>
            </div>
        </div>);
    }
}