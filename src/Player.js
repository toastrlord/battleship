import {WIDTH, HEIGHT} from './Gameboard';

class HumanPlayer {
    constructor(opposingBoard) {
        this.opposingBoard = opposingBoard;
    }

    makeMove() {
        
    }

    recieveCoords(row, col) {

    }
}

function makePlayer(opposingBoard, strategy) {
    return () => strategy(opposingBoard);
}

export default HumanPlayer;