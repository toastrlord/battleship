import {WIDTH, HEIGHT} from './Gameboard';
import {HIT_STATE_EMPTY, HIT_STATE_HIT} from './Space';


class ComputerPlayer {
    constructor(opposingBoard) {
        this.opposingBoard = opposingBoard;
        this.nextMoves = [];
        this.hits = [];
        this.shipsRemaining = {
            'PT BOAT': 2,
            'SUBMARINE': 3,
            'DESTROYER': 3,
            'BATTLESHIP': 4,
            'CARRIER': 5
        }
        this.determineMinShipSize();
        this.onShipSunk = this.onShipSunk.bind(this);
        opposingBoard.addShipSunkListener(this.onShipSunk);
    }

    /**
     * Determine the size of the smallest ship still sailing 
     */
    determineMinShipSize() {
        if (Object.keys(this.shipsRemaining).length) {
            console.log('calculating');
            this.minShipSize = Object.keys(this.shipsRemaining).map(shipName => this.shipsRemaining[shipName]).reduce((min, current) => current < min ? current : min);
        }
    }

    onShipSunk(shipName) {
        const shipSize = this.shipsRemaining[shipName];
        delete this.shipsRemaining[shipName];
        if (shipSize === this.minShipSize) {
            this.determineMinShipSize();
        }
    }

    makeMove() {
        console.log('computer moving');
        let coords;
        if (this.nextMoves.length === 0) {
            // search mode, take a random guess at the board
            coords = this.search();
            
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

    verticalLength(row, col) {
        let minRow = row;
        while (minRow - 1 >= 0 && this.opposingBoard.getSpace(minRow - 1, col).hitState === HIT_STATE_EMPTY) {
            minRow -= 1;
        }

        let maxRow = row;
        while (maxRow + 1 < HEIGHT && this.opposingBoard.getSpace(maxRow + 1, col).hitState === HIT_STATE_EMPTY) {
            maxRow += 1;
        }
        return (maxRow - minRow) + 1;
    }

    horizontalLength(row, col) {
        let minCol = col;
        while (minCol - 1 >= 0 && this.opposingBoard.getSpace(row, minCol - 1).hitState === HIT_STATE_EMPTY) {
            minCol -= 1;
        }

        let maxCol = col;
        while (maxCol + 1 < WIDTH && this.opposingBoard.getSpace(row, maxCol + 1).hitState === HIT_STATE_EMPTY) {
            maxCol += 1;
        }
        return (maxCol - minCol) + 1;
    }

    /**
     * Given a set of coordinates, can the minimum sized ship fit here? (i.e. is this space worth investigating?)
     * @param {Number} row 
     * @param {Number} col 
     */
    canShipFitHere(row, col) {
        const canFitVertically = this.verticalLength(row, col) >= this.minShipSize;
        const canFitHorizontally =  this.horizontalLength(row, col) >= this.minShipSize;
        return (canFitVertically|| canFitHorizontally);
    }

    /**
     * 
     * @returns 
     */
    search() {
        let row;
        let col;
        do { // keep trying until we find a space that hasn't been hit and could possibly contain a min length ship
            row = Math.round(Math.random() * (HEIGHT - 1));
            col = Math.round(Math.random() * (WIDTH - 1));
        } while (this.opposingBoard.getSpace(row, col).hitState !== HIT_STATE_EMPTY && !this.canShipFitHere(row, col));
        return {row, col};
    }

    /**
     * Hone in and sink the ship we've hit
     */
    destroy() {
        if (this.nextMoves.length !== 0) {
            if (this.hits.length === 1) {
                const coords = this.hits[0];
                const adjacentSpaces = [[1,0], [0,-1], [0,1], [-1,0]].map(([rowOffset, colOffset]) => {
                    return {row: coords.row + rowOffset, col: coords.col + colOffset};
                });
                const spacesToInvestigate = adjacentSpaces.filter(({row, col}) => {
                    return this.canShipFitHere(row, col);
                });
                this.nextMoves.concat(spacesToInvestigate);
            } else {
                // determine which way we should be searching
                // FIXME: doesn't account for if we have hits for multiple ships
                const {row1, col1} = this.hits[0];
                const {row2, col2} = this.hits[1];
                const rowDelta = Math.abs(row1 - row2);
                const colDelta = Math.abs(col1 - col2);
                if (rowDelta > 0) {
                    // search along this row
                    let maxRow = this.hits[0].row;
                    let minRow = this.hits[0].row;
                    this.hits.forEach(({row, _}) => {
                        if (row < minRow) {
                            minRow = row;
                        }
                        if (row > maxRow) {
                            maxRow = row;
                        }
                    });
                    const spacesToSearch = [{row: maxRow + 1, col1}, {row: minRow - 1, col1}].filter(({row, col}) => {
                        return row >= 0 && row < HEIGHT;
                    });
                    this.nextMoves.push(spacesToSearch);
                } else if (colDelta > 0) {
                    // search along this column
                    let maxCol = this.hits[0].col;
                    let minCol = this.hits[0].col;
                    this.hits.forEach(({_, col}) => {
                        if (col < minCol) {
                            minCol = col;
                        }
                        if (col > maxCol) {
                            maxCol = col;
                        }
                    });
                }
            }
        }
        else {
        }
    }
}

export default ComputerPlayer;