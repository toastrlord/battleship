import {WIDTH, HEIGHT} from './Gameboard';

function randomAIStrategy(opposingBoard) {
    let row;
    let col;
    do { // keep trying until we find a space that hasn't been hit
        row = Math.round(Math.random() * HEIGHT - 1);
        col = Math.round(Math.random() * WIDTH - 1);
    } while (opposingBoard.getSpace(row, col).isHit());
    opposingBoard.recieveAttack(row, col);
}

function makePlayer(opposingBoard, strategy) {
    return () => strategy(opposingBoard);
}

export {randomAIStrategy, makePlayer};