import React, {Component} from 'react';
import '../../../css/navbar/Navbar.css';
import { readMill } from '../../Load/ReadMill/ReadMill';
import { _setXGrid, _setYGrid, _removeMaterial, _setXSize, _setYSize, _setZSize } from '../../canvas/Mill/Material/Material';
import { generateMaterial } from '../../canvas/Mill/Material/Material';
import { generateMill } from '../../canvas/Mill/Mill/Mill';

export default class MillNavar extends Component {
    constructor(props) {
        super(props);
        this.setPath = this.setPath.bind(this);
        this.setXGrid = this.setXGrid.bind(this);
        this.setYGrid = this.setYGrid.bind(this);
        this.addMaterial = this.addMaterial.bind(this);
        this.removeMaterial = this.removeMaterial.bind(this);
        this.addMill = this.addMill.bind(this);
        this.setXSize = this.setXSize.bind(this);
        this.setYSize = this.setYSize.bind(this);
        this.setZSize = this.setZSize.bind(this);
    }
    addMill() {
        generateMill();
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
    render(){
        return(
            <div className="ab-bicubic">
                <div>
                    <label>Load milling file:</label>
                    <input className="input-ab" type="file" onChange={this.setPath} />
                </div>
                <div>
                    <label>X material grid: </label>
                    <input className="input-ab" type="text" onChange={this.setXGrid} defaultValue={4}/>
                </div>
                <div>
                    <label>Y material grid: </label>
                    <input className="input-ab" type="text" onChange={this.setYGrid} defaultValue={4}/>
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
                    <button className="btn" onClick={this.addMaterial}>Add material</button>
                </div>
                <div>
                    <button className="btn" onClick={this.removeMaterial}>Remove Material</button>
                </div>
                <div>
                    <button className="btn" onClick={this.addMill}>Add Mill</button>
                </div>
            </div>
        );
    }
}