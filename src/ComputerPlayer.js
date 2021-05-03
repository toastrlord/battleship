import {WIDTH, HEIGHT} from './Gameboard';
import {HIT_STATE_EMPTY, HIT_STATE_HIT} from './Space';


class ComputerPlayer {
    constructor(opposingBoard) {
        this.opposingBoard = opposingBoard;
        this.nextMoves = [];
    }

    makeMove() {
        let coords;
        if (this.nextMoves.length === 0) {
            // search mode, take a random guess at the board
            coords = this.findRandomSpace();
            
        } else {
            // we know some spaces that may contain a ship, so pick one at random
            coords = this.nextMoves.splice(Math.random() * (this.nextMoves.length - 1), 1)[0];
        }
        this.opposingBoard.recieveAttack(coords.row, coords.col);
        if (this.opposingBoard.getSpace(coords.row, coords.col).hitState === HIT_STATE_HIT) {
            // if we hit, then search the squares adjacent, filtering out anything we've already tried or out-of-bounds coordinates
            const spacesToSearch = [[1,0], [0,-1], [0,1], [-1,0]].map(([rowOffset, colOffset]) => {
                return {row: coords.row + rowOffset, col: coords.col + colOffset};
            })
            .filter(({row, col}) => {
                return (row < HEIGHT && row >= 0 && col < WIDTH && col >= 0 
                    && this.opposingBoard.getSpace(row, col).hitState === HIT_STATE_EMPTY
                    && !this.nextMoves.includes({row, col}));
            });
            this.nextMoves = this.nextMoves.concat(spacesToSearch);
            return true;
        }
        return false;
    }

    findRandomSpace() {
        let row;
        let col;
        do { // keep trying until we find a space that hasn't been hit
            row = Math.round(Math.random() * (HEIGHT - 1));
            col = Math.round(Math.random() * (WIDTH - 1));
        } while (this.opposingBoard.getSpace(row, col).hitState !== HIT_STATE_EMPTY);
        return {row, col};
    }
}

export default ComputerPlayer;