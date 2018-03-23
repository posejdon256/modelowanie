import React, { Component} from 'react';
import '../../../css/navbar/Navbar.css';
import trash from '../../../pictures/trash.png';
import select from '../../../pictures/select.png';
import selectedRed from '../../../pictures/select_red.png';
import { removePoint, updatePointName, selectPoint } from '../../canvas/Points/Points';
import { selectCurve, removeBezierCurve, turnOnChain } from '../../canvas/Bezier/Bezier';

export default class List extends Component {

    constructor(props) {
        super(props);
        this.updatePointName = this.updatePointName.bind(this);
        this.removePoint = this.removePoint.bind(this);
        this.selectCurve = this.selectCurve.bind(this);
        this.removeCurve = this.removeCurve.bind(this);
        this.state = {
            points: [],
            curves: []
        }
    }
    componentWillReceiveProps(props) {
        this.setState({
            points: props.points,
            curves: props.curves
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
    removeCurve(id) {
        this.setState({
            curves: removeBezierCurve(id)
        });
    }
    selectPoint(id) {
        this.setState({
            points:selectPoint(id)
        });
    }
    turnOnChain(id) {
        this.setState({
            curves: turnOnChain(id)
        });
    }
    selectCurve(id) {
        this.setState({
            curves:selectCurve(id)
        });
    }
    render() {
        const points  = this.state.points;
        const curves = this.state.curves;
        return(
            <div>
                <label>Obiekty sceny:</label>
                <ul className="ab-ul-points">
                {
                    points.map(point => {
                        return (
                        <li key={point.id} className="ab-point-list-li">
                            <input className="ab-point-list-input" key={point.id} type="text" value={point.name} onChange={(e) => this.updatePointName(point.id, e.target.value)}/>
                            <label className="ab-points-list-datas">{"x: " + point.x.toFixed(2) + " y: " + point.y.toFixed(2) + " z: " + point.z.toFixed(2) + " "}</label>
                            <button className="ab-delete-point-button" onClick={(e) => this.removePoint(point.id)}>
                                <img className="ab-delete-point" src={trash} alt="trash" />
                            </button>
                            <button className="ab-points-list-select-button" onClick={(e) => this.selectPoint(point.id)}>
                                <img className="ab-select-point" src={point.selected ? selectedRed : select} alt="select" />
                            </button>
                        </li>
                        );
                    })
                }
                {
                    curves.map(curve => {
                        return (
                        <li key={curve.id} className="ab-point-list-li">
                            <input className="ab-point-list-input" key={curve.id} type="text" value={curve.name} onChange={(e) => this.updatePointName(curve.id, e.target.value)}/>
                            <label className="ab-curve-chain-label">Włącz łamaną</label>
                            <input className="ab-point-list-checkbox" key={curve.id} type="checkbox" checked={curve.chain} onChange={(e) => this.turnOnChain(curve.id)}/>
                            <button className="ab-delete-point-button" onClick={(e) => this.removeCurve(curve.id)}>
                                <img className="ab-delete-point" src={trash} alt="trash" />
                            </button>
                            <button className="ab-points-list-select-button" onClick={(e) => this.selectCurve(curve.id)}>
                                <img className="ab-select-point" src={curve.selected ? selectedRed : select} alt="select" />
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