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
     * Determine the size of the smallest enemy ship still sailing 
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
        this.hits = this.hits.filter(({row, col}) => {
            return this.opposingBoard.getSpace(row, col).hitState !== HIT_STATE_SUNK;
        });
        this.nextMoves = [];
    }

    makeMove() {
        let coords;
        if (this.hits.length) {
            this.destroy();
            do {
                const index = Math.round(Math.random() * (this.nextMoves.length - 1));
                coords = this.nextMoves.splice(index, 1)[0];
            } while (this.opposingBoard.getSpace(coords.row, coords.col).hitState !== HIT_STATE_EMPTY)
        } else {
            coords = this.search();
        }
        
        this.opposingBoard.recieveAttack(coords.row, coords.col);
        if (this.opposingBoard.getSpace(coords.row, coords.col).hitState === HIT_STATE_HIT) {
            this.hits.push(coords);
            return true;
        } else if (this.opposingBoard.getSpace(coords.row, coords.col).hitState === HIT_STATE_SUNK) {
            return true;
        }
        return false;
    }

    verticalLength(row, col) {
        let minRow = row;
        let currentSpace = this.opposingBoard.getSpace(minRow, col);
        while (minRow - 1 >= 0 && (currentSpace.hitState === HIT_STATE_EMPTY || currentSpace.hitState === HIT_STATE_HIT)) {
            minRow -= 1;
            currentSpace = this.opposingBoard.getSpace(minRow, col);
        }

        let maxRow = row;
        currentSpace = this.opposingBoard.getSpace(maxRow, col);
        while (maxRow + 1 < HEIGHT && (currentSpace.hitState === HIT_STATE_EMPTY || currentSpace.hitState === HIT_STATE_HIT)) {
            maxRow += 1;
            currentSpace = this.opposingBoard.getSpace(maxRow, col);
        }
        return (maxRow - minRow) + 1;
    }

    horizontalLength(row, col) {
        let minCol = col;
        let currentSpace = this.opposingBoard.getSpace(row, minCol);
        while (minCol - 1 >= 0 && (currentSpace.hitState === HIT_STATE_EMPTY || currentSpace.hitState === HIT_STATE_HIT)) {
            minCol -= 1;
            currentSpace = this.opposingBoard.getSpace(row, minCol);
        }

        let maxCol = col;
        currentSpace = this.opposingBoard.getSpace(row, maxCol);
        while (maxCol + 1 < WIDTH && (currentSpace.hitState === HIT_STATE_EMPTY || currentSpace.hitState === HIT_STATE_HIT)) {
            maxCol += 1;
            currentSpace = this.opposingBoard.getSpace(row, maxCol);
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
        return {row, col};
    }

    validateSpaces(coords) {
        return coords.filter(({row, col}) => {
            return row >= 0 && row < HEIGHT && col >= 0 && col < WIDTH
            && this.opposingBoard.getSpace(row, col).hitState === HIT_STATE_EMPTY;
        });
    }

    searchAlongColumn(coords) {
        let maxRow = coords.row;
        let minRow = coords.row;
        const col = coords.col;
        while (maxRow < HEIGHT && this.opposingBoard.getSpace(maxRow, col).hitState === HIT_STATE_HIT) {
            maxRow ++;
        }
        while (minRow >= 0 && this.opposingBoard.getSpace(minRow, col).hitState === HIT_STATE_HIT) {
            minRow --;
        }
        const spacesToSearch = this.validateSpaces([{row: maxRow , col}, {row: minRow, col}]);
        return spacesToSearch;
    }

    searchAlongRow(coords) {
        let maxCol = coords.col;
        let minCol = coords.col;
        const row = coords.row;
        while (maxCol < WIDTH && this.opposingBoard.getSpace(row, maxCol).hitState === HIT_STATE_HIT) {
            maxCol ++;
        }
        while (minCol >= 0 && this.opposingBoard.getSpace(row, minCol).hitState === HIT_STATE_HIT) {
            minCol --;
        }
        const spacesToSearch = this.validateSpaces([{row, col: maxCol}, {row, col: minCol}]);
        return spacesToSearch;
    }

    /**
     * Hone in and sink the ship we've hit
     */
    destroy() {
        if (this.hits.length === 1) {
            const coords = this.hits[0];
            const adjacentSpaces = [[1,0], [0,-1], [0,1], [-1,0]].map(([rowOffset, colOffset]) => {
                return {row: coords.row + rowOffset, col: coords.col + colOffset};
            });
            const spacesToInvestigate = adjacentSpaces.filter(({row, col}) => {
                return this.canShipFitHere(row, col);
                // seems to be an issue with this function, need to investigate
            });
            this.nextMoves = this.nextMoves.concat(spacesToInvestigate);
        } else {
            // determine which way we should be searching
            this.nextMoves = [];
            const row1 = this.hits[0].row;
            const col1 = this.hits[0].col;
            const row2 = this.hits[1].row;
            const col2 = this.hits[1].col;
            const rowDelta = Math.abs(row1 - row2);
            const colDelta = Math.abs(col1 - col2);
            if (rowDelta > 0) {
                // search up and down along this column
                this.nextMoves = this.nextMoves.concat(this.searchAlongColumn(this.hits[0]));
                if (this.nextMoves.length === 0) {
                    // we've searched along this column already and haven't sunk a ship yet
                    // try the rows instead
                    do {
                        const index = Math.round(Math.random() * (this.hits.length - 1));
                        this.nextMoves = this.nextMoves.concat(this.searchAlongRow(this.hits[index]));
                    } while (this.nextMoves.length === 0);
                }
            } else if (colDelta > 0) {
                // search left and right along this row 
                this.nextMoves = this.nextMoves.concat(this.searchAlongRow(this.hits[0]));
                if (this.nextMoves.length === 0) {
                    // we've searched along this row already and haven't sunk a ship yet
                    // try the columns instead
                    do {
                        const index = Math.round(Math.random() * (this.hits.length - 1));
                        this.nextMoves = this.nextMoves.concat(this.searchAlongColumn(this.hits[index]));
                    } while (this.nextMoves.length === 0);
                }
            }
        }
        if (this.nextMoves.length === 0) {
            console.log('destroy failed to produce new coordinates');
        }        
    }
}

export default ComputerPlayer;