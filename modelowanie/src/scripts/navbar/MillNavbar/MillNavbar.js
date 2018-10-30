import React, {Component} from 'react';
import '../../../css/navbar/Navbar.css';
import { readMill, _setMillType, _setMillMM } from '../../Load/ReadMill/ReadMill';
import { _setXGrid, _setYGrid, _removeMaterial, _setXSize, _setYSize, _setZSize } from '../../canvas/Mill/Material/Material';
import { generateMaterial } from '../../canvas/Mill/Material/Material';
import { generateMill } from '../../canvas/Mill/Mill/Mill';
import { _setAutomatic, _setSpeed, _setMinimumValue, _stop } from '../../canvas/Mill/Drill/Drill';
import { ShowPaths } from '../../canvas/Draw/DrawLine/DrawLines';

export default class MillNavar extends Component {
    constructor(props) {
        super(props);
        this.setPath = this.setPath.bind(this);
        this.setXGrid = this.setXGrid.bind(this);
        this.setYGrid = this.setYGrid.bind(this);
        this.addMaterial = this.addMaterial.bind(this);
        this.removeMaterial = this.removeMaterial.bind(this);
        this.stopMill = this.stopMill.bind(this);
        this.setXSize = this.setXSize.bind(this);
        this.setYSize = this.setYSize.bind(this);
        this.setZSize = this.setZSize.bind(this);
        this.setAutomatic = this.setAutomatic.bind(this);
        this.setSpeed = this.setSpeed.bind(this);
        this.showPaths = this.showPaths.bind(this);
        this.setMaxDown = this.setMaxDown.bind(this);
        this.setType = this.setType.bind(this);
        this.setMillSize = this.setMillSize.bind(this);
    }
    setMaxDown(e) {
        _setMinimumValue(e.target.value);
    }
    setType(e) {
        if(e.target.value === "k" || e.target.value === "f") {
            _setMillType(e.target.value);
        }
    }
    setMillSize(e) {
        _setMillMM(e.target.value);
    }
    stopMill() {
        _stop();
    }
    setXSize(e) {
        _setXSize(e.target.value)
    }
    setYSize(e) {
        _setYSize(e.target.value);
    }
    setZSize(e) {
        _setZSize(e.target.value);
    }
    removeMaterial() {
        _removeMaterial();
    }
    addMaterial() {
        generateMaterial();
    }
    setXGrid(e) {
        _setXGrid(e.target.value);
    }
    setYGrid(e) {
        _setYGrid(e.target.value);
    }
    setPath(e){
        readMill(e.target.files);
    }
    setAutomatic() {
        _setAutomatic();
    }
    setSpeed(e) {
        _setSpeed(e.target.value);
    }
    showPaths() {
        ShowPaths();
    }
    render(){
        return(
            <div className="ab-bicubic">
                <div>
                    <label>Load milling file:</label>
                    <input className="input-ab" type="file" onChange={this.setPath} />
                </div>
                <div>
                    <label>X material grid: </label>
                    <input className="input-ab" type="text" onChange={this.setXGrid} defaultValue={100}/>
                </div>
                <div>
                    <label>Y material grid: </label>
                    <input className="input-ab" type="text" onChange={this.setYGrid} defaultValue={100}/>
                </div>
                <div>
                    <label>X size: </label>
                    <input className="input-ab" type="text" onChange={this.setXSize} defaultValue={15}/>
                </div>
                <div>
                    <label>Y size: </label>
                    <input className="input-ab" type="text" onChange={this.setYSize} defaultValue={15}/>
                </div>
                <div>
                    <label>Z size: </label>
                    <input className="input-ab" type="text" onChange={this.setZSize} defaultValue={5}/>
                </div>
                <div>
                    <label>Speed: </label>
                    <input className="input-ab" type="text" onChange={this.setSpeed} defaultValue={1}/>
                </div>
                <div>
                    <label>Max mill down: </label>
                    <input className="input-ab" type="text" onChange={this.setMaxDown} defaultValue={2}/>
                </div>
                <div>
                    <label>Mill type: </label>
                    <input className="input-ab" type="text" onChange={this.setType} defaultValue={"k"}/>
                </div>
                <div>
                    <label>Mill Size: </label>
                    <input className="input-ab" type="text" onChange={this.setMillSize} defaultValue={12}/>
                </div>
                <div>
                    <label>Automatic: </label>
                    <input className="input-ab" type="checkbox" onChange={this.setAutomatic}/>
                </div>
                <div>
                    <label>Show paths: </label>
                    <input className="input-ab" type="checkbox" onChange={this.showPaths}/>
                </div>
                <div>
                    <button className="btn" onClick={this.addMaterial}>Add material</button>
                </div>
                <div>
                    <button className="btn" onClick={this.removeMaterial}>Remove Material</button>
                </div>
                <div>
                    <button className="btn" onClick={this.stopMill}>Stop Mill</button>
                </div>
            </div>
        );
    }
}