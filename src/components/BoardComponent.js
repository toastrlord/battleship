import { Component } from 'react';
import SpaceComponent from './SpaceComponent';
import {Gameboard, HEIGHT, WIDTH } from '../Gameboard';
import { makeBattleship, DIRECTION_RIGHT, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_UP } from '../Ship';

class BoardComponent extends Component {
    constructor(props) {
        super(props);
        const gameBoard = new Gameboard();
        const battleship = makeBattleship(DIRECTION_UP);
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
        return (<div className='flex-grid'>
            {[0,1,2,3,4,5,6,7,8,9].map(row => {
                return this.generateRow(row);
            })}
        </div>);
    }
}

export default BoardComponent;