import { Component } from "react";
import BoardComponent from "./components/BoardComponent";

const PLACING_SHIPS = 0;
const PLAYING = 1;
const GAME_OVER = 2;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameState: PLAYING
    }
  }

  updateBoards(computerBoard, playerBoard) {
    this.setState({
      computerBoard: computerBoard,
      playerBoard: playerBoard
    });
  }

  render() {
    const {gameState} = this.state;
    switch(gameState) {
      case PLAYING:
        return <div>
          <BoardComponent board={this.props.playerBoard} />
          <BoardComponent onClickCallback={this.props.makePlayerMove} board={this.props.computerBoard} />
        </div>
      case GAME_OVER:
        return null;
      default:
        return null;
    }
  }
}

export default App;
