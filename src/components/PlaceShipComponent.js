import React, {Component} from 'react';

class PlaceShipComponent extends Component {
    render() {
        return (
        <button disabled={this.props.disabled} onClick={this.props.onClick}>
            {this.props.shipName} 
        </button>);
    }

}

export default PlaceShipComponent;