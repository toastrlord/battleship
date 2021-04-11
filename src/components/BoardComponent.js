import { Component } from 'react';
import SpaceComponent from './SpaceComponent';
import {Gameboard, HEIGHT, WIDTH } from '../Gameboard';

class BoardComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            board: new Gameboard()
        }

        this.onHit = this.onHit.bind(this);
    }

    onHit(row, col) {
        console.log(`clicked on ${row},${col}`);
        const newBoard = Object.assign(this.state.board);
        newBoard.recieveAttack(row, col);

        this.setState({
            board: newBoard,
        });
        console.log(newBoard.spaces);
    }

    generateRow(row) {
        const spaces = this.state.board.spaces;
        return (<div className='col' key={row}>
            {spaces.slice(row * HEIGHT, row * HEIGHT + WIDTH).map((space, col) => {
                console.log(space.isHit);
                return <SpaceComponent isHit={space.isHit} key={row * HEIGHT + col} onSpaceClicked={() => this.onHit(row, col)}/>;
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