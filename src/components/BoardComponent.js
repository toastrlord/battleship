import { Component } from 'react';
import SpaceComponent from './SpaceComponent';
import {HEIGHT, WIDTH } from '../Gameboard';
import { HIT_STATE_REVEAL_SHIP, HIT_STATE_HIT, HIT_STATE_SUNK } from '../Space';
import { DIRECTION_DOWN } from '../Ship';

class BoardComponent extends Component {
    constructor(props) {
        super(props);
        this.updateBoard = this.updateBoard.bind(this);
        this.highlightRows = this.highlightRows.bind(this);
        this.clearHighlighting = this.clearHighlighting.bind(this);
        this.props.board.updateCallback = this.updateBoard;

        this.state = {
            board: this.props.board,
            reveal: this.props.reveal,
            coordsToHighlight: []
        }
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.board !== this.props.board) {
            this.props.board.updateCallback = this.updateBoard;
            this.setState({
                coordsToHighlight: []
            });
        }
    }

    highlightRows(startRow, startCol) {
        this.clearHighlighting();
        let row, col;
        if (this.props.direction === DIRECTION_DOWN) {
            row = startRow - this.props.startIndex;
            col = startCol;
        } else {
            row = startRow;
            col = startCol - this.props.startIndex;
        }
        let coordsToHighlight = this.state.board.checkShipPlacement(row, col, this.props.shipSize, this.props.direction);
        this.setState({
            coordsToHighlight
        });
    }

    clearHighlighting() {
        this.setState({
            coordsToHighlight: []
        });
    }

    generateRow(row) {
        const {onClickCallback, ship} = this.props;
        const {coordsToHighlight} = this.state;
        const spaces = this.props.board.spaces;
        return (<div className='row' key={row}>
            {spaces.slice(row * HEIGHT, row * HEIGHT + WIDTH).map((space, col) => {
                const showShip = this.props.reveal && this.props.board.getSpace(row, col).onHitCallback && space.hitState !== HIT_STATE_HIT && space.hitState !== HIT_STATE_SUNK;
                const hitState = showShip ? HIT_STATE_REVEAL_SHIP : space.hitState;
                const onDragEnter = ship ? () => this.highlightRows(row, col) : null;
                let rowOffset = 0;
                let colOffset = 0;
                if (this.props.direction === DIRECTION_DOWN) {
                    rowOffset = -this.props.startIndex;
                } else {
                    colOffset = -this.props.startIndex;
                }
                const drop = ship ? () => this.props.drop(row + rowOffset, col + colOffset) : null;
                const highlighted = coordsToHighlight.filter(coordinate => {
                    return coordinate.row === row && coordinate.col === col;
                }).length;
                return <SpaceComponent highlighted={highlighted} hitState={hitState} row={row} col={col} key={row * HEIGHT + col} onDragEnter={onDragEnter} drop={drop ? drop : null} onSpaceClicked={onClickCallback ? () => onClickCallback(row, col) : null}/>
            })}
        </div>);
    }

    updateBoard(newBoard) {
        this.setState({
            board: newBoard,
        });
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
        return (<div className='board-grid' onMouseMove={this.props.onMouseMove} onDragEnd={this.clearHighlighting}>
            {this.props.title}
            {rows.map(row => {
                return this.generateRow(row);
            })}
        </div>);
    }
}

export default BoardComponent;