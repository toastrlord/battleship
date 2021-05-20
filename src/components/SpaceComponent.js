import {HIT_STATE_MISS, HIT_STATE_HIT, HIT_STATE_REVEAL_SHIP, HIT_STATE_SUNK } from "../Space";

function SpaceComponent(props) {
    const {hitState, onSpaceClicked} = props;
    let className;
    // only allow a click event if this square hasn't been clicked yet
    switch (hitState) {
        case HIT_STATE_SUNK:
            className = 'sunk-square';
            break;
        case HIT_STATE_REVEAL_SHIP:
            className = 'ship-square';
            break;
        case HIT_STATE_HIT:
            className = 'hit-square';
            break;
        case HIT_STATE_MISS:
            className = 'miss-square';
            break;
        default:
            className = 'empty-square';
        if (props.highlighted) {
            className += 'highlighted';
        }
    }
    return (onSpaceClicked !== null ? <div onDrop={props.drop} onDragOver={(e) => e.preventDefault()} onDragEnter={(e) => {
        e.preventDefault();
        props.onDragEnter();
    }} onDragLeave={props.onDragLeave} className={className + ' space clickable'} onClick={onSpaceClicked} opacity={props.opacity}/> 
        : <div onDrop={props.drop} onDragOver={(e) => e.preventDefault()} 
        onDragEnter={(e) => {
            e.preventDefault();
            props.onDragEnter();
        }} onDragLeave={props.onDragLeave} className={className + ' space'} opacity={props.opacity}/>);
    
}

export default SpaceComponent;