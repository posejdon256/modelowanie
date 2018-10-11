import React, { Component } from 'react';
import '../../css/navbar/Navbar.css';
import'../../css/formbase.min.css';
import List from './NavbarPoints/List';
import ListPointsInCurve from './NavbarPoints/ListPointsInCurve';
import BiCubicNavbar from './BiCubicNavbar/BiCubicNavbar';
import NavbarIntersetion from './NavbutIntersection';

import { getCursor, setCursor } from '../canvas/Cursor/Cursor';
import { setAddingC2Type } from '../canvas/Bezier/BSpline';
import { getCurvesControlPoints, addCurveBySelectedPoints } from '../canvas/Bezier/Curve';
import { updateSelectedPoints, deselectPoints } from '../canvas/Points/Points';
import { uniteTwoPoints } from '../canvas/Gregory/Claps';
import { setOneProjectionPointState } from '../canvas/CuttingCurve/Projection';
import { setLocekdCamrea } from '../canvas/Move/Move';
import { setPath } from '../Load/Load';

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.updateXGrid = this.updateXGrid.bind(this);
        this.updateYGrid = this.updateYGrid.bind(this);
        this.updateChecked = this.updateChecked.bind(this);
        this.addCurve = this.addCurve.bind(this);
        this.updateCurvePoints = this.updateCurvePoints.bind(this);
        this.updateAddingC2Type = this.updateAddingC2Type.bind(this);
        this.updateSelectedPoints = this.updateSelectedPoints.bind(this);
        this.setCursorToStart = this.setCursorToStart.bind(this);
        this.uniteTwoPoints = this.uniteTwoPoints.bind(this);
        this.setOneProjectionPointState = this.setOneProjectionPointState.bind(this);
        this.lockUnlockCamera = this.lockUnlockCamera.bind(this);
        this.setPath = this.setPath.bind(this);
        this.deselectPoints = this.deselectPoints.bind(this);
        this.selectNavbar = this.selectNavbar.bind(this);
        const cursor = getCursor();
        this.state = {
            cursorX: 0.00,
            cursorY: 0.00,
            cursorZ: 0.00,
            cursorPosX: cursor.screenX,
            cursorPosY: cursor.screenY,
            curvePoints: [],
            navbar: 1 //0 - normal, 1 - bicubic, 2 - cut
        };
    }
    updateAddingC2Type(event) {
        setAddingC2Type(event.target.checked);
    }
    setOneProjectionPointState(event) {
        setOneProjectionPointState(event.target.checked);
    }
    updateXGrid(event) {
        this.props.updateXGrid(parseInt(event.target.value, 10));
    }
    updateSelectedPoints(event) {
        updateSelectedPoints(this.refs.changeX.value, this.refs.changeY.value, this.refs.changeZ.value);
    }
    componentWillReceiveProps(props) {     
        const cursor = getCursor();
            this.setState({
                cursorX: cursor.x.toFixed(2),
                cursorY: cursor.y.toFixed(2),
                cursorZ: cursor.z.toFixed(2),
                cursorPosX: cursor.screenX,
                cursorPosY: cursor.screenY,
                curvePoints: props.curvePoints !== undefined ? props.curvePoints : this.state.curvePoints
            });
    }
    updateYGrid(event) {
        this.props.updateYGrid(parseInt(event.target.value, 10));
    }
    updateChecked(event) {
        this.props.updateChecked(event.target.checked);
    }
    selectNavbar(number) {
        this.setState({
            navbar: number
        });
    }
    updateCurvePoints(points) {
        this.setState({
            curvePoints: points
        });
    }
    addCurve() {
        const curveId = addCurveBySelectedPoints();
        this.updateCurvePoints(getCurvesControlPoints(curveId));
        this.forceUpdate();
    }
    setCursorToStart() {
        setCursor(0,0,0, true);// with redraw
    }
    uniteTwoPoints() {
        uniteTwoPoints();
    }
    lockUnlockCamera(event) {
        setLocekdCamrea(event.target.checked);
    }
    setPath(event) {
        setPath(event.target.files);
    }
    deselectPoints() {
        deselectPoints();
    }
    render(){
        return(
        <div className="ab-navbar">
            <div className="ab-navbar-selector">
                <button className="btn" onClick={(e) => this.selectNavbar(0)}>BASIC</button>
                <button className="btn" onClick={(e) => this.selectNavbar(1)}>INTERSECTION</button>
                <button className="btn" onClick={(e) => this.selectNavbar(2)}>BICUBIC</button>
            </div>
            <div className={this.state.navbar === 0 ? "ab-navbar-visible" : "ab-navbar-not-visible"}>
                <div>
                    <label>Load files:</label>
                    <input className="input-ab" type="file" onChange={this.setPath} accept=".json" />
                </div>
                <div>
                    <button className="btn" onClick={this.setCursorToStart}>Set cursor in (0,0,0)</button>
                </div>
                <div>
                    <button className="btn" onClick={this.deselectPoints}>Mark of all points</button>
                </div>
                <div>
                    <label>Block camera:</label>
                    <input className="input-ab" type="checkbox" onChange={this.lockUnlockCamera} defaultChecked={true}/>
                </div>
                <div>
                    <label>Torus grid X</label>
                    <input className="istyle" type="range" min="2" max="100" onChange={this.updateXGrid} />
                </div>
                <div>
                    <label>Torus grid y</label>
                    <input className="istyle" type="range" min="2" max="100" onChange={this.updateYGrid} />
                </div>
                <div>
                    <label htmlFor="3dTorus">Stereoscopy</label>
                    <input id="3dTorus" type="checkbox" onChange={this.updateChecked} />
                </div>
                <div>
                    <label>Set positions of selected points</label>
                    <div>
                        <div>
                            <label>X: </label>
                            <input className="input-ab" ref="changeX" type="text" defaultValue="0"/>
                        </div>
                        <div>
                            <label>Y: </label>
                            <input className="input-ab" ref="changeY" type="text" defaultValue="0"/>
                        </div>
                        <div>
                            <label>Z: </label>
                            <input className="input-ab" ref="changeZ" type="text" defaultValue="0"/>
                        </div>
                    </div>
                    <button className="btn" onClick={this.updateSelectedPoints}>Submit</button>
                    <div>
                        <label>Cursor position:</label>
                        <label>{"x: " + this.state.cursorX + " y: " + this.state.cursorY + " z: " + this.state.cursorZ}</label>
                    </div>
                </div>
                <div>
                    <label>Screen cursor coordinates:</label>
                    <label>{"x: " + this.state.cursorPosX + " y: " + this.state.cursorPosY}</label>
                </div>
                <div>
                    <button className="btn" onClick={this.addCurve}>Add Bezier curve from selected points</button>
                </div>
                <div>
                    <label>Adding curve C2 in Bezier basis:</label>
                    <input type="checkbox" onChange={this.updateAddingC2Type}/>
                </div>
                <div>
                    <button className="btn" onClick={this.uniteTwoPoints}>Connect two points</button>
                </div>
            </div>
            <List 
                points={this.props.points}
                curves={this.props.curves}
                surfaces={this.props.surfaces}
                gregories={this.props.gregories}
                toruses={this.props.toruses}
                cuttingCurves={this.props.cuttingCurves}
                updateCurvePoints={this.updateCurvePoints}
            />
            <ListPointsInCurve points={this.state.curvePoints} />
            <div className={this.state.navbar === 1 ? "ab-navbar-visible" : "ab-navbar-not-visible"}>
                <NavbarIntersetion />
            </div>
            <div className={this.state.navbar === 2 ? "ab-navbar-visible" : "ab-navbar-not-visible"}>
                <BiCubicNavbar />
            </div>
        </div>);
    }
}