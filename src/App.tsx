import { useState } from 'react';
import './App.css';
import { initializeGame, move, type Game } from './game';
import clsx from 'clsx';
import useSound from 'use-sound';
import pirHorn from '../public/the-price-is-right-losing-horn.mp3';

function App() {
  const [gameState, setGameState] = useState<Game>(initializeGame());
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [playSound] = useSound(pirHorn, { volume: 0.7 });

  const handleClick = (col: number) => {
    const newGameState = move(gameState.board, col, gameState.currentPlayer);

    if (newGameState.winningPlayer === 'tie') {
      playSound();
    }
    setGameState(newGameState);
  };

  const handleNewGameClick = () => {
    setGameState(initializeGame());
  };

  const renderFinishedState = () => {
    switch (gameState.winningPlayer) {
      case 'B':
        return <p className='text-4xl text-black'>Black wins!</p>;
      case 'R':
        return <p className='text-4xl text-red-900'>Red wins!</p>;
      case 'tie':
        return <p className='text-4xl text-green'>It's a tie!</p>;
      default:
        return null;
    }
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
                      'rounded-full h-12 w-12 transition duration-300',
                      {
                        'bg-white':
                          gameState.board[i][j] === null && hoveredColumn !== j,
                      },
                      {
                        'bg-gray-300':
                          hoveredColumn === j && gameState.board[i][j] === null,
                      },
                      { 'bg-black': gameState.board[i][j] === 'B' },
                      { 'bg-red-900': gameState.board[i][j] === 'R' }
                    )}
                    onClick={() => handleClick(j)}
                    onMouseEnter={() => setHoveredColumn(j)}
                    onMouseLeave={() => setHoveredColumn(null)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <button
        className='transition duration-300 rounded-lg bg-white py-2 px-4 text-bg-blue hover:bg-bg-blue hover:text-white hover:border-1 hover:border-white cursor-pointer border-1 border-bg-blue font-semibold'
        onClick={handleNewGameClick}
      >
        {gameState.winningPlayer ? 'New Game' : 'Reset Game'}
      </button>
      {gameState.winningPlayer && (
        <div className='winner min-h-10'>{renderFinishedState()}</div>
      )}
    </div>
  );
}

export default App;
