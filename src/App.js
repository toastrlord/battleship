import React, { Component } from 'react';
import Game from './Game';
import BoardComponent from './components/BoardComponent';
import PlaceShipComponent from './components/PlaceShipComponent';
import { DIRECTION_DOWN, DIRECTION_RIGHT, makePatrolBoat, makeSubmarine, makeDestroyer, makeBattleship, makeCarrier, SIZE_PATROL_BOAT, SIZE_SUBMARINE, SIZE_DESTROYER, SIZE_BATTLESHIP, SIZE_CARRIER, DIRECTION_UP } from './Ship';

const PLACING_SHIPS = 0;
const PLAYING = 1;
const GAME_OVER = 2;

class App extends Component {
  constructor(props) {
    super(props);
    this.onGameStateChanged = this.onGameStateChanged.bind(this);
    this.rotate = this.rotate.bind(this);
    this.shipPlaced = this.shipPlaced.bind(this);
    this.reset = this.reset.bind(this);

    const game = new Game();
    game.stateChangedCallback = this.onGameStateChanged;
    this.state = {
      game: game,
      gameState: game.gameState,
      currentShip: null,
      startIndex: null,
      shipSize: null,
      direction: DIRECTION_DOWN,
      ships: {
        'PT BOAT': { constructor: makePatrolBoat, placed: false},
        'DESTROYER': { constructor: makeDestroyer, placed: false},
        'SUBMARINE': { constructor: makeSubmarine, placed: false},
        'BATTLESHIP': { constructor: makeBattleship, placed: false},
        'CARRIER': { constructor: makeCarrier, placed: false},
      }
    }

    this.floatingShipRef = React.createRef();
  }

  onGameStateChanged(newGame) {
    const newState = newGame.gameState;
    if (newState === PLACING_SHIPS) {
      this.setState({
        game: newGame,
        gameState: newState,
        currentShip: null,
        ships: {
          'PT BOAT': { constructor: makePatrolBoat, placed: false},
          'DESTROYER': { constructor: makeDestroyer, placed: false},
          'SUBMARINE': { constructor: makeSubmarine, placed: false},
          'BATTLESHIP': { constructor: makeBattleship, placed: false},
          'CARRIER': { constructor: makeCarrier, placed: false},
        },
      })
    }
    else {
      this.setState({
        gameState: newState
      });
    }
  }

  setCurrentShip(ship, i, shipSize) {
    if (ship === '') {
      this.setState({
        currentShip: null,
        startIndex: null,
        shipSize: null
      })
    }
    else if (!this.state.ships[ship].placed) {
      this.setState({
        currentShip: ship,
        startIndex: i,
        shipSize: shipSize
      });
    }
  }

  rotate() {
    if (this.state.direction === DIRECTION_DOWN) {
        this.setState({
          direction: DIRECTION_RIGHT
      });
    }
    else {
        this.setState({
          direction: DIRECTION_DOWN
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

  reset() {
    const game = new Game();
    game.stateChangedCallback = this.onGameStateChanged;
    this.onGameStateChanged(game);
  }

  render() {
    const {gameState, ships, currentShip, game, direction, startIndex, shipSize} = this.state;
    const flexDirection = direction === DIRECTION_DOWN ? 'column' : 'row';
    const flexContainerDirection = flexDirection === 'column' ? 'row' : 'column';
    switch(gameState) {
      case PLACING_SHIPS:
        return <div className='vertical-display' 
        onDrag={(e) => {

        }}
        onDragStart={(e) => {
          this.floatingShipRef = e.target;
          e.target.style.opacity = 0.5;
        }} 
        onDragEnd={(e) => {
          e.target.style.opacity = '';
          this.floatingShipRef = null;
        }} 
        onDragOver={(e) => {
        }} 
        onDragLeave={(e) => {
          if (e.target.classList.contains('empty-square')) {
            //e.target.style.opacity = '';
          }
        }} 
        onDrop={(e) => {
          e.preventDefault();
          if (e.target.classList.contains('empty-square')) {
            // do drop logic here
          }
        }}>
          <div>
            <button onClick={this.rotate}>Rotate</button>
            <div style={{flexDirection: flexContainerDirection, display: 'flex'}}>
              <PlaceShipComponent shipName='PT Boat' dragStart={(i) => { this.setCurrentShip('PT BOAT', i, SIZE_PATROL_BOAT)}} shipSize={SIZE_PATROL_BOAT} disabled={ships['PT BOAT'].placed} flexDirection={flexDirection}/>
              <PlaceShipComponent shipName='Submarine' dragStart={(i) => { this.setCurrentShip('SUBMARINE', i, SIZE_SUBMARINE)}} shipSize={SIZE_SUBMARINE} disabled={ships['SUBMARINE'].placed} flexDirection={flexDirection}/>
              <PlaceShipComponent shipName='Destroyer' dragStart={(i) => { this.setCurrentShip('DESTROYER', i, SIZE_DESTROYER)}} shipSize={SIZE_DESTROYER} disabled={ships['DESTROYER'].placed} flexDirection={flexDirection}/>
              <PlaceShipComponent shipName='Battleship' dragStart={(i) => { this.setCurrentShip('BATTLESHIP', i, SIZE_BATTLESHIP)}} shipSize={SIZE_BATTLESHIP}  disabled={ships['BATTLESHIP'].placed} flexDirection={flexDirection}/>
              <PlaceShipComponent shipName='Carrier' dragStart={(i) => { this.setCurrentShip('CARRIER', i, SIZE_CARRIER)}} shipSize={SIZE_CARRIER} disabled={ships['CARRIER'].placed} flexDirection={flexDirection}/>
            </div>
          </div>
          <BoardComponent board={game.getPlayerBoard()} reveal={true} ship={currentShip} shipSize={shipSize} startIndex={startIndex} direction={direction}
            drop={(row, col) => {
              console.log(`drag ended on ${row}, ${col}`);
              if (currentShip) {
                const result = game.playerBoard.tryPlaceShip(row, col, ships[currentShip].constructor, direction);
                if (result) {
                  this.shipPlaced(currentShip);
                }
          }}}/> 
        </div>;
      case PLAYING:
        return <div className='main-display'>
          <BoardComponent title='Your Board' board={game.getPlayerBoard()} reveal={true}/>
          <BoardComponent title='Opponent Board' onClickCallback={game.makePlayerMove} board={game.computerBoard} reveal={false}/>
        </div>
      case GAME_OVER:
        return <div className='main-display'>
          <BoardComponent title='Your Board' board={game.getPlayerBoard()} reveal={true}/>
          <BoardComponent title='Opponent Board' board={game.computerBoard} reveal={true}/>
          <button onClick={() => this.reset()}>Play Again?</button>
        </div>;
      default:
        console.log(`no match for game state: ${gameState}`);
        return null; 
    }
  }
}

export {App, PLAYING, PLACING_SHIPS, GAME_OVER};
