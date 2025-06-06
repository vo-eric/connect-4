import { test, assert, describe, expect } from 'vitest';
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
    const newGameState = move(game.id, game.board, 2, 'B');

    assert.deepEqual(newGameState, {
      id: game.id,
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
    let game: Omit<Game, 'redWins' | 'blackWins'> = initializeGame();
    game = move(game.id, game.board, 2, 'B');
    game = move(game.id, game.board, 2, 'R');

    assert.deepEqual(game, {
      id: game.id,
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
    let game: Omit<Game, 'redWins' | 'blackWins'> = initializeGame();
    game.board = [
      [null, null, 'R', null, null, null, null],
      [null, null, 'B', null, null, null, null],
      [null, null, 'R', null, null, null, null],
      [null, null, 'B', null, null, null, null],
      [null, null, 'R', null, null, null, null],
      [null, null, 'B', null, null, null, null],
    ];
    game = move(game.id, game.board, 2, 'B');

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
    let game: Omit<Game, 'redWins' | 'blackWins'> = initializeGame();
    game = move(game.id, game.board, -1, 'B');

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
});

test('a player cannot place out of bounds', () => {
  let game: Omit<Game, 'redWins' | 'blackWins'> = initializeGame();
  game = move(game.id, game.board, 8, 'B');

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

  const winningGame = move(game.id, game.board, 0, 'B');

  assert.deepEqual(winningGame, {
    id: game.id,
    board: [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['B', null, null, null, null, null, null],
      ['B', null, null, null, null, null, null],
      ['B', 'R', null, null, null, null, null],
      ['B', 'R', 'B', 'R', null, null, null],
    ],
    currentPlayer: 'B',
    winningPlayer: 'B',
  });
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

  const winningGame = move(game.id, game.board, 3, 'B');

  assert.deepEqual(winningGame, {
    id: game.id,
    board: [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
      ['B', null, null, null, null, null, null],
      ['B', 'R', null, null, null, null, null],
      ['B', 'B', 'B', 'B', null, null, null],
    ],
    currentPlayer: 'B',
    winningPlayer: 'B',
  });
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

  const winningGame = move(game.id, game.board, 3, 'R');

  assert.deepEqual(winningGame, {
    id: game.id,
    board: [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['R', null, null, null, null, null, null],
      ['B', 'R', null, null, null, null, null],
      ['B', 'R', 'R', null, null, null, null],
      ['B', 'B', 'B', 'R', null, null, null],
    ],
    currentPlayer: 'R',
    winningPlayer: 'R',
  });
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
