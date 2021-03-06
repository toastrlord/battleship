import React, {Component} from 'react';

class PlaceShipComponent extends Component {
    render() {
        const spaces = [];
        for (let i = 0; i < this.props.shipSize; i++) {
            spaces.push(<div className='space ship-square' key={i} draggable={true} onDragStart={(e) => {
                this.props.dragStart(i);}}
                onDragEnd={(e) => this.props.dragEnd()}></div>);
        }
        return (
        <div style={{display:'flex', justifyContent: 'center', flexDirection: this.props.flexDirection, alignItems: 'center'}} className='ship-placement'>
            <div style={{flexDirection: this.props.flexDirection, display: 'flex', alignItems: 'flex-end'}}>
                {spaces}
            </div>
        </div>);
    }

}

export default PlaceShipComponent;