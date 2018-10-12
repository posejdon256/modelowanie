import React, {Component} from 'react';
import '../../../css/navbar/Navbar.css';
import { readMill } from '../../Load/ReadMill/ReadMill';
import { _setXGrid, _setYGrid, _removeMaterial } from '../../canvas/Mill/Material/Material';
import { generateMaterial } from '../../canvas/Mill/Material/Material';

export default class MillNavar extends Component {
    constructor(props) {
        super(props);
        this.setPath = this.setPath.bind(this);
        this.setXGrid = this.setXGrid.bind(this);
        this.setYGrid = this.setYGrid.bind(this);
        this.addMaterial = this.addMaterial.bind(this);
        this.removeMaterial = this.removeMaterial.bind(this);
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
                    <button className="btn" onClick={this.addMaterial}>Add material</button>
                </div>
                <div>
                    <button className="btn" onClick={this.removeMaterial}>Remove Material</button>
                </div>
            </div>
        );
    }
}