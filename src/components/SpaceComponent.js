function SpaceComponent(props) {
    const {isHit} = props;
    let className;
    if (isHit) {
        className = 'hit-square';
    }
    else {
        className = 'empty-square';
    }
    return <div className={className + ' space'} />;
}

export default SpaceComponent;