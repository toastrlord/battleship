import { Gameboard } from "./Gameboard";
import { PLAYING, PLACING_SHIPS, GAME_OVER } from './App';
import {WIDTH, HEIGHT} from './Gameboard';
import { makeBattleship, makePatrolBoat, makeSubmarine, makeDestroyer, makeCarrier } from "./Ship";
import {HIT_STATE_EMPTY, HIT_STATE_MISS} from './Space';
import ComputerPlayer from "./ComputerPlayer";

function placeShipsRandomly(board) {
    console.log('randomly placing ships');
    let ships = [makePatrolBoat, makeSubmarine, makeDestroyer, makeBattleship, makeCarrier];
    ships.forEach(shipConstructor => {
        let placed = false;
        while (!placed) {
            const row = Math.round(Math.random() * (HEIGHT - 1));
            const col = Math.round(Math.random() * (WIDTH - 1));
            const direction = Math.round(Math.random());
            const adjacentSquares = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([rowOffset, colOffset]) => {
                return {row: row + rowOffset, col: col + colOffset}
            }).filter(({row, col}) => {
                return row >= 0 && row < HEIGHT && col >= 0 && col < WIDTH;
            });
            /*const isShipAdjacent = adjacentSquares.map(({row, col}) => {
                return board.getSpace(row, col).onHitListener;
            });*/
            //if (!isShipAdjacent) {
                placed = board.tryPlaceShip(row, col, shipConstructor, direction);
            //}
        }
    });
    console.log('done placing ships');
    return board;
}

class Game {
    constructor() {
        const playerBoard = new Gameboard();
        const computerBoard = placeShipsRandomly(new Gameboard());
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
        this.computerBoard = placeShipsRandomly(this.computerBoard);
        this.changeState(PLAYING);
    }

    reset() {
        this.playerBoard = new Gameboard();
        this.computerBoard = placeShipsRandomly(new Gameboard());
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
                const result = this.computerPlayer.makeMove();
                if (!result) {
                    this.humanTurn = true;
                }
                this.nextMove();
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

export default Game;