import { useEffect, useState } from 'react';
import { type Game } from './game';
import clsx from 'clsx';
import useSound from 'use-sound';
import pirHorn from '../public/the-price-is-right-losing-horn.mp3';
import { ConnectFourClientAPI } from '../api/connectFour';
import Celebration from './Celebration';
import { useLoaderData } from 'react-router';
import { io } from 'socket.io-client';
import { PLAYER_CONNECTED, PLAYER_JOINED, PLAYER_MOVED } from '../socketEvents';

const api = new ConnectFourClientAPI();

export default function GameView() {
  const { game: fetchedGame } = useLoaderData<{ game: Game }>();
  const [gameState, setGameState] = useState<Game>(fetchedGame);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [playSound] = useSound(pirHorn, { volume: 0.7 });
  const [playersInGame, setPlayersInGame] = useState<string[]>([]);

  /*  
  
  How to handle rematches
  Clear the board, update the existing row in the DB and force "B" to start
    requires refactoring makeMove

  Creates a new game and row in the db
    emits an event into the socket
    forces everyone in the socket/room to navigate to the new room


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

  useEffect(() => {
    const handleConnection = () => {
      socket.emit(PLAYER_CONNECTED, gameState.id);
    };

    const handleMove = (game: Game) => {
      setGameState(game);
    };

    const socket = io('http://localhost:3000');
    socket.on('connect', handleConnection);

    //TODO: find a use for this - maybe to render users in the lobby?
    socket.on(PLAYER_JOINED, (userIds: string[]) => {
      setPlayersInGame(userIds);
    });

    socket.on(PLAYER_MOVED, handleMove);

    //clean up existing sockets if dependencies change
    return () => {
      socket.off('connect', handleConnection);
      socket.off(PLAYER_MOVED, handleMove);
    };
  }, [gameState.id]);

  const handleClick = async (column: number) => {
    if (!gameState) {
      return;
    }

    const updatedGame = await api.move(gameState.id, column);

    //Refactor this into its own function
    if (
      updatedGame.winningPlayer === 'B' ||
      updatedGame.winningPlayer === 'R'
    ) {
      setGameState(await api.updateScore(gameState.id));
    } else if (updatedGame.winningPlayer === 'tie') {
      playSound();
    }
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
      <div>
        <p>SCORES</p>

        <p>red score: {gameState.redWins}</p>
        <p>black score: {gameState.blackWins}</p>
      </div>
      <a
        href='/games'
        className='p-2 rounded-lg border border-bg-blue text-bg-blue! hover:bg-bg-blue hover:text-white! cursor-pointer transition duration-300'
      >
        Back to games
      </a>
      <div className='flex flex-col gap-8 text-center items-center m-auto'>
        {renderGameMessage(gameState)}
        <div className='flex gap-6 text-start'>
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

          <div className='flex flex-col gap-2'>
            <p className='text-2xl font-bold'>Players in game:</p>
            <div>
              {playersInGame.map((player) => (
                <p>{player}</p>
              ))}
            </div>
            <button className='p-2 rounded-lg border border-bg-blue text-bg-blue! hover:bg-bg-blue hover:text-white! cursor-pointer transition duration-300 mt-auto'>
              {gameState.winningPlayer ? 'New Game' : 'Restart'}
            </button>
          </div>
          {gameState.winningPlayer && (
            <div className='winner min-h-10 absolute top-0 left-0'>
              {renderFinishedState()}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
