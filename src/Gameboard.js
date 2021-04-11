import {direction} from './Ship';
import Space from './Space';

const WIDTH = 10;
const HEIGHT = WIDTH;

class Gameboard {
    constructor() {
        this.spaces = [];
        for (let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {
                this.spaces.push(new Space());
            }
        }
    }

    addShip(ship, startRow, startCol) {
        const facing = ship.facing;
        const size = ship.size;
        const shipSpaces = [];
        let rowDelta = 0;
        let colDelta = 0;
        switch(facing) {
            case direction.DOWN:
                rowDelta = 1;
                // go from startRow down to startRow + (size - 1)
                break;
            case direction.LEFT:
                colDelta = -1;
                // go from startCol up to startCol - (size - 1)
                break;
            case direction.RIGHT:
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
            shipSpaces.push({row, col});
        }
        
        shipSpaces.forEach(({row, col}, index) => {
            const currentSpace = this.getSpace(row, col);
            currentSpace.addHitListener(() => {
                ship.hit(index);
            });
        });
    }

    getSpace(row, col) {
        return this.spaces[row * WIDTH + col];
    }

    recieveAttack(row, col) {
        const space = this.getSpace(row, col);
        space.onHit();
    }
}

export {WIDTH, HEIGHT, Gameboard};