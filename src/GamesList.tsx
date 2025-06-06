import { type Game } from './game';
import { useLoaderData, useNavigate } from 'react-router';
import { ConnectFourClientAPI } from '../api/connectFour';

const api = new ConnectFourClientAPI();

export default function GamesList() {
  const navigate = useNavigate();
  const { finishedGames, unfinishedGames } = useLoaderData<{
    finishedGames: Game[];
    unfinishedGames: Game[];
  }>();

  const initializeGame = async () => {
    const game = await api.createGame();
    navigate(`/games/${game.id}`);
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-3 max-h-[400px] overflow-auto'>
        <button
          className='transition duration-300 rounded-lg bg-white py-2 px-4 text-bg-blue hover:bg-bg-blue hover:text-white hover:border-1 hover:border-white cursor-pointer border-1 border-bg-blue font-semibold'
          onClick={() => initializeGame()}
        >
          Start a new game
        </button>
        <h3 className='text-xl'>Ongoing games</h3>
        <div className='flex flex-col gap-2'>
          {unfinishedGames.map((game) => {
            return (
              <a
                className='p-2 rounded-lg border border-bg-blue text-bg-blue! hover:bg-bg-blue hover:text-white! cursor-pointer transition duration-300'
                href={`/games/${game.id}`}
              >
                {game.id}
              </a>
            );
          })}
        </div>
      </div>
      <div className='flex flex-col gap-3 max-h-[400px] overflow-auto'>
        <h3 className='text-xl'>Finished games</h3>
        <div className='flex flex-col gap-2'>
          {finishedGames.map((game) => {
            return (
              <a
                className='p-2 rounded-lg border border-bg-blue text-bg-blue! hover:bg-bg-blue hover:text-white! cursor-pointer transition duration-300'
                href={`/games/${game.id}`}
              >
                {game.id}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
