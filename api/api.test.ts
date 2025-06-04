import { assert, describe, expect, test } from 'vitest';
import ConnectFourAPI from './connectFour';

describe('create game', () => {
  const connectFour = new ConnectFourAPI();

  test('should return a valid new game instance', async () => {
    const game = await connectFour.createGame();
    const flattenedBoard = game.board.flat();

    expect(game.currentPlayer).toBe('B');
    expect(game.id).toBeDefined();
    expect(game.id).toBeTypeOf('string');

    for (const cell of flattenedBoard) {
      expect(cell).toBe(null);
    }
  });
});

describe('get game', async () => {
  const connectFour = new ConnectFourAPI();
  const game = await connectFour.createGame();

  test('should fetch an existing game', async () => {
    const fetchedGame = await connectFour.getGame(game.id);

    expect(fetchedGame.currentPlayer).toBe('B');
    expect(fetchedGame.id).toBeDefined();
    expect(fetchedGame.id).toBeTypeOf('string');
  });

  //TODO: Find out how to make this work properly
  // test('should throw an error if a game does not exist', async () => {
  //   const fetchMissingGame = await connectFour.getGame('asdf');

  //   expect(fetchMissingGame).toThrowError();
  // });
});

describe('move', async () => {
  const connectFour = new ConnectFourAPI();

  test('should successfully make a move', async () => {
    const game = await connectFour.createGame();
    const fetchedGame = await connectFour.getGame(game.id);
    const updatedGame = await connectFour.move(fetchedGame.id, 0);

    expect(updatedGame.currentPlayer).toBe('R');
    assert.deepEqual(updatedGame.board, [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['B', null, null, null, null, null, null],
    ]);
  });
});
