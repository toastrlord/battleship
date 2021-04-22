import {HIT_STATE_MISS, HIT_STATE_HIT, HIT_STATE_REVEAL_SHIP } from "../Space";

function SpaceComponent(props) {
    const {hitState, onSpaceClicked} = props;
    let className;
    // only allow a click event if this square hasn't been clicked yet
    switch (hitState) {
        case HIT_STATE_REVEAL_SHIP:
            className = 'ship-square';
            return <div className={className + ' space'}/>;
        case HIT_STATE_HIT:
            className = 'hit-square';
            return <div className={className + ' space'}/>;
        case HIT_STATE_MISS:
            className = 'miss-square'
            return <div className={className + ' space'}/>;
        default:
            className = 'empty-square';
            return <div className={className + ' space'} onClick={onSpaceClicked}/>;
    }
}

export default SpaceComponent;