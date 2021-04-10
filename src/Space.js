class Space {
    constructor() {
        this.isHit = false;
    }

    addHitListener(callback) {
        this.onHitCallback = callback;
    }

    onHit() {
        if (this.onHitCallback) {
            this.onHitCallback();
        }
        this.isHit = true;
    }
}

export default Space;