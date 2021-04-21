import { Component } from 'react';
import SpaceComponent from './SpaceComponent';
import {Gameboard, HEIGHT, WIDTH } from '../Gameboard';
import { makeBattleship, DIRECTION_RIGHT, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_UP } from '../Ship';

class BoardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spaces: this.props.board.spaces
        }
        this.onHit = this.onHit.bind(this);
        this.props.board.updateCallback = this.onHit;
    }
    
    onHit() {
        this.setState({
            spaces: this.props.board.spaces
        });
    }

    generateRow(row) {
        const spaces = this.props.board.spaces;
        const onClickCallback = this.props.onClickCallback;
        return (<div className='row' key={row}>
            {spaces.slice(row * HEIGHT, row * HEIGHT + WIDTH).map((space, col) => {
                return <SpaceComponent hitState={space.hitState} key={row * HEIGHT + col} onSpaceClicked={this.props.onClickCallback ? () => onClickCallback(row, col) : () => null}/>;
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