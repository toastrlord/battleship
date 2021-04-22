import { Component } from 'react';
import SpaceComponent from './SpaceComponent';
import {Gameboard, HEIGHT, WIDTH } from '../Gameboard';
import { HIT_STATE_REVEAL_SHIP, HIT_STATE_HIT } from '../Space';

class BoardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spaces: this.props.board.spaces,
            reveal: this.props.reveal
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
                const showShip = this.props.reveal && this.props.board.getSpace(row, col).onHitCallback && space.hitState !== HIT_STATE_HIT;
                return showShip ? 
                <SpaceComponent hitState={HIT_STATE_REVEAL_SHIP} key={row * HEIGHT + col} onSpaceClicked={onClickCallback ? () => onClickCallback(row, col) : () => null}/>
                : <SpaceComponent hitState={space.hitState} key={row * HEIGHT + col} onSpaceClicked={onClickCallback ? () => onClickCallback(row, col) : () => null}/>
            })}
        </div>);
    }

    render() {
        const rows = [];
        for (let i = 0; i < HEIGHT; i++) {
            rows.push(i);
        }
        return (<div className='board-grid' onMouseMove={this.props.onMouseMove}>
            {rows.map(row => {
                return this.generateRow(row);
            })}
        </div>);
    }
}

export default BoardComponent;