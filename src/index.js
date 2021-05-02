import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';
import {App} from './App';

const game = new Game();

ReactDOM.render(
  <React.StrictMode>
    <App game={game}/>
  </React.StrictMode>,
  document.getElementById('root')
);