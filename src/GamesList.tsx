import { type Game } from './game';
import { useLoaderData } from 'react-router';

export default function GamesList() {
  const { finishedGames, unfinishedGames } = useLoaderData<{
    finishedGames: Game[];
    unfinishedGames: Game[];
  }>();

  return (
    <div className='finished games'>
      <p>ongoing games</p>
      {unfinishedGames.map((game) => {
        return <p>{game.id}</p>;
      })}

      <p>finished games</p>
      {finishedGames.map((game) => {
        return (
          <p>
            {game.id} winner: {game.winningPlayer}
          </p>
        );
      })}
    </div>
  );
}
