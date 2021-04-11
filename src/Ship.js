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
    constructor(size, facing, onSunk) {
        this.sections = [];
        this.size = size;
        this.facing = facing;
        this.onSunk = onSunk;
        for (let i = 0; i < size; i++) {
            this.sections.push(false);
        }
    }

    hit(position) {
        this.sections[position] = true;
        if (this.isSunk()) {
            this.onSunk();
        }
    }

    isSunk() {
        return this.sections.reduce((prev, current) => prev & current);
    }
}

const makePatrolBoat = function(facing, onSunk) {
    return new Ship(SIZE_PATROL_BOAT, facing, onSunk);
}

const makeSubmarine = function(facing, onSunk) {
    return new Ship(SIZE_SUBMARINE, facing, onSunk);
}

const makeDestroyer = function(facing, onSunk) {
    return new Ship(SIZE_DESTROYER, facing, onSunk);
}

const makeBattleship = function(facing, onSunk) {
    return new Ship(SIZE_BATTLESHIP, facing, onSunk);
}

const makeCarrier = function(facing, onSunk) {
    return new Ship(SIZE_CARRIER, facing, onSunk);
}

export { DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT, makePatrolBoat, makeDestroyer, makeSubmarine, makeBattleship, makeCarrier }