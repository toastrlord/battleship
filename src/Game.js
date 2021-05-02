import { Gameboard } from "./Gameboard";
import { App, PLAYING, PLACING_SHIPS, GAME_OVER } from './App';
import {WIDTH, HEIGHT} from './Gameboard';
import { makeBattleship, makePatrolBoat, makeSubmarine, makeDestroyer, makeCarrier } from "./Ship";
import {HIT_STATE_EMPTY, HIT_STATE_MISS} from './Space';

function findRandomSpace(opposingBoard) {
    let row;
    let col;
    do { // keep trying until we find a space that hasn't been hit
        row = Math.round(Math.random() * (HEIGHT - 1));
        col = Math.round(Math.random() * (WIDTH - 1));
    } while (opposingBoard.getSpace(row, col).hitState !== HIT_STATE_EMPTY);
    return {row, col};
}

function placeShipsRandomly(board) {
    let ships = [makePatrolBoat, makeSubmarine, makeDestroyer, makeBattleship, makeCarrier];
    ships.forEach(shipConstructor => {
        let placed = false;
        while (!placed) {
            const row = Math.round(Math.random() * (HEIGHT - 1));
            const col = Math.round(Math.random() * (WIDTH - 1));
            const direction = Math.round(Math.random());
            placed = board.tryPlaceShip(row, col, shipConstructor, direction);
        }
    });

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
        this.makePlayerMove = this.makePlayerMove.bind(this);
        
        this.nextMove = this.nextMove.bind(this);
    }

    changeState(newState) {
        this.stateChangedCallback(newState);
        this.gameState = newState;
    }

    startGame() {
        this.computerBoard = placeShipsRandomly(this.computerBoard);
        this.changeState(PLAYING);
    }

    reset() {
        this.playerBoard = new Gameboard();
        this.computerBoard = placeShipsRandomly(new Gameboard());
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

    makeComputerMove() {
        const coords = findRandomSpace(this.playerBoard);
        const result = this.playerBoard.recieveAttack(coords.row, coords.col);
        if (this.computerplayerBoard.getSpace(coords.row, coords.col).hitState === HIT_STATE_MISS) {
            this.humanTurn = true;
        }
        this.playerBoard = result;
        this.nextMove();
    }

    getPlayerBoard() {
        return this.playerBoard;
    }

    getComputerBoard() {
        return this.computerBoard;
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
                this.makeComputerMove();
            }
        }    
    }
}

export default Game;