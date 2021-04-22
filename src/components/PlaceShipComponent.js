import React, {Component} from 'react';

class PlaceShipComponent extends Component {
    render() {
        return (
        <button active={this.props.active} onClick={this.props.onClick}>
            {this.props.shipName} 
        </button>);
    }

}

export default PlaceShipComponent;