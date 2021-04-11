import { HIT_STATE_MISS, HIT_STATE_HIT } from "../Space";

function SpaceComponent(props) {
    const {hitState, onSpaceClicked} = props;
    let className;
    switch (hitState) {
        case HIT_STATE_HIT:
            className = 'hit-square';
            break;
        case HIT_STATE_MISS:
            className = 'miss-square'
            break;
        default:
            className = 'empty-square';
    }

    return <div className={className + ' space'} onClick={onSpaceClicked}/>;
}

export default SpaceComponent;