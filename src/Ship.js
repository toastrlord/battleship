const sizes = {
    PATROL_BOAT: 2,
    SUBMARINE: 3,
    DESTROYER: 3,
    BATTLESHIP: 4,
    CARRIER: 5,
}

const facing = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
}

class Ship {
    constructor(size) {
        this.sections = [];
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

export { sizes, facing, Ship }