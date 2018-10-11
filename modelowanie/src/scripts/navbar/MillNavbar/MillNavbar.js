import React, {Component} from 'react';
import '../../../css/navbar/Navbar.css';
import { readMill } from '../../Load/ReadMill/ReadMill';

export default class MillNavar extends Component {
    constructor(props) {
        super(props);
        this.setPath = this.setPath.bind(this);
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
            </div>
        );
    }
}