import { useState } from 'react';
import './App.css';
import { initializeGame, move, type Game } from './game';
import clsx from 'clsx';

function App() {
  const [gameState, setGameState] = useState<Game>(initializeGame());

  const handleClick = (col: number) => {
    const newGameState = move(gameState.board, col, gameState.currentPlayer);
    console.log(newGameState);
    setGameState(newGameState);
  };

  return (
    <div className='flex-col gap-4'>
      {gameState.board.map((row, i) => {
        return (
          <div className='flex'>
            {row.map((_, j) => {
              return (
                <div
                  className={clsx(
                    'rounded-full h-12 w-12',
                    { 'bg-white': gameState.board[i][j] === null },
                    { 'bg-black': gameState.board[i][j] === 'B' },
                    { 'bg-red-900': gameState.board[i][j] === 'R' }
                  )}
                  onClick={() => handleClick(j)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default App;
