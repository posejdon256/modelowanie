import React, { Component } from 'react';
import '../../css/header/Header.css';
import '../../css/tooltip/Tooltip.css';
import torus from '../../pictures/torus.png';
import clean from '../../pictures/clean.png';
import point from '../../pictures/point.png';
import bezierc1 from '../../pictures/bezierc1.png';
import bezierc2 from '../../pictures/bezierc2.png';
import bezierc2I from '../../pictures/bezierc2i.png';
import platekC0 from '../../pictures/platek.png';
import platekC2 from '../../pictures/platekc2.png';
import platekG from '../../pictures/platekG.png';
import scissors from '../../pictures/scissors.png';
import save from '../../pictures/safebox.png';
import select from '../../pictures/square-select.png';
import projektor from '../../pictures/projektor.png';
import path from '../../pictures/path.png';
import { getAddBezierState, setAddBezierState } from '../canvas/Bezier/Bezier';
import { getAddingC2State, setAddingC2State } from '../canvas/Bezier/BSpline';
import { getInterpolationState, setInterpolationState } from '../canvas/Bezier/Interpolation';
import { createSurface } from '../canvas/Surface/Surface';
import { Save } from '../Save/Save';
import { Load } from '../Load/Load';
import { MakeGregory } from '../canvas/Gregory/Gregory';
import { addTorus } from '../canvas/Torus/Torus';
import { findObjectToIntersectionAndIntersection } from '../canvas/CuttingCurve/FindIntersection';
import { setProjectionState, getProjectionState } from '../canvas/CuttingCurve/Projection';
import { cleanScene } from '../canvas/Clean/Clean';
import { setRectangleSelectionState, getRectangleSelectionRectangle } from '../canvas/Mouse/RectangleSelect';
import { generatePaths } from '../Save/GeneratePaths/GeneratePaths';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projection: false,
            interpolation: false,
            C0: false,
            C2: false
        };
        
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
        this.projectIntersection = this.projectIntersection.bind(this);
        this.cleanScene = this.cleanScene.bind(this);
        this.selectByRectange = this.selectByRectange.bind(this);
        this._generatePaths = this._generatePaths.bind(this);
    }
    _generatePaths() {
        generatePaths();
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
            this.setState({C2: false});
            return;
        }
        this.props.addCurve("Bspline");
        this.setState({C2: true});
    }
    addCurve(){
        if(getAddBezierState()) {
            setAddBezierState(false);
            this.setState({C0: false});
            return;
        }
        this.props.addCurve();
        this.setState({C0: true});
    }
    addIntersection(){
        if(findObjectToIntersectionAndIntersection()){
            this.props.ShowVisualization();
        }
    }
    cleanScene(){
        cleanScene();
        this.setState({
            projection: false,
            interpolation: false,
            C0: false,
            C2: false
        });
    }
     projectIntersection() {
         if(getProjectionState()) {
            this.setState({projection: false});
         } else {
            this.setState({projection: true});
         }
        setProjectionState(!getProjectionState());
    }
    addInterpolationCurve() {
        if(getInterpolationState()) {
            setInterpolationState(false);
            this.setState({interpolation: false});
            return;
        }
        this.setState({interpolation: true});
        this.props.addCurve("C2I");
    }
    addSurfaceC0(){
        createSurface("C0");
    }
    addSurfaceC2(){
        createSurface("C2");
    }
    selectByRectange() {
        setRectangleSelectionState(!getRectangleSelectionRectangle());
    }
    render(){
        return(
        <div className="ab-header">
            <button className="ab-torus-button tooltip" onClick={this.cleanScene}>
                <img className="ab-torus-image" src={clean} alt="clean" />
                <span class="tooltiptext">Clean all elements from the scene</span>
            </button>
            <button className="ab-torus-button tooltip" onClick={this.selectByRectange}>
                <img className="ab-torus-image" src={select} alt="select" />
                <span class="tooltiptext">If you have any points on the scene, you can select this mode. Then you can select/deselect points on the scene in rectangle.</span>
            </button>
            <button className="ab-torus-button tooltip" onClick={this.addTorus}>
                <img className="ab-torus-image" src={torus} alt="torus" />
                <span class="tooltiptext">Add torus to the scene. You can change some torus parameters in basic navbar.</span>
            </button>
            <button className="ab-torus-button tooltip" onClick={this.addPoint}>
                <img className="ab-point-image" src={point} alt="point" />
                <span class="tooltiptext">Add single point to the scene. Point can be selected or removed from the scene. All curves and patches are based on points.</span>
            </button>
            <button className={"ab-torus-button tooltip" + (this.state.C0 ? " ab-selected-state" : "")} onClick={this.addCurve}>
                <img className="ab-point-image" src={bezierc1} alt="bezier" />
                <span class="tooltiptext">Turn on Bezier Curve C0 mode. Now when you are adding a point it is a part of curve. Turn off this mode by click on it second time.</span>
            </button>
            <button className={"ab-torus-button tooltip" + (this.state.C2 ? " ab-selected-state" : "")} onClick={this.addBesplineCurve}>
                <img className="ab-point-image" src={bezierc2} alt="bezier" />
                <span class="tooltiptext">Turn on Bspline mode. No when you are adding a point it is a part of curve. <br/>Hint: you can add points with space button.</span>
            </button>
            <button className={"ab-torus-button tooltip" + (this.state.interpolation ? " ab-selected-state" : "")} onClick={this.addInterpolationCurve}>
                <img className="ab-point-image" src={bezierc2I} alt="bezier" />
                <span class="tooltiptext">Turn on Interpolation Curve mode. No when you are adding a point it is a part of curve.</span>
            </button>
            <button className="ab-torus-button tooltip" onClick={this.addSurfaceC0}>
                <img className="ab-point-image" src={platekC0} alt="surface c0" />
                <span class="tooltiptext">Add C0 Patch to scene. <br/>Hint: You can change C0 patch paramenters in bicubic navbar.</span>
            </button>
            <button className="ab-torus-button tooltip" onClick={this.addSurfaceC2}>
                <img className="ab-point-image" src={platekC2} alt="surface c2" />
                <span class="tooltiptext">Add C2 Patch to scene. <br/>Hint: You can change C0 patch paramenters in bicubic navbar.</span>
            </button>   
            <button className="ab-torus-button tooltip" onClick={this.addGregory}>
                <img className="ab-point-image" src={platekG} alt="surface c2" />
                <span class="tooltiptext">Add Gregory patch. Gregory patch can be add to three connected single patches. For more information go to Help(not ready)</span>
            </button>   
            <button className="ab-torus-button tooltip" onClick={this.saveFile}>
                <img className="ab-point-image" src={save} alt="surface c0" />
                <span class="tooltiptext">Save your work</span>
            </button>
            <button className={"ab-torus-button tooltip" + (this.state.projection ? " ab-selected-state" : "")} onClick={this.projectIntersection}>
                <img className="ab-point-image" src={projektor} alt="intersection curve projection" />
                <span class="tooltiptext">Project intersection. If you selected two objects you can try to find intersection between them. Important is that cursor has to be near to intersection and "Finding intersection step" should be 3 or 0.2</span>
            </button>  
            <button className={"ab-torus-button tooltip"} onClick={this.addIntersection}>
                <img className="ab-point-image" src={scissors} alt="intersection curve" />
                <span class="tooltiptext">Project intersection. If you selected two objects you can try to find intersection between them. Important is that cursor has to be near to intersection and "Finding intersection step" should be 3 or 0.2</span>
            </button>  
            <button className={"ab-torus-button tooltip"} onClick={this._generatePaths}>
                <img className="ab-point-image" src={path} alt="path" />
                <span class="tooltiptext">Generates paths for helicopter</span>
            </button>  
        </div>);
    }
}