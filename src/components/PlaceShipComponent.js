import React, {Component} from 'react';

class PlaceShipComponent extends Component {
    render() {
        const spaces = [];
        for (let i = 0; i < this.props.shipSize; i++) {
            spaces.push(<div className='space ship-square' key={i}></div>);
        }
        return (
        <div>
            <div>{this.props.shipName}</div>
            <div draggable={true}>
                {spaces}
            </div>
        </div>);
    }

}

export default PlaceShipComponent;