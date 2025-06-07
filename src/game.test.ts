import { test, describe, expect } from 'vitest';
import {
  determinePlayer,
  determineWinner,
  initializeGame,
  move,
  type Board,
  type Game,
} from './game';

test('game initializes a valid game state', () => {
  const newGame = initializeGame();
  expect(newGame.board).toEqual([
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ]);

  expect(newGame.currentPlayer).toBe('B');
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
    const newGameState = move(game, 2);

    expect(newGameState.board).toEqual([
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, 'B', null, null, null, null],
    ]);
    expect(newGameState.currentPlayer).toBe('R');
  });
});

test('a player can place a piece on an column with an existing piece', () => {
  let game: Game = initializeGame();
  game = move(game, 2);
  game = move(game, 2);

  expect(game.board).toEqual([
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, 'R', null, null, null, null],
    [null, null, 'B', null, null, null, null],
  ]);
  expect(game.currentPlayer).toBe('B');
});

test('a player cannot place a piece in a full column', () => {
  let game: Game = initializeGame();
  game.board = [
    [null, null, 'R', null, null, null, null],
    [null, null, 'B', null, null, null, null],
    [null, null, 'R', null, null, null, null],
    [null, null, 'B', null, null, null, null],
    [null, null, 'R', null, null, null, null],
    [null, null, 'B', null, null, null, null],
  ];
  game = move(game, 2);

  expect(game.board).toEqual([
    [null, null, 'R', null, null, null, null],
    [null, null, 'B', null, null, null, null],
    [null, null, 'R', null, null, null, null],
    [null, null, 'B', null, null, null, null],
    [null, null, 'R', null, null, null, null],
    [null, null, 'B', null, null, null, null],
  ]);

  expect(game.currentPlayer).toEqual('B');
});

test('a player cannot place out of bounds', () => {
  let game: Game = initializeGame();
  game = move(game, -1);

  expect(game.board).toEqual([
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ]);
  expect(game.currentPlayer).toBe('B');
});

test('a player cannot place out of bounds', () => {
  let game: Game = initializeGame();
  game = move(game, 8);

  expect(game.board).toEqual([
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ]);

  expect(game.currentPlayer).toBe('B');
});

test('a player that makes a winning move should be declared the winner', () => {
  const game = initializeGame();
  game.board = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    ['B', null, null, null, null, null, null],
    ['B', 'R', null, null, null, null, null],
    ['B', 'R', 'B', 'R', null, null, null],
  ];

  const winningGame = move(game, 0);

  expect(winningGame.board).toEqual([
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    ['B', null, null, null, null, null, null],
    ['B', null, null, null, null, null, null],
    ['B', 'R', null, null, null, null, null],
    ['B', 'R', 'B', 'R', null, null, null],
  ]);

  expect(winningGame.currentPlayer).toBe('B');
  expect(winningGame.winningPlayer).toBe('B');
});

test('a player that makes a winning move should be declared the winner', () => {
  const game = initializeGame();
  game.board = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    ['R', null, null, null, null, null, null],
    ['B', null, null, null, null, null, null],
    ['B', 'R', null, null, null, null, null],
    ['B', 'B', 'B', null, null, null, null],
  ];

  const winningGame = move(game, 3);

  expect(winningGame.board).toEqual([
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    ['R', null, null, null, null, null, null],
    ['B', null, null, null, null, null, null],
    ['B', 'R', null, null, null, null, null],
    ['B', 'B', 'B', 'B', null, null, null],
  ]);

  expect(winningGame.currentPlayer).toBe('B');
  expect(winningGame.winningPlayer).toBe('B');
});

test('a player that makes a winning move should be declared the winner', () => {
  const game = initializeGame();
  game.board = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    ['R', null, null, null, null, null, null],
    ['B', 'R', null, null, null, null, null],
    ['B', 'R', 'R', null, null, null, null],
    ['B', 'B', 'B', null, null, null, null],
  ];

  const winningGame = move(game, 3);

  expect(winningGame.board).toEqual([
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    ['R', null, null, null, null, null, null],
    ['B', 'R', null, null, null, null, null],
    ['B', 'R', 'R', null, null, null, null],
    ['B', 'B', 'B', 'R', null, null, null],
  ]);
  expect(winningGame.currentPlayer).toBe('R');
  expect(winningGame.winningPlayer).toBe('R');
});

describe('determine winner should correctly parse the board', () => {
  test('an empty board should return undefined', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
    ];
    expect(determineWinner(board, 'B')).toBe(undefined);
  });

  test('a board with no winner should return undefined', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['R', 'B', 'B', 'R', null, null, null],
    ];
    expect(determineWinner(board, 'B')).toBe(undefined);
  });
  test('', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['R', 'B', null, 'R', 'B', null, null],
    ];
    expect(determineWinner(board, 'B')).toBe(undefined);
  });

  test('four matches in a row should return the winning player', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['R', 'R', 'R', 'R', null, null, null],
    ];
    expect(determineWinner(board, 'R')).toBe('R');
  });

  test('four matches in a row should return the winning player', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['R', 'R', 'R', 'R', null, null, null],
    ];
    expect(determineWinner(board, 'R')).not.toBe('B');
  });

  test('a board with no winner should return undefined', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['B', null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
    ];
    expect(determineWinner(board, 'R')).toBe(undefined);
  });

  test('four matches in a column should return the winning player', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
    ];
    expect(determineWinner(board, 'R')).toBe('R');
  });

  test('four matches in a column should return the winning player', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
    ];
    expect(determineWinner(board, 'R')).not.toBe('B');
  });

  test('four matches in a diagonal should return the winning player', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
      ['R', 'R', null, null, null, null, null],
      ['R', 'B', 'R', null, null, null, null],
      ['B', 'B', 'R', 'R', null, null, null],
    ];
    expect(determineWinner(board, 'R')).not.toBe('B');
  });

  test('four matches in a diagonal should return the winning player', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
      ['R', 'R', null, null, null, null, null],
      ['R', 'B', 'R', null, null, null, null],
      ['B', 'B', 'R', 'R', null, null, null],
    ];
    expect(determineWinner(board, 'R')).toBe('R');
  });

  test('a board with no winner should return undefined', () => {
    const board: Board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
      ['R', 'R', null, null, null, null, null],
      ['R', 'B', 'R', null, null, null, null],
      ['B', 'B', 'R', 'B', null, null, null],
    ];
    expect(determineWinner(board, 'R')).toBe(undefined);
  });

  test('a board with no winner should return undefined', () => {
    const board: Board = [
      ['R', 'B', 'R', 'R', 'R', 'B', 'B'],
      ['B', 'R', 'R', 'B', 'B', 'R', 'R'],
      ['B', 'B', 'B', 'R', 'B', 'B', 'B'],
      ['R', 'R', 'R', 'B', 'B', 'R', 'R'],
      ['R', 'R', 'R', 'B', 'B', 'R', 'B'],
      ['B', 'R', 'R', 'R', 'B', 'B', 'B'],
    ];
    expect(determineWinner(board, 'R')).toBe(undefined);
  });
});
