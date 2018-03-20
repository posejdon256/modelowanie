import React, { Component } from 'react';
import '../../css/navbar/Navbar.css';
import List from './NavbarPoints/List';
import { getCursor } from '../canvas/Cursor/Cursor';

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.updateXGrid = this.updateXGrid.bind(this);
        this.updateYGrid = this.updateYGrid.bind(this);
        this.updateChecked = this.updateChecked.bind(this);
        this.state = {
            cursorX: 0.00,
            cursorY: 0.00,
            cursorZ: 0.00
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
            <List points={this.props.points}/>
            <div>
                <label>Pozycja kursora:</label>
                <label>{"x: " + this.state.cursorX + " y: " + this.state.cursorY + " z: " + this.state.cursorZ}</label>
            </div>
            <div>
                <label>Współrzędne ekranowe:</label>
                <label>{"x: " + this.state.cursorPosX + " y: " + this.state.cursorPosY}</label>
            </div>
        </div>);
    }
}