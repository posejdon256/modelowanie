import React, { Component } from 'react';
import '../../css/navbar/Navbar.css';
import List from './NavbarPoints/List';
import { getCursor } from '../canvas/Cursor/Cursor';
import { addCurveBySelectedPoints } from '../canvas/Bezier/Bezier';

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.updateXGrid = this.updateXGrid.bind(this);
        this.updateYGrid = this.updateYGrid.bind(this);
        this.updateChecked = this.updateChecked.bind(this);
        this.addCurve = this.addCurve.bind(this);

        const cursor = getCursor();
        this.state = {
            cursorX: 0.00,
            cursorY: 0.00,
            cursorZ: 0.00,
            cursorPosX: cursor.screenX,
            cursorPosY: cursor.screenY
        };
    }
    updateXGrid(event) {
        this.props.updateXGrid(parseInt(event.target.value, 10));
    }
    componentWillReceiveProps(props) {     
        const cursor = getCursor();
            this.setState({
                cursorX: cursor.x.toFixed(2),
                cursorY: cursor.y.toFixed(2),
                cursorZ: cursor.z.toFixed(2),
                cursorPosX: cursor.screenX,
                cursorPosY: cursor.screenY
            });
    }
    updateYGrid(event) {
        this.props.updateYGrid(parseInt(event.target.value, 10));
    }
    updateChecked(event) {
        this.props.updateChecked(event.target.checked);
    }
    addCurve() {
        addCurveBySelectedPoints();
        this.forceUpdate();
    }
    render(){
        return(
        <div className="ab-navbar">
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
            <List points={this.props.points} curves={this.props.curves}/>
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
        </div>);
    }
}