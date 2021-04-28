import {DIRECTION_DOWN, DIRECTION_UP, DIRECTION_LEFT, DIRECTION_RIGHT} from './Ship';
import {Space} from './Space';

const WIDTH = 10;
const HEIGHT = WIDTH;

class Gameboard {
    constructor() {
        this.spaces = [];
        this.ships = [];
        for (let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {
                this.spaces.push(new Space());
            }
        }
    }

    tryPlaceShip(row, col, shipConstructor, direction) {
        const ship = shipConstructor(() => false);
        // return true if ship successfully placed, false otherwise
        const size = ship.size;
        let shipSpaces = [];
        let startRow = row;
        let startCol = col;
        let rowDelta = 0;
        let colDelta = 0;
        // if we're near an edge, adjust so we're in bounds
        switch(direction) {
            case DIRECTION_DOWN:
                rowDelta = 1;
                if (startRow + rowDelta * (size - 1) >= HEIGHT) {
                    startRow = HEIGHT - (size);
                }
                // go from startRow down to startRow + (size - 1)
                break;
            case DIRECTION_LEFT:
                colDelta = -1;
                if (startCol + colDelta * (size - 1) < 0) {
                    startCol = WIDTH + (size - 1);
                }
                // go from startCol up to startCol - (size - 1)
                break;
            case DIRECTION_RIGHT:
                colDelta = 1;
                if (startCol + colDelta * (size - 1) >= WIDTH) {
                    startCol = WIDTH - (size);
                }
                // go from startCol up to startCol + (size - 1)
                break;
            default:
                rowDelta = -1;
                if (startRow + rowDelta * (size - 1) < 0) {
                    startRow = (size - 1);
                    console.log(`New start row: ${startRow}`);
                }
                // go from startRow up to startRow - (size - 1)
        }

        for (let i = 0; i < size; i++) {
            const row = startRow + (i * rowDelta);
            const col = startCol + (i * colDelta);
            shipSpaces = shipSpaces.concat({row, col});
        }

        let validPlacement = true;
        shipSpaces.forEach(({row, col}) => {
            const currentSpace = this.getSpace(row, col);
            if (currentSpace.onHitCallback) {
                validPlacement = false;
                return;
            }
        });

        if (validPlacement) {
            this.addShip(ship, shipSpaces);
            if (this.updateCallback) {
                this.updateCallback();
            }
        }
        return validPlacement;
    }

    addShip(ship, shipSpaces) {
        shipSpaces.forEach(({row, col}, index) => {
            const currentSpace = this.getSpace(row, col);
            if (currentSpace.onHitCallback) {
                throw new Error(`Tried to place ships on top of each other! Row: ${row}, Col: ${col}`);
            }
            currentSpace.addHitListener(() => {
                ship.hit(index);
            });
        });
        this.ships.push(ship);
    }

    getSpace(row, col) {
        return this.spaces[row * WIDTH + col];
    }

    recieveAttack(row, col) {
        const space = this.getSpace(row, col);
        space.onHit();
        this.updateCallback();
        return (space.onHitCallback !== undefined);
    }

    allShipsSunk() {
        return this.ships.reduce((prev, ship) => prev && ship.isSunk(), true);
    }
}

export {WIDTH, HEIGHT, Gameboard};