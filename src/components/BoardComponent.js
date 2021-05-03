import { Component } from 'react';
import SpaceComponent from './SpaceComponent';
import {Gameboard, HEIGHT, WIDTH } from '../Gameboard';
import { HIT_STATE_REVEAL_SHIP, HIT_STATE_HIT } from '../Space';

class BoardComponent extends Component {
    constructor(props) {
        super(props);
        this.updateBoard = this.updateBoard.bind(this);

        this.props.board.updateCallback = this.updateBoard;

        this.state = {
            board: this.props.board,
            reveal: this.props.reveal
        }
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.board !== this.props.board) {
            this.props.board.updateCallback = this.updateBoard;
        }
    }

    generateRow(row) {
        const spaces = this.props.board.spaces;
        const onClickCallback = this.props.onClickCallback;
        return (<div className='row' key={row}>
            {spaces.slice(row * HEIGHT, row * HEIGHT + WIDTH).map((space, col) => {
                const showShip = this.props.reveal && this.props.board.getSpace(row, col).onHitCallback && space.hitState !== HIT_STATE_HIT;
                return showShip ? 
                <SpaceComponent hitState={HIT_STATE_REVEAL_SHIP} key={row * HEIGHT + col} onSpaceClicked={onClickCallback ? () => onClickCallback(row, col) : null}/>
                : <SpaceComponent hitState={space.hitState} key={row * HEIGHT + col} onSpaceClicked={onClickCallback ? () => onClickCallback(row, col) : null}/>
            })}
        </div>);
    }

    updateBoard(newBoard) {
        this.setState({
            board: newBoard,
        });
        //this.props.updateBoardCallback(newBoard);
    }

    componentWillUnmount() {
        const newBoard = Object.assign(this.state.board);
        newBoard.updateCallback = null;
        this.setState({
            board: newBoard
        })
    }

    render() {
        const rows = [];
        for (let i = 0; i < HEIGHT; i++) {
            rows.push(i);
        }
        return (<div className='board-grid' onMouseMove={this.props.onMouseMove}>
            {this.props.title}
            {rows.map(row => {
                return this.generateRow(row);
            })}
        </div>);
    }
}

export default BoardComponent;