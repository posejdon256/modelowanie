import React, { Component} from 'react';
import '../../../css/navbar/Navbar.css';
import unpin from '../../../pictures/unpin.png';
import { unpinPoint } from '../../canvas/Bezier/Curve';

export default class ListPointsInCurve extends Component {

    constructor(props) {
        super(props);
        this.unpinPoint = this.unpinPoint.bind(this);
        this.state = {
            points: []
        }
    }
    componentWillReceiveProps(props) {
        this.setState({
            points: props.points,
        });
    }
    unpinPoint(id){
        this.setState({
            points: unpinPoint(id)
        });
    }
    render() {
        const points  = this.state.points;
        return(
            <div>
                <label>Punkty krzywej:</label>
                <ul className="ab-ul-points">
                {
                    points.map(point => {
                        return !point.c2Bezier ? (
                        <li key={point.id} className="ab-point-list-li">
                            <label className="ab-point-for-curve-list-label">{point.name}</label>
                            <button className="ab-delete-point-button" onClick={(e) => this.unpinPoint(point.id)}>
                                <img className="ab-delete-point" src={unpin} alt="unpin" />
                            </button>
                        </li>
                        ): '';
                    })
                }
                </ul>
            </div>
        );
    }
}