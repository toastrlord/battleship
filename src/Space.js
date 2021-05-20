const HIT_STATE_EMPTY = 0;
const HIT_STATE_HIT = 1;
const HIT_STATE_MISS = 2;
const HIT_STATE_REVEAL_SHIP = 3;
const HIT_STATE_SUNK = 4;

class Space {
    constructor() {
        this.hitState = HIT_STATE_EMPTY;
    }

    addHitListener(callback) {
        this.onHitCallback = callback;
    }

    onHit() {
        if (this.containsShip()) {
            this.hitState = HIT_STATE_HIT;
            this.onHitCallback();
        }
        else {
            this.hitState = HIT_STATE_MISS;
        }
    }

    onSunk() {
        this.hitState = HIT_STATE_SUNK;
    }

    containsShip() {
        // if we have a callback registered that this must be a ship space
        return this.onHitCallback;
    }
}

export {HIT_STATE_EMPTY, HIT_STATE_HIT, HIT_STATE_MISS, HIT_STATE_REVEAL_SHIP, HIT_STATE_SUNK, Space};