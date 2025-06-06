import { useState } from 'react';
import { type Game } from './game';
import clsx from 'clsx';
import useSound from 'use-sound';
import pirHorn from '../public/the-price-is-right-losing-horn.mp3';
import { ConnectFourClientAPI } from '../api/connectFour';
import Celebration from './Celebration';
import { useLoaderData } from 'react-router';

const api = new ConnectFourClientAPI();

export default function GameView() {
  const { game: fetchedGame } = useLoaderData<{ game: Game }>();
  const [gameState, setGameState] = useState<Game>(fetchedGame);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [playSound] = useSound(pirHorn, { volume: 0.7 });

  /*
  NOTE: USE THIS FOR NEW GAME CREATION
  
  const initializeGame = async () => {
    const game = await api.getGame(gameId);
    setGameState(game);
  };

  const handleNewGameClick = () => {
    initializeGame();
  };

  if (!gameState) {
    return (
      <button
        className='transition duration-300 rounded-lg bg-white py-2 px-4 text-bg-blue hover:bg-bg-blue hover:text-white hover:border-1 hover:border-white cursor-pointer border-1 border-bg-blue font-semibold'
        onClick={() => initializeGame()}
      >
        Start a new game
      </button>
    );
  }


  NOTE: potentially use this for rematches
    const handleNewGameClick = () => {
      initializeGame();
    };

    <button
          className='transition duration-300 rounded-lg bg-white py-2 px-4 text-bg-blue hover:bg-bg-blue hover:text-white hover:border-1 hover:border-white cursor-pointer border-1 border-bg-blue font-semibold'
          onClick={handleNewGameClick}
        >
          {gameState.winningPlayer ? 'New Game' : 'Reset Game'}
        </button>
  */

  const handleClick = async (column: number) => {
    if (!gameState) {
      return;
    }

    const updatedGame = await api.move(gameState.id, column);

    if (updatedGame.winningPlayer === 'tie') {
      playSound();
    }
    setGameState(updatedGame);
  };

  const renderFinishedState = () => {
    switch (gameState!.winningPlayer) {
      case 'B':
        return <Celebration color='#000000' />;
      case 'R':
        return <Celebration color='#82181a' />;
      case 'tie':
        return <Celebration color='#5C4033' />;
      default:
        return;
    }
  };

  /*
  TODO: Refactor
  */
  const renderGameMessage = (gameState: Game) => {
    if (!gameState.winningPlayer) {
      return (
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
      );
    } else {
      return (
        <p className='text-4xl'>
          <span
            className={clsx({
              'text-black': gameState.currentPlayer === 'B',
              'text-red-900': gameState.currentPlayer === 'R',
            })}
          >
            {gameState.winningPlayer === 'tie'
              ? 'No one wins. What a shame'
              : `${gameState.winningPlayer} wins!`}
          </span>
        </p>
      );
    }
  };

  if (!gameState) {
    return <div>Loading game...</div>;
  }

  return (
    <>
      <a
        href='/games'
        className='p-2 rounded-lg border border-bg-blue text-bg-blue! hover:bg-bg-blue hover:text-white! cursor-pointer transition duration-300'
      >
        Back to games
      </a>
      <div className='flex flex-col gap-8 text-center items-center m-auto'>
        {renderGameMessage(gameState)}
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
                            gameState.board[i][j] === null &&
                            hoveredColumn !== j,
                        },
                        {
                          'bg-gray-300':
                            hoveredColumn === j &&
                            gameState.board[i][j] === null,
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

        {gameState.winningPlayer && (
          <div className='winner min-h-10 absolute top-0 left-0'>
            {renderFinishedState()}
          </div>
        )}
      </div>
    </>
  );
}
