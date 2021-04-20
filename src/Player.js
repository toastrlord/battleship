import {WIDTH, HEIGHT} from './Gameboard';

function findRandomSpace(opposingBoard) {
    let row;
    let col;
    do { // keep trying until we find a space that hasn't been hit
        row = Math.round(Math.random() * HEIGHT - 1);
        col = Math.round(Math.random() * WIDTH - 1);
    } while (opposingBoard.getSpace(row, col).isHit());
    return {row, col};
}

function randomAIStrategy(opposingBoard) {
    const coords = findRandomSpace(opposingBoard);
    opposingBoard.recieveAttack(coords.row, coords.col);
    return(opposingBoard.getSpace().onHitListener !== undefined);
}

function makePlayer(opposingBoard, strategy) {
    return () => strategy(opposingBoard);
}

export {randomAIStrategy, makePlayer};