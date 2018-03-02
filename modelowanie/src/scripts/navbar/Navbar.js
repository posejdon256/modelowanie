import React, { Component } from 'react';
import '../../css/navbar/Navbar.css';
import ElipsoidNavbar from './Elipsoid/ElipsoidNavbar';

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.updateXGrid = this.updateXGrid.bind(this);
        this.updateYGrid = this.updateYGrid.bind(this);
    }
    updateXGrid(event) {
        this.props.updateXGrid(parseInt(event.target.value, 10));
    }
    updateYGrid(event) {
        this.props.updateYGrid(parseInt(event.target.value, 10));
    }
    render(){
        return(
        <div className="ab-navbar">
            <div>
                <div>
                    <label>Siatka pozioma torusa</label>
                    <input type="range" min="2" max="100" onChange={this.updateXGrid} />
                </div>
                <div>
                    <label>Siatka pionowa torusa</label>
                    <input type="range" min="2" max="100" onChange={this.updateYGrid} />
                </div>
            </div>
             <ElipsoidNavbar updateElipsoid={this.props.updateElipsoid} />
        </div>);
    }
}