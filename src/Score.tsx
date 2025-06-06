import clsx from 'clsx';
import type { Player } from './game';

export default function Score({
  score,
  player,
}: {
  score: number;
  player: Player;
}) {
  return (
    <div
      className={clsx(
        'flex flex-col text-white p-4 rounded-lg text-2xl',
        player === 'B' ? 'bg-black' : 'bg-red-900'
      )}
    >
      {player === 'B' ? 'Black' : 'Red'}
      <div className=''>{score}</div>
    </div>
  );
}
