import { Gameboard } from "./Gameboard";
import App from './App';
import {WIDTH, HEIGHT} from './Gameboard';
import { DIRECTION_RIGHT, makeBattleship } from "./Ship";
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

class Game {
    constructor() {
        const playerBoard = new Gameboard();
        playerBoard.addShip(makeBattleship(DIRECTION_RIGHT), 0, 0);
        const computerBoard = new Gameboard();
        computerBoard.addShip(makeBattleship(DIRECTION_RIGHT), 0, 0);
        this.playerBoard = playerBoard;
        this.computerBoard = computerBoard;
        this.currentPlayer = this.human;
        this.gameOver = false;
        this.humanTurn = true;
        this.makePlayerMove = this.makePlayerMove.bind(this);
        this.appComponent = <App makePlayerMove={this.makePlayerMove} playerBoard={this.playerBoard} computerBoard={this.computerBoard}/>;
    }

    makePlayerMove(row, col) {
        console.log("Player moving");
        if (this.humanTurn) {
            if (this.computerBoard.getSpace(row,col).hitState === HIT_STATE_EMPTY) {
                this.computerBoard.recieveAttack(row, col);
                if (this.computerBoard.getSpace(row, col).hitState === HIT_STATE_MISS) {
                    this.humanTurn = false;
                }
            }
            this.nextMove();
        }
    }

    makeComputerMove() {
        console.log("Computer moving");
        const coords = findRandomSpace(this.playerBoard);
        const hit = this.playerBoard.recieveAttack(coords.row, coords.col);
        if (!hit) {
            this.humanTurn = true;
        }
        this.nextMove();
    }

    nextMove() {
    // TODO: place ships
        if (this.computerBoard.allShipsSunk()) {
            console.log("Player wins!");
            return;
        } 
        if (this.playerBoard.allShipsSunk()) {
            console.log("Computer wins!");
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