import { test, assert, describe, expect } from 'vitest';
import { determinePlayer, initializeGame, move } from './game';

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
    currentPlayer: 'B',
  });
});

describe('game correctly updates the current player', () => {
  test('Player R goes to B', () => {
    const currentPlayer = 'B';
    const newPlayer = determinePlayer(currentPlayer);
    expect(newPlayer).toBe('R');
  });

  test('Player B goes to R', () => {
    const currentPlayer = 'R';
    const newPlayer = determinePlayer(currentPlayer);
    expect(newPlayer).toBe('B');
  });
});

describe('a player can place a piece', () => {
  test('a player can place a piece on an empty column', () => {
    const game = initializeGame();
    const newGameState = move(game.board, 2, 'B');

    assert.deepEqual(newGameState, {
      board: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, 'B', null, null, null, null],
      ],
      currentPlayer: 'R',
    });
  });

  test('a player can place a piece on an column with an existing piece', () => {
    let game = initializeGame();
    game = move(game.board, 2, 'B');
    game = move(game.board, 2, 'R');

    assert.deepEqual(game, {
      board: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, 'R', null, null, null, null],
        [null, null, 'B', null, null, null, null],
      ],
      currentPlayer: 'B',
    });
  });

  test('a player cannot place a piece in a full column', () => {
    let game = initializeGame();
    game.board = [
      [null, null, 'R', null, null, null, null],
      [null, null, 'B', null, null, null, null],
      [null, null, 'R', null, null, null, null],
      [null, null, 'B', null, null, null, null],
      [null, null, 'R', null, null, null, null],
      [null, null, 'B', null, null, null, null],
    ];
    game = move(game.board, 2, 'B');

    assert.deepEqual(game, {
      board: [
        [null, null, 'R', null, null, null, null],
        [null, null, 'B', null, null, null, null],
        [null, null, 'R', null, null, null, null],
        [null, null, 'B', null, null, null, null],
        [null, null, 'R', null, null, null, null],
        [null, null, 'B', null, null, null, null],
      ],
      currentPlayer: 'B',
    });
  });

  test('a player cannot place out of bounds', () => {
    let game = initializeGame();
    game = move(game.board, -1, 'B');

    assert.deepEqual(game, {
      board: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
      ],
      currentPlayer: 'B',
    });
  });

  test('a player cannot place out of bounds', () => {
    let game = initializeGame();
    game = move(game.board, 8, 'B');

    assert.deepEqual(game, {
      board: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
      ],
      currentPlayer: 'B',
    });
  });
});
