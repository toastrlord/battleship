import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Game from './Game';

const game = new Game();

ReactDOM.render(
  <React.StrictMode>
    <App makePlayerMove={game.makePlayerMove}/>
  </React.StrictMode>,
  document.getElementById('root')
);