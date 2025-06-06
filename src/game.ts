export type Player = 'R' | 'B';
export type Cell = Player | null;
export type Board = Cell[][];
export type Winner = Player | 'tie' | undefined | null;
export type Game = {
  id: string;
  board: Board;
  currentPlayer: Player;
  winningPlayer?: Winner;
  blackWins: number;
  redWins: number;
};

export const initializeGame = (): Game => {
  const newBoard = new Array(6).fill(0).map(() => new Array(7).fill(null));

  return {
    id: crypto.randomUUID(),
    board: newBoard,
    currentPlayer: 'B',
    blackWins: 0,
    redWins: 0,
  };
};

export const determinePlayer = (currentPlayer: Player): Player => {
  return currentPlayer === 'B' ? 'R' : 'B';
};

export const move = (
  id: string,
  board: Board,
  column: number,
  currentPlayer: Player
): Omit<Game, 'blackWins' | 'redWins'> => {
  const newBoard = structuredClone(board);

  if (
    column < 0 ||
    column >= newBoard[0].length ||
    newBoard[0][column] !== null
  ) {
    return { id, board, currentPlayer };
  }

  for (let row = 0; row <= newBoard.length - 1; row++) {
    if (row === newBoard.length - 1 || newBoard[row + 1][column] !== null) {
      newBoard[row][column] = currentPlayer;
      break;
    }
  }

  const hasWinner = determineWinner(newBoard, currentPlayer);

  if (hasWinner) {
    return {
      id,
      board: newBoard,
      currentPlayer,
      winningPlayer: currentPlayer,
    };
  }

  if (!hasWinner && newBoard.flat().every((cell) => cell !== null)) {
    return {
      id,
      board: newBoard,
      currentPlayer,
      winningPlayer: 'tie',
    };
  }

  return {
    id,
    board: newBoard,
    currentPlayer: determinePlayer(currentPlayer),
  };
};

export const determineWinner = (
  board: Board,
  currentPlayer: Player
): Player | undefined => {
  const countMatches = (
    row: number,
    col: number,
    direction: [number, number]
  ): number => {
    if (
      row < 0 ||
      row >= board.length ||
      col < 0 ||
      col >= board[0].length ||
      board[row][col] !== currentPlayer ||
      board[row][col] === null
    ) {
      return 0;
    }

    return 1 + countMatches(row + direction[1], col + direction[0], direction);
  };

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (board[row][col] === currentPlayer) {
        const rightCount = countMatches(row, col, [0, 1]);
        const downCount = countMatches(row, col, [1, 0]);
        const bottomRightDiagonalCount = countMatches(row, col, [1, 1]);
        const topRightDiagonalCount = countMatches(row, col, [-1, 1]);

        if (
          rightCount === 4 ||
          downCount === 4 ||
          bottomRightDiagonalCount === 4 ||
          topRightDiagonalCount === 4
        ) {
          return currentPlayer;
        }
      }
    }
  }

  return undefined;
};
