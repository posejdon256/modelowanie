import React, { Component} from 'react';
import '../../../css/header/Header.css';
import trash from '../../../pictures/trash.png';
import { removePoint, updatePointName } from '../../canvas/Points/Points';

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
    render() {
        const points  = this.state.points;
        return(
            <div>
                <label>Punkty sceny:</label>
                <ul className="ab-ul-points">
                {
                    points.map(point => {
                        return (
                        <li className="ab-point-list-li">
                            <input className="ab-point-list-input" key={point.id} type="text" value={point.name} onChange={(e) => this.updatePointName(point.id, e.target.value)}/>
                            <button className="ab-delete-point-button" onClick={(e) => this.removePoint(point.id)}>
                                <img className="ab-delete-point" src={trash} alt="trash" />
                            </button>
                        </li>
                        );
                    })
                }
                </ul>
            </div>
        );
    }
}