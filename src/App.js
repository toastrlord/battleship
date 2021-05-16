import React, { Component } from 'react';
import Game from './Game';
import BoardComponent from './components/BoardComponent';
import PlaceShipComponent from './components/PlaceShipComponent';
import { DIRECTION_UP, DIRECTION_RIGHT, makePatrolBoat, makeSubmarine, makeDestroyer, makeBattleship, makeCarrier, SIZE_PATROL_BOAT, SIZE_SUBMARINE, SIZE_DESTROYER, SIZE_BATTLESHIP, SIZE_CARRIER } from './Ship';

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

  setCurrentShip(ship) {
    console.log(`Set current ship ${ship}`);
    if (ship === '') {
      this.setState({
        currentShip: null,
      })
    }
    else if (!this.state.ships[ship].placed) {
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

  reset() {
    const game = new Game();
    game.stateChangedCallback = this.onGameStateChanged;
    this.onGameStateChanged(game);
  }

  render() {
    const {gameState, ships, currentShip, game} = this.state;
    switch(gameState) {
      case PLACING_SHIPS:
        return <div className='vertical-display' 
        onDrag={(e) => {

        }}
        onDragStart={(e) => {
          console.log('drag start!');
          this.floatingShipRef = e.target;
          e.target.style.opacity = 0.5;
        }} 
        onDragEnd={(e) => {
          e.target.style.opacity = '';
          this.floatingShipRef = null;
        }} 
        onDragOver={(e) => {
        }} 
        onDragEnter={(e) => {
          e.preventDefault();
          if (e.target.classList.contains('empty-square')) {
            e.target.style.opacity = 0.5;
          }
        }} 
        onDragLeave={(e) => {
          if (e.target.classList.contains('empty-square')) {
            e.target.style.opacity = '';
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
            <PlaceShipComponent shipName='PT Boat' shipSize={SIZE_PATROL_BOAT} disabled={ships['PT BOAT'].placed}/>
            <PlaceShipComponent shipName='Submarine' shipSize={SIZE_SUBMARINE} disabled={ships['SUBMARINE'].placed}/>
            <PlaceShipComponent shipName='Destroyer' shipSize={SIZE_DESTROYER} disabled={ships['DESTROYER'].placed}/>
            <PlaceShipComponent shipName='Battleship' shipSize={SIZE_BATTLESHIP}  disabled={ships['BATTLESHIP'].placed}/>
            <PlaceShipComponent shipName='Carrier' shipSize={SIZE_CARRIER} disabled={ships['CARRIER'].placed}/>
          </div>
          <BoardComponent board={game.getPlayerBoard()} reveal={true} onDragEnd={(row, col) => {
            console.log('drag ended');
            if (currentShip) {
              const result = game.playerBoard.tryPlaceShip(row, col, ships[currentShip].constructor, this.state.direction);
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
