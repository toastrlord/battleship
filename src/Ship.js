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
    constructor(size, facing) {
        this.sections = [];
        this.size = size;
        this.facing = facing;
        for (let i = 0; i < size; i++) {
            this.sections.push(false);
        }
    }

    hit(position) {
        this.sections[position] = true;
    }

    isSunk() {
        return this.sections.reduce((prev, current) => prev & current);
    }
}

const makePatrolBoat = function(facing) {
    return new Ship(SIZE_PATROL_BOAT, facing);
}

const makeSubmarine = function(facing) {
    return new Ship(SIZE_SUBMARINE, facing);
}

const makeDestroyer = function(facing) {
    return new Ship(SIZE_DESTROYER, facing);
}

const makeBattleship = function(facing) {
    return new Ship(SIZE_BATTLESHIP, facing);
}

const makeCarrier = function(facing) {
    return new Ship(SIZE_CARRIER, facing);
}

export { DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT, makePatrolBoat, makeDestroyer, makeSubmarine, makeBattleship, makeCarrier }