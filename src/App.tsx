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

  const handleNewGameClick = () => {
    setGameState(initializeGame());
  };

  return (
    <div className='flex flex-col gap-8 text-center'>
      <p className='text-4xl'>
        Current Player:{' '}
        <span
          className={clsx({
            'text-black': gameState.currentPlayer === 'B',
            'text-red-900': gameState.currentPlayer === 'R',
          })}
        >
          {gameState.currentPlayer === 'B' ? 'Black' : 'Red'}
        </span>
      </p>
      <div
        className={clsx('flex-col gap-4 bg-blue-800 p-2 rounded-lg ', {
          'pointer-events-none': gameState.winningPlayer,
        })}
      >
        {gameState.board.map((row, i) => {
          return (
            <div className='flex p-1 gap-2'>
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
      <button
        className='transition duration-300 rounded-lg bg-white py-2 px-4 text-black hover:bg-black hover:text-white cursor-pointer'
        onClick={handleNewGameClick}
      >
        {gameState.winningPlayer ? 'New Game' : 'Reset Game'}
      </button>
      {gameState.winningPlayer && (
        <div className='winner min-h-10'>
          <p
            className={clsx('text-4xl', {
              'text-black': gameState.winningPlayer === 'B',
              'text-red-900': gameState.winningPlayer === 'R',
            })}
          >
            {gameState.winningPlayer === 'B' ? 'Black wins!' : 'Red wins!'}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
