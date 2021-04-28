import React, { Component } from "react";
import BoardComponent from "./components/BoardComponent";
import PlaceShipComponent from "./components/PlaceShipComponent";
import { placeShipsRandomly } from "./Game";
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
      direction: DIRECTION_UP,
      ships: {
        'PT BOAT': { constructor: makePatrolBoat, placed: false},
        'DESTROYER': { constructor: makeDestroyer, placed: false},
        'SUBMARINE': { constructor: makeSubmarine, placed: false},
        'BATTLESHIP': { constructor: makeBattleship, placed: false},
        'CARRIER': { constructor: makeCarrier, placed: false},
      }
    }

    this.floatingShipRef = React.createRef();

    this.onGameStateChanged = this.onGameStateChanged.bind(this);
    this.rotate = this.rotate.bind(this);
    this.shipPlaced = this.shipPlaced.bind(this);
    this.props.game.stateChangedCallback = this.onGameStateChanged; 
  }

  onGameStateChanged(newState) {
    this.setState({
      gameState: newState
    });
  }

  setCurrentShip(ship) {
    if (!this.state.ships[ship].placed) {
      this.setState({
        currentShip: ship,
      });
    }
  }

  rotate() {
    if (this.state.direction === DIRECTION_UP) {
        this.setState({
          direction: DIRECTION_RIGHT
      });
    }
    else {
        this.setState({
          direction: DIRECTION_UP
        });
    }
  }

  shipPlaced(ship) {
    const newShips = Object.assign(this.state.ships);
    newShips[ship] = { placed: true };
    const allShipsPlaced = Object.keys(this.state.ships).reduce((prev, shipKey) => {
      return prev && newShips[shipKey].placed;
    }, true); 
    if (allShipsPlaced) {
      this.setState({
        ships: newShips,
        currentShip: null,
        gameState: PLAYING,
      });
    }
    else {
      this.setState({
        ships: newShips,
        currentShip: null
      });
    }
  }

  render() {
    const {gameState} = this.state;
    switch(gameState) {
      case PLACING_SHIPS:
        return <div className='vertical-display'>
          <div>
            <button onClick={this.rotate}>Rotate</button>
            <PlaceShipComponent shipName='PT Boat' onClick={() => this.setCurrentShip('PT BOAT')} disabled={this.state.ships['PT BOAT'].placed}/>
            <PlaceShipComponent shipName='Submarine' onClick={() => this.setCurrentShip('SUBMARINE')} disabled={this.state.ships['SUBMARINE'].placed}/>
            <PlaceShipComponent shipName='Destroyer' onClick={() => this.setCurrentShip('DESTROYER')} disabled={this.state.ships['DESTROYER'].placed}/>
            <PlaceShipComponent shipName='Battleship' onClick={() => this.setCurrentShip('BATTLESHIP')} disabled={this.state.ships['BATTLESHIP'].placed}/>
            <PlaceShipComponent shipName='Carrier' onClick={() => this.setCurrentShip('CARRIER')} disabled={this.state.ships['CARRIER'].placed}/>
          </div>
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
          }} onClickCallback={(row, col) => {
            if (this.state.currentShip) {
              const result = this.props.playerBoard.tryPlaceShip(row, col, this.state.ships[this.state.currentShip].constructor, this.state.direction);
              if (result) {
                this.shipPlaced(this.state.currentShip);
              }
          }}}/>
        </div>;
      case PLAYING:
        return <div className='main-display'>
          <BoardComponent title='Your Board' board={this.props.playerBoard} reveal={true}/>
          <BoardComponent title='Opponent Board' onClickCallback={this.props.makePlayerMove} board={this.props.computerBoard} reveal={false}/>
        </div>
      case GAME_OVER:
        return <div className='main-display'>
          <BoardComponent title='Your Board' board={this.props.playerBoard} reveal={true}/>
          <BoardComponent title='Opponent Board' onClickCallback={this.props.makePlayerMove} board={this.props.computerBoard} reveal={true}/>
        </div>;
      default:
        return null;
    }
  }
}

export {App, PLAYING, PLACING_SHIPS, GAME_OVER};
