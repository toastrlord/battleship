import React, { Component } from "react";
import BoardComponent from "./components/BoardComponent";
import PlaceShipComponent from "./components/PlaceShipComponent";
import FloatingShipComponent from './components/FloatingShipComponent';
import { DIRECTION_UP, DIRECTION_RIGHT, makePatrolBoat, makeSubmarine, makeDestroyer, makeBattleship, makeCarrier } from "./Ship";

const PLACING_SHIPS = 0;
const PLAYING = 1;
const GAME_OVER = 2;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameState: this.props.initialState,
      currentShip: null,
      direction: DIRECTION_UP
    }

    this.floatingShipRef = React.createRef();

    this.onGameStateChanged = this.onGameStateChanged.bind(this);
    this.rotate = this.rotate.bind(this);
    this.props.game.stateChangedCallback = this.onGameStateChanged; 
  }

  onGameStateChanged(newState) {
    this.setState({
      gameState: newState
    });
  }

  setCurrentShip(shipConstructor) {
    this.setState({
      currentShip: shipConstructor(this.state.direction)
    });
  }

  rotate() {
    if (this.state.direction === DIRECTION_UP) {
      if (this.state.currentShip) {
        const newShip = this.state.currentShip;
        newShip.facing = DIRECTION_RIGHT;
        this.setState({
          direction: DIRECTION_RIGHT,
          currentShip: newShip
        });
      }
      else {
        this.setState({
          direction: DIRECTION_RIGHT
        });
      }
    }
    else {
      if (this.state.currentShip) {
        const newShip = this.state.currentShip;
        newShip.facing = DIRECTION_UP;
        this.setState({
          direction: DIRECTION_UP,
          currentShip: newShip
        });
      }
      else {
        this.setState({
          direction: DIRECTION_UP
        });
      }
    }
  }

  render() {
    const {gameState} = this.state;
    switch(gameState) {
      case PLACING_SHIPS:
        return <div>
          {this.state.currentShip == null ? null : <FloatingShipComponent ship={this.state.currentShip} ref={this.floatingShipRef}/>}
          <button onClick={this.rotate}>Rotate </button>
          <PlaceShipComponent shipName='PT Boat' onClick={() => this.setCurrentShip(makePatrolBoat)}/>
          <PlaceShipComponent shipName='Submarine' onClick={() => this.setCurrentShip(makeSubmarine)}/>
          <PlaceShipComponent shipName='Destroyer' onClick={() => this.setCurrentShip(makeDestroyer)}/>
          <PlaceShipComponent shipName='Battleship' onClick={() => this.setCurrentShip(makeBattleship)}/>
          <PlaceShipComponent shipName='Carrier' onClick={() => this.setCurrentShip(makeCarrier)}/>
          <BoardComponent board={this.props.playerBoard} reveal={true} onMouseMove={(e) => {
            if (this.floatingShipRef.current != null) {
              const el = this.floatingShipRef.current;
              const offsetX = e.pageX;
              const offsetY = e.pageY;
              el.style = {
                left: `${offsetX} px`,
                top: `${offsetY} px`
              };
            }
          }} onClickCallback={(row, col) => this.props.playerBoard.tryPlaceShip(row, col, this.state.currentShip)}/>
        </div>;
      case PLAYING:
        return <div>
          <BoardComponent board={this.props.playerBoard} reveal={true}/>
          <BoardComponent onClickCallback={this.props.makePlayerMove} board={this.props.computerBoard} reveal={false}/>
        </div>
      case GAME_OVER:
        return <div>
          <BoardComponent board={this.props.playerBoard} reveal={true}/>
          <BoardComponent onClickCallback={this.props.makePlayerMove} board={this.props.computerBoard} reveal={true}/>
        </div>;
      default:
        return null;
    }
  }
}

export {App, PLAYING, PLACING_SHIPS, GAME_OVER};
