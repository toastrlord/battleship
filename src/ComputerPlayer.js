import {WIDTH, HEIGHT} from './Gameboard';
import {HIT_STATE_EMPTY, HIT_STATE_HIT, HIT_STATE_SUNK} from './Space';


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
            this.minShipSize = Object.keys(this.shipsRemaining).map(shipName => this.shipsRemaining[shipName]).reduce((min, current) => current < min ? current : min);
        }
    }

    onShipSunk(shipName) {
        const shipSize = this.shipsRemaining[shipName];
        delete this.shipsRemaining[shipName];
        if (shipSize === this.minShipSize) {
            this.determineMinShipSize();
        }
        console.log('clearing hits and nextMoves');
        this.hits = this.hits.filter(({row, col}) => {
            return this.opposingBoard.getSpace(row, col).hitState === HIT_STATE_HIT;
        });
        console.log('hits: ');
        console.log(this.hits);
        this.nextMoves = [];
    }

    makeMove() {
        let coords;
        console.log(this.hits);
        if (this.hits.length) {
            console.log('destroying');
            this.destroy();
            do {
                const index = Math.round(Math.random() * (this.nextMoves.length - 1));
                coords = this.nextMoves.splice(index, 1)[0];
            } while (this.opposingBoard.getSpace(coords.row, coords.col).hitState !== HIT_STATE_EMPTY)
        } else {
            console.log('searching');
            coords = this.search();
        }
        
        console.log(`firing at ${coords.row}, ${coords.col}`);
        this.opposingBoard.recieveAttack(coords.row, coords.col);
        if (this.opposingBoard.getSpace(coords.row, coords.col).hitState === HIT_STATE_HIT) {
            console.log(`adding hit (${coords.row}, ${coords.col})`);
            this.hits.push(coords);
            return true;
        } else if (this.opposingBoard.getSpace(coords.row, coords.col).hitState === HIT_STATE_SUNK) {
            console.log(`sunk ship with shot at (${coords.row}, ${coords.col})`);
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
        if (row < 0 || row >= HEIGHT || col < 0 || col >= WIDTH) {
            return false;
        }
        const canFitVertically = this.verticalLength(row, col) >= this.minShipSize;
        const canFitHorizontally =  this.horizontalLength(row, col) >= this.minShipSize;
        return (canFitVertically|| canFitHorizontally);
    }

    /**
     * Search for a ship to destroy, filtering out spaces we know cannot contain a ship based on our
     * knowledge of the ships we've already sunk 
     * @returns 
     */
    search() {
        let row;
        let col;
        do { // keep trying until we find a space that hasn't been hit and could possibly contain a min length ship
            row = Math.round(Math.random() * (HEIGHT - 1));
            col = Math.round(Math.random() * (WIDTH - 1));
        } while (this.opposingBoard.getSpace(row, col).hitState !== HIT_STATE_EMPTY && !this.canShipFitHere(row, col));
        console.log(`searching for (${row}, ${col})`);
        console.log('nextMove should be');
        console.log([{row, col}]);
        //FIXME: something odd happening here
        return {row, col};
    }

    /**
     * Hone in and sink the ship we've hit
     */
    destroy() {
        if (this.hits.length === 1) {
            console.log('1 hit, find adjacent spaces');
            const coords = this.hits[0];
            const adjacentSpaces = [[1,0], [0,-1], [0,1], [-1,0]].map(([rowOffset, colOffset]) => {
                return {row: coords.row + rowOffset, col: coords.col + colOffset};
            });
            const spacesToInvestigate = adjacentSpaces.filter(({row, col}) => {
                return this.canShipFitHere(row, col);
            });
            console.log('spaces to investigate');
            console.log(spacesToInvestigate);
            console.log('destroy modifying next moves');
            this.nextMoves = this.nextMoves.concat(spacesToInvestigate);
        } else {
            // determine which way we should be searching
            console.log('2+ hits registered');
            console.log(this.hits);
            console.log('destroy modifying next moves');
            this.nextMoves = [];
            // TODO: needs to be a touch more complicated
            // take a look and see how many rows / columns we should consider searching along
            // (only applies if we have multiple ships adjacent to each other)
            const row1 = this.hits[0].row;
            const col1 = this.hits[0].col;
            const row2 = this.hits[1].row;
            const col2 = this.hits[1].col;
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
                const spacesToSearch = [{row: maxRow + 1, col: col1}, {row: minRow - 1, col: col1}].filter(({row, col}) => {
                    return col >= 0 && col < WIDTH && 
                    row >= 0 && row < HEIGHT && this.opposingBoard.getSpace(row, col).hitState !== HIT_STATE_EMPTY;
                });
                this.nextMoves = this.nextMoves.concat(spacesToSearch);
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
                const spacesToSearch = [{row: row1, col: maxCol + 1}, {row: row1, col: minCol - 1}].filter(({row, col}) => {
                    return col >= 0 && col < WIDTH && 
                    row >= 0 && row < HEIGHT && this.opposingBoard.getSpace(row, col).hitState !== HIT_STATE_EMPTY;
                });
                console.log('spaces to search (col)');
                console.log(spacesToSearch);
                console.log('destroy modifying next moves');
                this.nextMoves = this.nextMoves.concat(spacesToSearch);
            }
            // in the case that there are multiple adjacent ships, and shooting 
            // in one direction has not sunk anything, look at adjacent squares
            if (this.nextMoves.length === 0) {
                this.nextMoves = this.hits.map(({row, col}) => {
                    return [[1,0], [0,-1], [0,1], [-1,0]].map(([rowOffset, colOffset]) => {
                        return {row: row + rowOffset, col: col + colOffset};
                    });
                }).reduce((prev, next) => prev.concat(next));
            console.log('looking for extra spaces');
            console.log(this.nextMoves);
            }
        }        
    }
}

export default ComputerPlayer;