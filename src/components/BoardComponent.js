import { Component } from 'react';
import SpaceComponent from './SpaceComponent';
import {Gameboard, HEIGHT, WIDTH } from '../Gameboard';
import { makeBattleship, DIRECTION_RIGHT, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_UP } from '../Ship';

class BoardComponent extends Component {
    constructor(props) {
        super(props);
        const gameBoard = new Gameboard();
        const battleship = makeBattleship(DIRECTION_UP, () => console.log('Battleship sunk!'));
        gameBoard.addShip(battleship, 9, 9);

        this.state = {
            board: gameBoard
        }

        this.onHit = this.onHit.bind(this);
    }

    onHit(row, col) {
        const newBoard = Object.assign(this.state.board);
        newBoard.recieveAttack(row, col);

        this.setState({
            board: newBoard,
        });
    }

    generateRow(row) {
        const spaces = this.state.board.spaces;
        return (<div className='row' key={row}>
            {spaces.slice(row * HEIGHT, row * HEIGHT + WIDTH).map((space, col) => {
                return <SpaceComponent hitState={space.hitState} key={row * HEIGHT + col} onSpaceClicked={() => this.onHit(row, col)}/>;
            })}
        </div>);
    }

    render() {
        const rows = [];
        for (let i = 0; i < HEIGHT; i++) {
            rows.push(i);
        }
        return (<div className='board-grid'>
            {rows.map(row => {
                return this.generateRow(row);
            })}
        </div>);
    }
}

export default BoardComponent;