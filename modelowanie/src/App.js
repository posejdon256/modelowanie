import React, { Component } from 'react';

// css
import './App.css';

// scripts
import NavBar from './scripts/navbar/Navbar';
import Canvas from './scripts/canvas/Canvas';
import Header from './scripts/header/Header';

//additional dependencies
import { addPoint, getPoints } from './scripts/canvas/Points/Points';
import { toggleTorus, getTorusVisibility } from './scripts/canvas/Torus/Torus';
import Redraw from './scripts/canvas/Draw/Redraw';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      torusVisible: false,
      gridX: 18,
      gridY: 18,
      points: []
    };

    this.toggleTorus = this.toggleTorus.bind(this);
    this.updateXGrid = this.updateXGrid.bind(this);
    this.updateYGrid = this.updateYGrid.bind(this);
    this.updateChecked = this.updateChecked.bind(this);
    this.addPoint = this.addPoint.bind(this);
    this.refreshNavbar = this.refreshNavbar.bind(this);
  }
  toggleTorus() {
    toggleTorus();
    this.setState({
      torusVisible: getTorusVisibility()
    });
    Redraw();
  }
  refreshNavbar() {
    this.setState({
      points: getPoints()
    });
  }
  addPoint() {
    addPoint();
    this.refreshNavbar();
  }
  updateChecked(stereoscopy) {
    this.setState({
      stereoscopy: stereoscopy
    });
  }
  updateXGrid(gridNumber) {
    this.setState({
      gridX: gridNumber
    });
  }
  updateYGrid(gridNumber) {
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
        />
        <label>{this.state.eyes}</label>
        <div className="ab-canvas-navbar-container">
          <Canvas 
              visibleTorus={this.state.torusVisible}
              gridX={this.state.gridX}
              gridY={this.state.gridY}
              stereoscopy={this.state.stereoscopy}
              refreshNavbar={this.refreshNavbar}
              />
          <NavBar 
            updateXGrid={this.updateXGrid}
            updateYGrid={this.updateYGrid}
            updateChecked={this.updateChecked}
            points={this.state.points}
          />
        </div>
      </div>
    );
  }
}

export default App;
