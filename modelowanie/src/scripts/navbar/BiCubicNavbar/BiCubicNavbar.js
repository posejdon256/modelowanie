import React, {Component} from 'react';
import '../../../css/navbar/Navbar.css';
import { setCylinder, setWidth, setHeight } from '../../canvas/Surface/Surface';

export default class BiCubicNavbar extends Component {
    constructor(props) {
        super(props);
        this.updateHeight = this.updateHeight.bind(this);
        this.updateWidth = this.updateWidth.bind(this);
        this.updateCylinder = this.updateCylinder.bind(this);
    }
    updateHeight(event){
        setHeight(event.target.value);
    }
    updateWidth(event){
        setWidth(event.target.value);
    }
    updateCylinder(event){
        setCylinder(event.target.checked);
    }
    render(){
        return(
            <div className="ab-bicubic">
                <label>Parametry łączonego płata</label>
                <div>
                    <label>Wysokość: </label>
                    <input type="text" onChange={this.updateHeight} defaultValue={1}/>
                </div>
                <div>
                    <label>Szerokość: </label>
                    <input type="text"  onChange={this.updateWidth} defaultValue={1}/>
                </div>
                <div>
                    <label htmlFor="bicuBicCheckbox">Płaski/walec</label>
                    <input id="bicuBicCheckbox" type="checkbox" onChange={this.updateCylinder}/>
                </div>
            </div>
        );
    }
}