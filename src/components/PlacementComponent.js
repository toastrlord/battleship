import { DIRECTION_DOWN } from "../Ship";
import PlaceShipComponent from "./PlaceShipComponent";

function PlacementComponent(props) {
    const shipFlexDirection = props.direction === DIRECTION_DOWN ? 'column' : 'row';
    const containerFlexDirection = props.direction === DIRECTION_DOWN ? 'row' : 'column';
    const alignItems = containerFlexDirection === 'row' ? 'flex-start' : 'flex-end';

    return (
        <div>
            <button onClick={props.rotate}>Rotate</button>
            <div className='ship-placement-container' style={{flexDirection: containerFlexDirection, alignItems: alignItems}}>
            {
                Object.keys(props.ships).map((ship, index) => {
                    const currentShip = props.ships[ship];
                    if (!currentShip.placed) {
                        return <PlaceShipComponent key={index} shipName={ship} dragStart={(i) => props.setCurrentShip(ship, i, currentShip.size)} shipSize={currentShip.size} flexDirection={shipFlexDirection}/>
                    } else {
                        return null;
                    }
                })
            }
            </div>
          </div>
    )
}


export default PlacementComponent;