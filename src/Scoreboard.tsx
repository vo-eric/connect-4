import type { Game } from './game';
import Score from './Score';

export default function Scoreboard({ gameState }: { gameState: Game }) {
  return (
    <div className='border-b w-full'>
      <div className=' p-4 rounded-lg'>
        <p className='text-6xl font-medium'>Scores</p>
        <div className='scoreboard flex justify-between w-full'>
          <Score score={gameState.redWins} player='R' />
          <Score score={gameState.blackWins} player='B' />
        </div>
      </div>
    </div>
  );
}
