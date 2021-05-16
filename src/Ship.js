const SIZE_PATROL_BOAT = 2;
const SIZE_SUBMARINE = 3;
const SIZE_DESTROYER = 3;
const SIZE_BATTLESHIP = 4;
const SIZE_CARRIER = 5;

const DIRECTION_UP = 0;
const DIRECTION_RIGHT = 1;
const DIRECTION_DOWN = 2;
const DIRECTION_LEFT = 3;

class Ship {
    constructor(size, onSunk) {
        this.sections = [];
        this.size = size;
        this.onSunk = onSunk;
        for (let i = 0; i < size; i++) {
            this.sections.push(false);
        }
    }

    hit(position) {
        this.sections[position] = true;
        if (this.isSunk()) {
            //this.onSunk();
        }
    }

    isSunk() {
        return this.sections.reduce((prev, current) => {
            return prev && current;
        });
    }
}

const makePatrolBoat = function(onSunk) {
    return new Ship(SIZE_PATROL_BOAT, onSunk);
}

const makeSubmarine = function(onSunk) {
    return new Ship(SIZE_SUBMARINE, onSunk);
}

const makeDestroyer = function(onSunk) {
    return new Ship(SIZE_DESTROYER, onSunk);
}

const makeBattleship = function(onSunk) {
    return new Ship(SIZE_BATTLESHIP, onSunk);
}

const makeCarrier = function(onSunk) {
    return new Ship(SIZE_CARRIER, onSunk);
}

export { DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT, makePatrolBoat, makeDestroyer, makeSubmarine, makeBattleship, makeCarrier, SIZE_BATTLESHIP, SIZE_CARRIER, SIZE_SUBMARINE, SIZE_DESTROYER, SIZE_PATROL_BOAT }