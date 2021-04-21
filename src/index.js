import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';

const game = new Game();

ReactDOM.render(
  <React.StrictMode>
    {game.appComponent}
  </React.StrictMode>,
  document.getElementById('root')
);