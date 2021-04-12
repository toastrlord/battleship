import { Gameboard } from "./Gameboard";
import { makePlayer, randomAIStrategy } from "./Player";

class Game {
    constructor() {
        const playerBoard = new Gameboard();
        const computerBoard = new Gameboard();
        this.playerBoard = playerBoard;
        this.computerBoard = computerBoard;
        this.player = makePlayer(computerBoard, () => null); // TODO: implement player strategy
        this.computer = makePlayer(playerBoard, randomAIStrategy);
    }

    play() {
    // TODO: place ships

    /**
     * while (!gameover)
     *  player1.doTurn()
     *  player2.doTurn()
     * 
     * display winner & play again button
     */
    }
}

export default Game;