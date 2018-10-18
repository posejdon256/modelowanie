import React, { Component } from 'react';
import '../../css/header/Header.css';
import '../../css/tooltip/Tooltip.css';
import drill from '../../pictures/drilling.png';
import { Drill } from '../canvas/Mill/Drill/Drill';


export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.drillFun = this.drillFun.bind(this);
    }
    drillFun() {
        Drill();

    }
    render(){
        return(
        <div className="ab-header">
            <button className={"ab-torus-button tooltip"} onClick={this.drillFun}>
                <img className="ab-point-image" src={drill} alt="intersection curve" />
                <span class="tooltiptext">Drill</span>
            </button> 
        </div>);
    }
}