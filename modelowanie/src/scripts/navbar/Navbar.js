import React, { Component } from 'react';
import '../../css/navbar/Navbar.css';
import List from './NavbarPoints/List';
import ListPointsInCurve from './NavbarPoints/ListPointsInCurve';
import BiCubicNavbar from './BiCubicNavbar/BiCubicNavbar';

import { getCursor, setCursor } from '../canvas/Cursor/Cursor';
import { setAddingC2Type } from '../canvas/Bezier/BSpline';
import { getCurvesControlPoints, addCurveBySelectedPoints } from '../canvas/Bezier/Curve';
import { updateSelectedPoints } from '../canvas/Points/Points';
import { uniteTwoPoints } from '../canvas/Gregory/Claps';
import { setIntersectionStep } from '../canvas/CuttingCurve/FindIntersection';
import { setNewtonAlpa, setFinalEpsilon } from '../canvas/CuttingCurve/NewtonMethod';
import { setOneProjectionPointState } from '../canvas/CuttingCurve/Projection';
import { setLocekdCamrea } from '../canvas/Move/Move';

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
        this.setIntersectionStep = this.setIntersectionStep.bind(this);
        this.setNewton = this.setNewton.bind(this);
        this.setFinalEpsilon = this.setFinalEpsilon.bind(this);
        this.setOneProjectionPointState = this.setOneProjectionPointState.bind(this);
        this.lockUnlockCamera = this.lockUnlockCamera.bind(this);
        const cursor = getCursor();
        this.state = {
            cursorX: 0.00,
            cursorY: 0.00,
            cursorZ: 0.00,
            cursorPosX: cursor.screenX,
            cursorPosY: cursor.screenY,
            curvePoints: []
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
    setIntersectionStep(event) {
        setIntersectionStep(event.target.value);
    }
    setNewton(event) {
        setNewtonAlpa(event.target.value);
    }
    setFinalEpsilon(event) {
        setFinalEpsilon(event.target.value);
    }
    uniteTwoPoints() {
        uniteTwoPoints();
    }
    lockUnlockCamera(event) {
        setLocekdCamrea(event.target.checked);
    }
    render(){
        return(
        <div className="ab-navbar">
            <div>
                <button onClick={this.setCursorToStart}>Ustaw Kursor w (0,0,0)</button>
            </div>
            <div>
                <label>Zablokuj/Odblokuj kamerę:</label>
                <input type="checkbox" onChange={this.lockUnlockCamera}/>
            </div>
            <div>
                <label>Siatka pozioma</label>
                <input type="range" min="2" max="100" onChange={this.updateXGrid} />
            </div>
            <div>
                <label>Siatka pionowa</label>
                <input type="range" min="2" max="100" onChange={this.updateYGrid} />
            </div>
            <div>
                <label htmlFor="3dTorus">Stereoskopia</label>
                <input id="3dTorus" type="checkbox" onChange={this.updateChecked} />
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
            <div>
                <label>Ustaw położenia zaznaczonych punktów</label>
                <div>
                    <div>
                        <label>X: </label>
                        <input className="ab-small-input" ref="changeX" type="text" defaultValue="0"/>
                    </div>
                    <div>
                        <label>Y: </label>
                        <input className="ab-small-input" ref="changeY" type="text" defaultValue="0"/>
                    </div>
                    <div>
                        <label>Z: </label>
                        <input className="ab-small-input" ref="changeZ" type="text" defaultValue="0"/>
                    </div>
                </div>
                <button onClick={this.updateSelectedPoints}>Zamień</button>
            </div>
            <div className="ab-bicubic">
                <div>
                    <label>Ustaw krok znajdowania przecięcia:</label>
                    <input type="text" onChange={this.setIntersectionStep} defaultValue="3"/>
                </div>
                <div>
                    <label>Ustaw krok Newtona:</label>
                    <input type="text" onChange={this.setNewton} defaultValue="0.002"/>
                </div>
                <div>
                    <label>Ustaw Epsilon warunku końcowego:</label>
                    <input type="text" onChange={this.setFinalEpsilon} defaultValue="0.001"/>
                </div>
                <div>
                    <label>Włącz/wyłącz podgląd ze znajdowaniem punktu przecięcia:</label>
                    <input type="checkbox" onChange={this.setOneProjectionPointState}/>
                </div>
            </div>
            <ListPointsInCurve points={this.state.curvePoints} />
            <div>
                <label>Pozycja kursora:</label>
                <label>{"x: " + this.state.cursorX + " y: " + this.state.cursorY + " z: " + this.state.cursorZ}</label>
            </div>
            <div>
                <label>Współrzędne ekranowe:</label>
                <label>{"x: " + this.state.cursorPosX + " y: " + this.state.cursorPosY}</label>
            </div>
            <div>
                <button onClick={this.addCurve}>Dodaj krzywą Beziera z punktów</button>
            </div>
            <div>
                <label>Dodawanie krzywej C2 w bazie Beziera:</label>
                <input type="checkbox" onChange={this.updateAddingC2Type}/>
            </div>
            <div>
                <button onClick={this.uniteTwoPoints}>Scal dwa punkty</button>
            </div>
            <BiCubicNavbar />
        </div>);
    }
}