import './App.css';

import React, { Component } from 'react';

import Canvas from './scripts/canvas/Canvas';
import Header from './scripts/header/Header';
import NavBar from './scripts/navbar/Navbar';

// css
// scripts
//additional dependencies
class App extends Component {
  constructor(props) {
    super(props);

    var isChromium = window.chrome;
    var winNav = window.navigator;
    var vendorName = winNav.vendor;
    var isOpera = typeof window.opr !== "undefined";
    var isIEedge = winNav.userAgent.indexOf("Edge") > -1;
    var isIOSChrome = winNav.userAgent.match("CriOS");
    
    if (isIOSChrome) {
       alert("Application works properly only on Chrome for now. It is not working on any mobile device.");
    } else if(
      isChromium !== null &&
      typeof isChromium !== "undefined" &&
      vendorName === "Google Inc." &&
      isOpera === false &&
      isIEedge === false
    ) {
       // is Google Chrome
    } else { 
      alert("Application works properly only on Chrome for now. It is not working on any mobile devices.");
    }
  }

  render() {
    return (
      <div className="ab-main-div">
        <Header 
        />
        <div className="ab-canvas-navbar-container">
          <Canvas 
              />
          <NavBar 
          />
        </div>
      </div>
    );
  }
}

export default App;
