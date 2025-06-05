import { type Game } from './game';
import { useLoaderData } from 'react-router';

export default function GamesList() {
  const { finishedGames, unfinishedGames } = useLoaderData<{
    finishedGames: Game[];
    unfinishedGames: Game[];
  }>();

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-3 max-h-[400px] overflow-auto'>
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
