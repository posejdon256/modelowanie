import React, { Component } from 'react';

// css
import './App.css';

// scripts
import NavBar from './scripts/navbar/Navbar';
import Canvas from './scripts/canvas/Canvas';
import Header from './scripts/header/Header';

class App extends Component {
  render() {
    return (
      <div className="ab-main-div">
        <Header />
        <div className="ab-canvas-navbar-container">
          <Canvas />
          <NavBar />
        </div>
      </div>
    );
  }
}

export default App;
