import Space from './space';

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
}

export default Gameboard;