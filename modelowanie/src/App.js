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
      torusVisible: false
    };

    this.toggleTorus = this.toggleTorus.bind(this);
  }
  toggleTorus() {
    this.setState({
      torusVisible: !this.state.torusVisible
    })
  }
  render() {
    return (
      <div className="ab-main-div">
        <Header toggleTorus={this.toggleTorus} />
        <div className="ab-canvas-navbar-container">
          <Canvas visibleTorus={this.state.torusVisible} />
          <NavBar />
        </div>
      </div>
    );
  }
}

export default App;
