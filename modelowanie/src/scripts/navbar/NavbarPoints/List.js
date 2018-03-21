import React, { Component} from 'react';
import '../../../css/navbar/Navbar.css';
import trash from '../../../pictures/trash.png';
import select from '../../../pictures/select.png';
import { removePoint, updatePointName, selectPoint } from '../../canvas/Points/Points';

export default class List extends Component {

    constructor(props) {
        super(props);
        this.updatePointName = this.updatePointName.bind(this);
        this.removePoint = this.removePoint.bind(this);
        this.state = {
            points: []
        }
    }
    componentWillReceiveProps(props) {
        this.setState({
            points: props.points
        });
    }
    updatePointName(id, name) {
        this.setState({
            points: updatePointName(id, name)
        });
    }
    removePoint(id){
        this.setState({
            points: removePoint(id)
        });
    }
    selectPoint(id) {
        this.setState({
            points: selectPoint(id)
        });
    }
    render() {
        const points  = this.state.points;
        const show = true;
        return(
            <div>
                <label>Obiekty sceny:</label>
                <ul className="ab-ul-points">
                {show ?
                    points.map(point => {
                        return (
                        <li key={point.id} className="ab-point-list-li">
                            <input className="ab-point-list-input" key={point.id} type="text" value={point.name} onChange={(e) => this.updatePointName(point.id, e.target.value)}/>
                            <label className="ab-points-list-datas">{"x: " + point.x.toFixed(2) + " y: " + point.y.toFixed(2) + " z: " + point.z.toFixed(2) + " "}</label>
                            <button className="ab-delete-point-button" onClick={(e) => this.removePoint(point.id)}>
                                <img className="ab-delete-point" src={trash} alt="trash" />
                            </button>
                            <button className="ab-points-list-select-button" onClick={(e) => this.selectPoint(point.id)}>
                                <img className="ab-select-point" src={select} alt="select" />
                            </button>
                        </li>
                        );
                    }) : ''
                }
                </ul>
            </div>
        );
    }
}