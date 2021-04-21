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

    addShip(ship, startRow, startCol) {
        const facing = ship.facing;
        const size = ship.size;
        let shipSpaces = [];
        let rowDelta = 0;
        let colDelta = 0;
        switch(facing) {
            case DIRECTION_DOWN:
                rowDelta = 1;
                // go from startRow down to startRow + (size - 1)
                break;
            case DIRECTION_LEFT:
                colDelta = -1;
                // go from startCol up to startCol - (size - 1)
                break;
            case DIRECTION_RIGHT:
                colDelta = 1;
                // go from startCol up to startCol + (size - 1)
                break;
            default:
                rowDelta = -1;
                // go from startRow up to startRow - (size - 1)
        }

        for (let i = 0; i < size; i++) {
            const row = startRow + (i * rowDelta);
            const col = startCol + (i * colDelta);
            if (col < 0 || col >= WIDTH || row < 0 || row >= HEIGHT) {
                throw new Error(`Tried to place ship out of bounds! Row: ${row}, Col: ${col}`);
            }
            shipSpaces = shipSpaces.concat({row, col});
        }
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
        let allSunk = true;
        for (let i = 0; i < this.ships.length; i++) {
            allSunk = allSunk && this.ships[i].isSunk();
        }
        return allSunk;
        /*
        return this.ships.reduce((prev, ship) => {
            console.log(`${ship} Is sunk? ${ship.isSunk()}`);
            return prev && ship.isSunk();
        });*/
    }
}

export {WIDTH, HEIGHT, Gameboard};