import { DIRECTION_DOWN } from '../Ship';
import React from 'react';
import PlaceShipComponent from './PlaceShipComponent';

function PlacementComponent(props) {
    const shipFlexDirection = props.direction === DIRECTION_DOWN ? 'row' : 'column';
    const containerFlexDirection = props.direction === DIRECTION_DOWN ? 'column' : 'row';
    const alignItems = containerFlexDirection === 'row' ? 'flex-end' : 'flex-start';

    const names = Object.keys(props.ships).map(ship => {
        const currentShip = props.ships[ship];
        if (!currentShip.placed) {
            return <p>{ship}</p>
        } else {
            return null;
        }
    });
    const shipDisplays = Object.keys(props.ships).map((ship, index) => {
        // need to generate two columns (or rows)
        // one with ship name, aligned to flex-start
        // other with squares, aligned to flex-end
        const currentShip = props.ships[ship];
        if (!currentShip.placed) {
            return <PlaceShipComponent key={index} shipName={ship} dragStart={(i) => props.setCurrentShip(ship, i, currentShip.size)} dragEnd={props.dragEnd} shipSize={currentShip.size} flexDirection={containerFlexDirection}/>
        } else {
            return null;
        }
    });
    return (
        <div>
            <div className='row'>
                <button onClick={props.rotate}>Rotate</button>
                <button onClick={props.placeRandomly}>Place Ships Randomly</button>
            </div>
            <div className='ship-placement-container' style={{flexDirection: containerFlexDirection, alignItems: 'stretch'}}>
                <div style={{display: 'flex', flexDirection: shipFlexDirection, justifyContent: 'space-around'}}>{names}</div>
                <div style={{display: 'flex', flexDirection: shipFlexDirection, alignItems: alignItems, justifyContent: 'space-around'}}>{shipDisplays}</div>
            </div>
          </div>
    )
}


export default PlacementComponent;