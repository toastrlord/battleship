import React, { Component } from 'react';
import { Game, placeShipsRandomly } from './Game';
import BoardComponent from './components/BoardComponent';
import PlaceShipComponent from './components/PlaceShipComponent';
import { DIRECTION_DOWN, DIRECTION_RIGHT, makePatrolBoat, makeSubmarine, makeDestroyer, makeBattleship, makeCarrier, SIZE_PATROL_BOAT, SIZE_SUBMARINE, SIZE_DESTROYER, SIZE_BATTLESHIP, SIZE_CARRIER, DIRECTION_UP } from './Ship';
import PlacementComponent from './components/PlacementComponent';

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
    this.setCurrentShip = this.setCurrentShip.bind(this);
    this.playerBoardRef = new React.createRef();

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
        'PT Boat': { constructor: makePatrolBoat, placed: false, size: SIZE_PATROL_BOAT},
        'Destroyer': { constructor: makeDestroyer, placed: false, size: SIZE_DESTROYER},
        'Submarine': { constructor: makeSubmarine, placed: false, size: SIZE_SUBMARINE},
        'Battleship': { constructor: makeBattleship, placed: false, size: SIZE_BATTLESHIP},
        'Carrier': { constructor: makeCarrier, placed: false, size: SIZE_CARRIER},
      },
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
          'PT Boat': { constructor: makePatrolBoat, placed: false, size: SIZE_PATROL_BOAT},
          'Destroyer': { constructor: makeDestroyer, placed: false, size: SIZE_DESTROYER},
          'Submarine': { constructor: makeSubmarine, placed: false, size: SIZE_SUBMARINE},
          'Battleship': { constructor: makeBattleship, placed: false, size: SIZE_BATTLESHIP},
          'Carrier': { constructor: makeCarrier, placed: false, size: SIZE_CARRIER},
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
    switch(gameState) {
      case PLACING_SHIPS:
        return (<div className='vertical-display'>
          <p style={{fontWeight: 'bold', fontSize: '40px', marginTop: '12px'}}>Battleship</p>
          <BoardComponent ref={this.playerBoardRef} board={game.playerBoard} reveal={true} ship={currentShip} shipSize={shipSize} startIndex={startIndex} direction={direction}
            drop={(row, col) => {
              if (currentShip) {
                const result = game.playerBoard.tryPlaceShip(row, col, ships[currentShip].constructor, direction);
                if (result) {
                  this.shipPlaced(currentShip);
                }
          }}}/> 
          <p>Place all ships to start the game</p>
          <p style={{marginTop: '4px', marginBottom: '4px'}}>To place ships, click and drag them onto the board</p>
          <PlacementComponent ships={ships} direction={direction} rotate={this.rotate} dragEnd={this.playerBoardRef.current ? this.playerBoardRef.current.clearHighlighting : () => null}
        placeRandomly={
          () => {
            const shipList = Object.keys(ships).filter(shipName => !ships[shipName].placed).map(shipName => {
              return {constructor: ships[shipName].constructor, size: ships[shipName].size}
            });
            placeShipsRandomly(game.playerBoard, shipList);
              this.setState({
                ships: {},
                currentShip: null,
                gameState: PLAYING,
              });
          }} 
          setCurrentShip={this.setCurrentShip}/>
        </div>);
      case PLAYING:
        return (<div className='main-display'>
          <BoardComponent title='Your Board' board={game.playerBoard} reveal={true}/>
          <BoardComponent title='Opponent Board' onClickCallback={game.makePlayerMove} board={game.computerBoard} reveal={false}/>
        </div>)
      case GAME_OVER:
        return (<div>
          <div className='main-display'>
            <BoardComponent title='Your Board' board={game.playerBoard} reveal={true}/>
            <BoardComponent title='Opponent Board' board={game.computerBoard} reveal={true}/>
          </div>
          <div className='row' style={{justifyContent: 'center'}}>
            <button onClick={this.reset}>Play Again?</button>
          </div>
        </div>);
      default:
        console.log(`no match for game state: ${gameState}`);
        return null; 
    }
  }
}

export {App, PLAYING, PLACING_SHIPS, GAME_OVER};
