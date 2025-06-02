import { test, assert } from 'vitest';
import { initializeGame } from './game';

test('game initializes a valid game state', () => {
  assert.deepEqual(initializeGame(), {
    board: [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
    ],
    currentPlayer: 'black',
  });
});
