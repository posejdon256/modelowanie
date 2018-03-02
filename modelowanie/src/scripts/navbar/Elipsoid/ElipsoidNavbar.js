import React, { Component } from 'react';

export default class ElipsoidNavbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            radius: {
                X: 1,
                Y: 1,
                Z: 1
            }
        };
        this.updateElipsoideX = this.updateElipsoideX.bind(this);
        this.updateElipsoideY = this.updateElipsoideY.bind(this);
        this.updateElipsoideZ = this.updateElipsoideZ.bind(this);
    }
    updateElipsoideX(event) {
        const { radius } = this.state;

        radius.X = parseInt(event.target.value, 10);
        this.props.updateElipsoid(radius);

        this.setState({radius});
    }
    updateElipsoideY(event) {
        const { radius } = this.state;

        radius.Y = parseInt(event.target.value, 10);
        this.props.updateElipsoid(radius);

        this.setState({radius});
    }
    updateElipsoideZ(event) {
        const { radius } = this.state;

        radius.Z = parseInt(event.target.value, 10);
        this.props.updateElipsoid(radius);

        this.setState({radius});
    }
    render() {
        return(
        <div>
            <div>
                <label>Promień X elipsoidy</label>
                <input type="range" min="1" max="100" onChange={this.updateYGrid} />
            </div>
            <div>
                <label>Promień Y elipsoidy</label>
                <input type="range" min="1" max="100" onChange={this.updateYGrid} />
            </div>
            <div>
                <label>Promień Z elipsoidy</label>
                <input type="range" min="1" max="100" onChange={this.updateYGrid} />
            </div>
        </div>
        );
    }
}