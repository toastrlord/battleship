import { Component } from "react";
import BoardComponent from "./components/BoardComponent";

const PLACING_SHIPS = 0;
const PLAYING = 1;
const GAME_OVER = 2;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameState: PLACING_SHIPS
    }
  }

  render() {
    const {gameState} = this.state;
    switch(gameState) {
      case PLAYING:
        return null;
      case GAME_OVER:
        return null;
      default:
        return null;
    }
  }
}

export default App;
