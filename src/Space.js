const HIT_STATE_EMPTY = 0;
const HIT_STATE_HIT = 1;
const HIT_STATE_MISS = 2;
const HIT_STATE_REVEAL_SHIP = 3;

class Space {
    constructor() {
        this.hitState = HIT_STATE_EMPTY;
    }

    addHitListener(callback) {
        this.onHitCallback = callback;
    }

    onHit() {
        // presumes that if we have a callback registered that this must be a ship space
        if (this.onHitCallback) {
            this.onHitCallback();
            this.hitState = HIT_STATE_HIT;
        }
        else {
            this.hitState = HIT_STATE_MISS;
        }
    }
}

export {HIT_STATE_EMPTY, HIT_STATE_HIT, HIT_STATE_MISS, HIT_STATE_REVEAL_SHIP, Space};