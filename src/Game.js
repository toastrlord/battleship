import { Gameboard } from "./Gameboard";
import { PLAYING, PLACING_SHIPS, GAME_OVER } from './App';
import {WIDTH, HEIGHT} from './Gameboard';
import { makeBattleship, makePatrolBoat, makeSubmarine, makeDestroyer, makeCarrier } from "./Ship";
import {HIT_STATE_EMPTY, HIT_STATE_MISS} from './Space';
import ComputerPlayer from "./ComputerPlayer";

const allShips = [
    {constructor: makePatrolBoat, size: 2},
    {constructor: makeSubmarine, size: 3},
    {constructor: makeDestroyer, size: 3},
    {constructor: makeBattleship, size: 4},
    {constructor: makeCarrier, size: 5}
];

function placeShipsRandomly(board, shipsToPlace) {
    const ships = Object.assign(shipsToPlace);
    ships.forEach(({constructor: shipConstructor, size}) => {
        let placed = false;
        while (!placed) {
            const row = Math.round(Math.random() * (HEIGHT - 1));
            const col = Math.round(Math.random() * (WIDTH - 1));
            const direction = Math.round(Math.random());
            const result = board.checkShipPlacement(row, col, size, direction);
            if (result.validPlacement) {
                const spaces = result.shipSpaces;
                const withAdjacent = spaces.map(({row, col}) => {
                    const adjacentSpaces = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([rowOffset, colOffset]) => {
                        return {row: row + rowOffset, col: col + colOffset};
                    });
                    return adjacentSpaces;
                }).reduce((prev, current) => prev.concat(current))
                .filter(({row, col}) => {
                    const space = board.getSpace(row, col);
                    return space ? space.onHitCallback : false;
                });
                if (!withAdjacent.length) {
                    placed = board.tryPlaceShip(row, col, shipConstructor, direction);
                }
            }
        }
    });

    return board;
}

class Game {
    constructor() {
        const playerBoard = new Gameboard();
        const computerBoard = placeShipsRandomly(new Gameboard(), allShips);
        this.playerBoard = playerBoard;
        this.computerBoard = computerBoard;
        this.currentPlayer = this.human;
        this.gameState = PLACING_SHIPS;
        this.humanTurn = true;
        this.computerPlayer = new ComputerPlayer(playerBoard);
        this.makePlayerMove = this.makePlayerMove.bind(this);
        
        this.nextMove = this.nextMove.bind(this);
    }

    changeState(newState) {
        this.gameState = newState;
        this.stateChangedCallback(this);
    }

    startGame() {
        this.computerBoard = placeShipsRandomly(this.computerBoard, allShips);
        this.changeState(PLAYING);
    }

    reset() {
        this.playerBoard = new Gameboard();
        this.computerBoard = placeShipsRandomly(new Gameboard(), allShips);
        this.humanTurn = true;
        this.changeState(PLACING_SHIPS);
    }

    makePlayerMove(row, col) {
        if (this.humanTurn) {
            if (this.computerBoard.getSpace(row,col).hitState === HIT_STATE_EMPTY) {
                const result = this.computerBoard.recieveAttack(row, col);
                if (this.computerBoard.getSpace(row, col).hitState === HIT_STATE_MISS) {
                    this.humanTurn = false;
                }
                this.computerBoard = result;
            }
            this.nextMove();
        }
    }

    nextMove() {
        if (this.computerBoard.allShipsSunk()) {
            console.log("Player wins!");
            this.changeState(GAME_OVER);
            return;
        } 
        if (this.playerBoard.allShipsSunk()) {
            console.log("Computer wins!");
            this.changeState(GAME_OVER);
            return;
        }
        else {
            if (this.humanTurn) {
                // wait for player input
            }
            else {
                setTimeout(() => {
                    const result = this.computerPlayer.makeMove();
                    if (!result) {
                        this.humanTurn = true;
                    }
                    this.nextMove();
                }, 450);
            }
        }    
    }

    getComputerBoard() {
        return this.computerBoard;
    }

    getPlayerBoard() {
        return this.playerBoard;
    }
}

export {Game, placeShipsRandomly};