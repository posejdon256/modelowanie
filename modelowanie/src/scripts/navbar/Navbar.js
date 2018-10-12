import React, { Component } from 'react';
import '../../css/navbar/Navbar.css';
import'../../css/formbase.min.css';
import List from './NavbarPoints/List';
import ListPointsInCurve from './NavbarPoints/ListPointsInCurve';
import BiCubicNavbar from './BiCubicNavbar/BiCubicNavbar';
import NavbarIntersetion from './NavbutIntersection';
import MillNavar from './MillNavbar/MillNavbar';

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

        // this.updateXGrid = this.updateXGrid.bind(this);
        // this.updateYGrid = this.updateYGrid.bind(this);
        // this.updateChecked = this.updateChecked.bind(this);
        // this.addCurve = this.addCurve.bind(this);
        // this.updateCurvePoints = this.updateCurvePoints.bind(this);
        // this.updateAddingC2Type = this.updateAddingC2Type.bind(this);
        // this.updateSelectedPoints = this.updateSelectedPoints.bind(this);
        // this.setCursorToStart = this.setCursorToStart.bind(this);
        // this.uniteTwoPoints = this.uniteTwoPoints.bind(this);
        // this.setOneProjectionPointState = this.setOneProjectionPointState.bind(this);
        // this.lockUnlockCamera = this.lockUnlockCamera.bind(this);
        // this.setPath = this.setPath.bind(this);
        // this.deselectPoints = this.deselectPoints.bind(this);
        this.selectNavbar = this.selectNavbar.bind(this);
        const cursor = getCursor();
        this.state = {
            cursorX: 0.00,
            cursorY: 0.00,
            cursorZ: 0.00,
            cursorPosX: cursor.screenX,
            cursorPosY: cursor.screenY,
            curvePoints: [],
            navbar: 3 //0 - normal, 1 - bicubic, 2 - cut
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
                <button className="btn" onClick={(e) => this.selectNavbar(3)}>MILL</button>
            </div>
            <div className={this.state.navbar === 0 ? "ab-navbar-visible" : "ab-navbar-not-visible"}>
                <div>
                    <label>Load files:</label>
                    <input className="input-ab" type="file" onChange={this.setPath} accept=".json" />
                </div>
            </div>
            <div className={this.state.navbar === 3 ? "ab-navbar-visible" : "ab-navbar-not-visible"}>
                <MillNavar />
            </div>
        </div>);
    }
}