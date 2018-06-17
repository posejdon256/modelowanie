import React, {Component} from 'react';
import '../../../css/navbar/Navbar.css';
import { setCylinder, setWidth, setHeight, updateSelectedCurveGrid, setGridX, setGridY, setAbsoluteHeight, setAbsoluteWidth, setDirection } from '../../canvas/Surface/Surface';

export default class BiCubicNavbar extends Component {
    constructor(props) {
        super(props);
        this.updateHeight = this.updateHeight.bind(this);
        this.updateWidth = this.updateWidth.bind(this);
        this.updateCylinder = this.updateCylinder.bind(this);
        this.updateGridOnSelectedSurface = this.updateGridOnSelectedSurface.bind(this);
        this.setGridX = this.setGridX.bind(this);
        this.setGridY = this.setGridY.bind(this);
        this.setDirection = this.setDirection.bind(this);
        this.updateAbsoluteHeight = this.updateAbsoluteHeight.bind(this);
        this.updateAbsoluteWidth = this.updateAbsoluteWidth.bind(this);
    }
    updateHeight(event){
        setHeight(event.target.value);
    }
    updateWidth(event){
        setWidth(event.target.value);
    }
    updateAbsoluteHeight(event) {
        setAbsoluteHeight(event.target.value);
    }
    updateAbsoluteWidth(event) {
        setAbsoluteWidth(event.target.value);
    }
    updateCylinder(event){
        setCylinder(event.target.checked);
    }
    updateGridOnSelectedSurface(event) {
        updateSelectedCurveGrid();
    }
    setGridX(event){
        setGridX(event.target.value);
    }
    setGridY(event) {
        setGridY(event.target.value);
    }
    setDirection() {
        setDirection(this.refs.selectDirection.value);
    }
    render(){
        return(
            <div className="ab-bicubic">
                <label>Parametry łączonego płata</label>
                <div>
                    <label>Wysokość: </label>
                    <input className="input-ab" type="text" onChange={this.updateHeight} defaultValue={1}/>
                </div>
                <div>
                    <label>Szerokość: </label>
                    <input className="input-ab" type="text"  onChange={this.updateWidth} defaultValue={1}/>
                </div>
                <div>
                    <label htmlFor="bicuBicCheckbox">Walec</label>
                    <input className="input-ab" id="bicuBicCheckbox" type="checkbox" onChange={this.updateCylinder}/>
                </div>
                <div>
                    <label>Siatka po X: </label>
                    <input className="input-ab" type="text" onChange={this.setGridX} defaultValue={4}/>
                </div>
                <div>
                    <label>Siatka po Y: </label>
                    <input className="input-ab" type="text"  onChange={this.setGridY} defaultValue={4}/>
                </div>
                <div>
                    <label>Stała Szerokość: </label>
                    <input className="input-ab" type="text" onChange={this.updateAbsoluteHeight} defaultValue={0.07}/>
                </div>
                <div>
                    <label>Stała Wysokość: </label>
                    <input className="input-ab" type="text"  onChange={this.updateAbsoluteWidth} defaultValue={0.07}/>
                </div>
                <div>
                    <button className="btn" onClick={this.updateGridOnSelectedSurface}>Podmień siatki zaznaczonych płatków</button>
                </div>
                <select ref="selectDirection" onChange={this.setDirection}>
                    <option value="X">Walec po X</option>
                    <option value="Y">Walec po Y</option>
                    <option value="Z">Walec po Z</option>
                </select>
            </div>
        );
    }
}