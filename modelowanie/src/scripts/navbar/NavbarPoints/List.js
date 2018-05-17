import React, { Component} from 'react';
import '../../../css/navbar/Navbar.css';
import trash from '../../../pictures/trash.png';
import select from '../../../pictures/select.png';
import selectedRed from '../../../pictures/select_red.png';
import { updatePointName, selectPoint, removePointWithRedraw } from '../../canvas/Points/Points';
import { turnOnChain } from '../../canvas/Bezier/Bezier';
import { updateCurveName, getCurveById, selectCurve, getCurvesControlPoints, removeCurve } from '../../canvas/Bezier/Curve';
import { removeSurface, updateSurfaceName, turnOnSurfaceChain, selectSurface } from '../../canvas/Surface/Surface';
import { turnOnNormals, setGregoryName, selectGrzegorz, removeGregory } from '../../canvas/Gregory/Gregory';

export default class List extends Component {

    constructor(props) {
        super(props);
        this.updatePointName = this.updatePointName.bind(this);
        this.removePoint = this.removePoint.bind(this);
        this.selectCurve = this.selectCurve.bind(this);
        this.removeCurve = this.removeCurve.bind(this);
        this.updateCurveName = this.updateCurveName.bind(this);
        this.updateSurfaceName = this.updateSurfaceName.bind(this);
        this.removeSurface = this.removeSurface.bind(this);
        this.selectSurface = this.selectSurface.bind(this);
        this.turnOnChainSurface = this.turnOnChainSurface.bind(this);
        this.turnOnNormals = this.turnOnNormals.bind(this);
        this.updateGregoryName = this.updateGregoryName.bind(this);
        this.selectGrzegorz = this.selectGrzegorz.bind(this);
        this.removeGrzegorz = this.removeGrzegorz.bind(this);
        this.state = {
            points: [],
            curves: [],
            surfaces: [],
            gregories:[]
        }
    }
    componentWillReceiveProps(props) {
        this.setState({
            points: props.points,
            curves: props.curves,
            surfaces: props.surfaces,
            gregories: props.gregories
        });
    }
    updatePointName(id, name) {
        this.setState({
            points: updatePointName(id, name).filter(x => x.visible !== false && !x.c2Bezier)
        });
    }
    updateGregoryName(id, name) {
        this.setState({
            gregories: setGregoryName(id, name)
        });
    }
    updateCurveName(id, name) {
        this.setState({
            curves: updateCurveName(id, name)
        });
    }
    updateSurfaceName(id, name) {
        this.setState({
            surfaces: updateSurfaceName(id, name)
        });
    }
    selectSurface(id) {
        this.setState({
            surfaces: selectSurface(id)
        });
    }
    removeSurface(id) {
        this.setState({
            surfaces: removeSurface(id)
        });
    }
    removeGrzegorz(id) {
        this.setState({
            gregories: removeGregory(id)
        });
    }
    turnOnChainSurface(id) {
        this.setState({
            surfaces: turnOnSurfaceChain(id)
        });
    }
    turnOnNormals(id) {
        this.setState({
            gregories: turnOnNormals(id)
        });
    }
    removePoint(id){
        this.setState({
            points: removePointWithRedraw(id).filter(x => x.visible !== false && !x.c2Bezier)
        });
        this.props.updateCurvePoints(getCurvesControlPoints());
    }
    removeCurve(id) {
        this.setState({
            curves: removeCurve(id)
        });
        this.props.updateCurvePoints([]);
    }
    selectPoint(id) {
        this.setState({
            points:selectPoint(id).filter(x => x.visible !== false && !x.c2Bezier)
        });
    }
    turnOnChain(id) {
        this.setState({
            curves: turnOnChain(id)
        });
    }
    selectGrzegorz(id) {
        this.setState({
            gregories: selectGrzegorz(id)
        });
    }
    selectCurve(id) {
        this.setState({
            curves:selectCurve(id)
        });
        const curve = getCurveById(id);
        if(!curve.selected)
            this.props.updateCurvePoints([]);
        else
            this.props.updateCurvePoints(curve.type === "C2" ? curve.pointsBspline : (curve.type === "C2I" ? curve.interpolationPoints : curve.points));
    }
    render() {
        const points  = this.state.points;
        const curves = this.state.curves;
        const surfaces = this.state.surfaces;
        const gregories = this.state.gregories;
        return(
            <div>
                <label>Obiekty sceny:</label>
                <ul className="ab-ul-points">
                {
                    gregories.map(gregory => {
                        return (
                        <li key={"point" + gregory.id} className="ab-point-list-li">
                            <input className="ab-point-list-input" type="text" value={gregory.name} onChange={(e) => this.updateGregoryName(gregory.id, e.target.value)}/>
                            <label className="ab-curve-chain-label">Włącz normalne</label>
                            <input className="ab-point-list-checkbox" key={gregory.id} type="checkbox" checked={gregory.normals} onChange={(e) => this.turnOnNormals(gregory.id)}/>
                            <button className="ab-delete-point-button" onClick={(e) => this.removeGrzegorz(gregory.id)}>
                                <img className="ab-delete-point" src={trash} alt="trash" />
                            </button>
                            <button className="ab-points-list-select-button" onClick={(e) => this.selectGrzegorz(gregory.id)}>
                                <img className="ab-select-point" src={gregory.selected ? selectedRed : select} alt="select" />
                            </button>
                        </li>
                        );
                    })
                }
                {
                    surfaces.map(surface => {
                        return (
                        <li key={"point" + surface.id} className="ab-point-list-li">
                            <input className="ab-point-list-input" type="text" value={surface.name} onChange={(e) => this.updateSurfaceName(surface.id, e.target.value)}/>
                            <label className="ab-curve-chain-label">Włącz łamaną</label>
                            <input className="ab-point-list-checkbox" key={surface.id} type="checkbox" checked={surface.chain} onChange={(e) => this.turnOnChainSurface(surface.id)}/>
                            <button className="ab-delete-point-button" onClick={(e) => this.removeSurface(surface.id)}>
                                <img className="ab-delete-point" src={trash} alt="trash" />
                            </button>
                            <button className="ab-points-list-select-button" onClick={(e) => this.selectSurface(surface.id)}>
                                <img className="ab-select-point" src={surface.selected ? selectedRed : select} alt="select" />
                            </button>
                        </li>
                        );
                    })
                }
                {
                    points.map(point => {
                        return (point.visible !== false && !point.c2Bezier ?(
                        <li key={"point" + point.id} className="ab-point-list-li">
                            <input className="ab-point-list-input" type="text" value={point.name} onChange={(e) => this.updatePointName(point.id, e.target.value)}/>
                            <label className="ab-points-list-datas">{"x: " + point.x.toFixed(2) + " y: " + point.y.toFixed(2) + " z: " + point.z.toFixed(2) + " "}</label>
                            <button className="ab-delete-point-button" onClick={(e) => this.removePoint(point.id)}>
                                <img className="ab-delete-point" src={trash} alt="trash" />
                            </button>
                            <button className="ab-points-list-select-button" onClick={(e) => this.selectPoint(point.id)}>
                                <img className="ab-select-point" src={point.selected ? selectedRed : select} alt="select" />
                            </button>
                        </li>
                        ) : '');
                    })
                }
                {
                    curves.map(curve => {
                        return (!curve.surface ? (
                        <li key={"curve" + curve.id} className="ab-point-list-li">
                            <input className="ab-point-list-input" type="text" value={curve.name} onChange={(e) => this.updateCurveName(curve.id, e.target.value)}/>
                            <label className="ab-curve-chain-label">Włącz łamaną</label>
                            <input className="ab-point-list-checkbox" key={curve.id} type="checkbox" checked={curve.chain} onChange={(e) => this.turnOnChain(curve.id)}/>
                            <button className="ab-delete-point-button" onClick={(e) => this.removeCurve(curve.id)}>
                                <img className="ab-delete-point" src={trash} alt="trash" />
                            </button>
                            <button className="ab-points-list-select-button" onClick={(e) => this.selectCurve(curve.id)}>
                                <img className="ab-select-point" src={curve.selected ? selectedRed : select} alt="select" />
                            </button>
                        </li>) : ''
                        ); 
                })
            }
                </ul>
            </div>
        );
    }
}