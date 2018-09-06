import React, { Component } from 'react';

// css
import './App.css';

// scripts
import NavBar from './scripts/navbar/Navbar';
import Canvas from './scripts/canvas/Canvas';
import Header from './scripts/header/Header';

//additional dependencies
import { addPoint, getPoints } from './scripts/canvas/Points/Points';
import Redraw from './scripts/canvas/Draw/Redraw';
import { addBezierCurve, setAddBezierState } from './scripts/canvas/Bezier/Bezier';
import { addBsplineCurve, setAddingC2State } from './scripts/canvas/Bezier/BSpline';
import { getCurves, getCurvesControlPoints } from './scripts/canvas/Bezier/Curve';
import { turnOffAllStates } from './scripts/canvas/StatesCenter/StatesCenter';
import { setInterpolationState, addInterpolationCurve } from './scripts/canvas/Bezier/Interpolation';
import { getSurfaces } from './scripts/canvas/Surface/Surface';
import { getGrzegorzys } from './scripts/canvas/Gregory/Gregory';
import { addTorus, getToruses, setTorusMesh } from './scripts/canvas/Torus/Torus';
import { getCuttingCurves } from './scripts/canvas/CuttingCurve/CuttingCurve';
import { RedrawVisualization } from './scripts/canvas/Draw/RedrawVisualisation/RedrawVisualization';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridX: 18,
      gridY: 18,
      points: [],
      curves: [],
      surfaces: [],
      gregories: [],
      toruses: [],
      cuttingCurves:[],
      visualisate: true
    };

    this.addTorus = this.addTorus.bind(this);
    this.updateXGrid = this.updateXGrid.bind(this);
    this.updateYGrid = this.updateYGrid.bind(this);
    this.updateChecked = this.updateChecked.bind(this);
    this.addPoint = this.addPoint.bind(this);
    this.refreshNavbar = this.refreshNavbar.bind(this);
    this.addCurve = this.addCurve.bind(this);
    this.showVisualization = this.showVisualization.bind(this);
  }
  addTorus() {
    addTorus();
    Redraw();
  }
  refreshNavbar() {
    this.setState({
      points: getPoints("on-scene"),
      curves: getCurves(),
      surfaces: getSurfaces(),
      curvePoints: getCurvesControlPoints(),
      gregories: getGrzegorzys(),
      cuttingCurves: getCuttingCurves(),
      toruses: getToruses(),
    });
  }
  addPoint() {
    addPoint();
    this.refreshNavbar();
  }
  addCurve(type) {
    turnOffAllStates();
    if(type === "Bspline") {
        addBsplineCurve();
        setAddingC2State(true);
    } else if(type === "C2I") {
        addInterpolationCurve();
        setInterpolationState(true);
    }
    else {
      addBezierCurve();
      setAddBezierState(true);
    }
    this.refreshNavbar();
  }
  updateChecked(stereoscopy) {
    this.setState({
      stereoscopy: stereoscopy
    });
  }
  updateXGrid(gridNumber) {
    setTorusMesh(gridNumber, this.state.gridY);
    this.setState({
      gridX: gridNumber
    });
  }
  showVisualization() {
    this.setState({
      visualisate: true
    });
    try{
      RedrawVisualization();
    } catch(e) {
      console.log("Canvases problem" + e);
    }
  }
  updateYGrid(gridNumber) {
    setTorusMesh(this.state.gridX, gridNumber);
    this.setState({
      gridY: gridNumber
    });
  }
  render() {
    return (
      <div className="ab-main-div">
        <Header 
          toggleTorus={this.toggleTorus} 
          addPoint={this.addPoint} 
          addCurve={this.addCurve}
          ShowVisualization={this.showVisualization}
        />
        <label>{this.state.eyes}</label>
        <div className="ab-canvas-navbar-container">
          <Canvas 
              visibleTorus={this.state.torusVisible}
              gridX={this.state.gridX}
              gridY={this.state.gridY}
              stereoscopy={this.state.stereoscopy}
              refreshNavbar={this.refreshNavbar}
              visualisate={this.state.visualisate}
              />
          <NavBar 
            updateXGrid={this.updateXGrid}
            updateYGrid={this.updateYGrid}
            updateChecked={this.updateChecked}
            points={this.state.points}
            curves={this.state.curves}
            surfaces={this.state.surfaces}
            gregories={this.state.gregories}
            toruses={this.state.toruses}
            curvePoints={this.state.curvePoints}
            cuttingCurves={this.state.cuttingCurves}
          />
        </div>
      </div>
    );
  }
}

export default App;
