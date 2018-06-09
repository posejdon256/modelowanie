import React, { Component } from 'react';
import '../../css/header/Header.css';
import torus from '../../pictures/torus.png';
import point from '../../pictures/point.png';
import bezierc1 from '../../pictures/bezierc1.png';
import bezierc2 from '../../pictures/bezierc2.png';
import bezierc2I from '../../pictures/bezierc2i.png';
import platekC0 from '../../pictures/platek.png';
import platekC2 from '../../pictures/platekc2.png';
import platekG from '../../pictures/platekG.png';
import scissors from '../../pictures/scissors.png';
import load from '../../pictures/helicopter.png';
import save from '../../pictures/safebox.png';
import { getAddBezierState, setAddBezierState } from '../canvas/Bezier/Bezier';
import { getAddingC2State, setAddingC2State } from '../canvas/Bezier/BSpline';
import { getInterpolationState, setInterpolationState } from '../canvas/Bezier/Interpolation';
import { createSurface } from '../canvas/Surface/Surface';
import { Save } from '../Save/Save';
import { Load } from '../Load/Load';
import { MakeGregory } from '../canvas/Gregory/Gregory';
import { addTorus } from '../canvas/Torus/Torus';
import { findObjectToIntersectionAndIntersection } from '../canvas/CuttingCurve/FindIntersection';

export default class Header extends Component {
    constructor(props) {
        super(props);
        
        this.addTorus = this.addTorus.bind(this);
        this.addPoint = this.addPoint.bind(this);
        this.addCurve = this.addCurve.bind(this);
        this.addBesplineCurve = this.addBesplineCurve.bind(this);
        this.addInterpolationCurve = this.addInterpolationCurve.bind(this);
        this.addSurfaceC0 = this.addSurfaceC0.bind(this);
        this.addSurfaceC2 = this.addSurfaceC2.bind(this);
        this.loadFile = this.loadFile.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.addGregory = this.addGregory.bind(this);
        this.addIntersection = this.addIntersection.bind(this);
    }
    addTorus() {
        addTorus();
    }
    loadFile() {
        Load();
    }
    saveFile(){
        Save();
    }
    addPoint(){
        this.props.addPoint();
    }
    addGregory() {
        MakeGregory();
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
    addIntersection(){
        if(findObjectToIntersectionAndIntersection()){
            this.props.ShowVisualization();
        }
    }
    addInterpolationCurve() {
        if(getInterpolationState()) {
            setInterpolationState(false);
            return;
        }
        this.props.addCurve("C2I");
    }
    addSurfaceC0(){
        createSurface("C0");
    }
    addSurfaceC2(){
        createSurface("C2");
    }
    render(){
        return(
        <div className="ab-header">
            <button className="ab-torus-button" onClick={this.addTorus}>
                <img className="ab-torus-image" src={torus} alt="torus" />
            </button>
            <button className="ab-torus-button" onClick={this.addPoint}>
                <img className="ab-point-image" src={point} alt="point" />
            </button>
            <button className="ab-torus-button" onClick={this.addCurve}>
                <img className="ab-point-image" src={bezierc1} alt="bezier" />
            </button>
            <button className="ab-torus-button" onClick={this.addBesplineCurve}>
                <img className="ab-point-image" src={bezierc2} alt="bezier" />
            </button>
            <button className="ab-torus-button" onClick={this.addInterpolationCurve}>
                <img className="ab-point-image" src={bezierc2I} alt="bezier" />
            </button>
            <button className="ab-torus-button" onClick={this.addSurfaceC0}>
                <img className="ab-point-image" src={platekC0} alt="surface c0" />
            </button>
            <button className="ab-torus-button" onClick={this.addSurfaceC2}>
                <img className="ab-point-image" src={platekC2} alt="surface c2" />
            </button>   
            <button className="ab-torus-button" onClick={this.addGregory}>
                <img className="ab-point-image" src={platekG} alt="surface c2" />
            </button>   
            <button className="ab-torus-button" onClick={this.saveFile}>
                <img className="ab-point-image" src={save} alt="surface c0" />
            </button>
            <button className="ab-torus-button" onClick={this.loadFile}>
                <img className="ab-point-image" src={load} alt="surface c2" />
            </button>  
            <button className="ab-torus-button" onClick={this.addIntersection}>
                <img className="ab-point-image" src={scissors} alt="intersection curve" />
            </button>  
        </div>);
    }
}