function SpaceComponent(props) {
    const {isHit, onSpaceClicked} = props;
    console.log(isHit);
    let className;
    if (isHit) {
        className = 'hit-square';
    }
    else {
        className = 'empty-square';
    }
    return <div className={className + ' space'} onClick={onSpaceClicked}/>;
}

export default SpaceComponent;