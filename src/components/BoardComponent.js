import { Component } from 'react';
import SpaceComponent from './SpaceComponent';
import {Gameboard, HEIGHT, WIDTH } from '../Gameboard';

class BoardComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            board: new Gameboard()
        }
    }

    generateRow(row) {
        const spaces = this.state.board.spaces;
        return (<div className='col'>
            {spaces.slice(row * HEIGHT, row * HEIGHT + WIDTH).map((space, index) => {
                return <SpaceComponent isHit={space.isHit} />;
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