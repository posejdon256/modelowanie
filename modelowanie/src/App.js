import React, { Component } from 'react';

// css
import './App.css';

// scripts
import NavBar from './scripts/navbar/Navbar';
import Canvas from './scripts/canvas/Canvas';
import Header from './scripts/header/Header';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      torusVisible: false,
      gridX: 18,
      gridY: 18
    };

    this.toggleTorus = this.toggleTorus.bind(this);
    this.updateXGrid = this.updateXGrid.bind(this);
    this.updateYGrid = this.updateYGrid.bind(this);
    this.updateChecked = this.updateChecked.bind(this);
  }
  toggleTorus() {
    this.setState({
      torusVisible: !this.state.torusVisible,
    })
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
        <Header toggleTorus={this.toggleTorus} />
        <div className="ab-canvas-navbar-container">
          <Canvas 
              visibleTorus={this.state.torusVisible}
              gridX={this.state.gridX}
              gridY={this.state.gridY}
              stereoscopy={this.state.stereoscopy}
              />
          <NavBar 
            updateXGrid={this.updateXGrid}
            updateYGrid={this.updateYGrid}
            updateChecked={this.updateChecked}
          />
        </div>
      </div>
    );
  }
}

export default App;
