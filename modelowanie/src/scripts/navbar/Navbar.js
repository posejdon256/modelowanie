import React, { Component } from 'react';
import '../../css/navbar/Navbar.css';
import List from './NavbarPoints/List';

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.updateXGrid = this.updateXGrid.bind(this);
        this.updateYGrid = this.updateYGrid.bind(this);
        this.updateChecked = this.updateChecked.bind(this);
    }
    updateXGrid(event) {
        this.props.updateXGrid(parseInt(event.target.value, 10));
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
        </div>);
    }
}