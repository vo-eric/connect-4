/*


State:
  Current player
  Game board/state
*/

export type Player = 'R' | 'B';
export type Cell = Player | null;
export type Board = Cell[][];
export type Winner = Player | 'tie' | undefined;
export type Game = {
  board: Board;
  currentPlayer: Player;
  winningPlayer?: Winner;
};

export const initializeGame = (): Game => {
  const newBoard = new Array(6).fill(0).map(() => new Array(7).fill(null));

  return {
    board: newBoard,
    currentPlayer: 'B',
  };
};

export const determinePlayer = (currentPlayer: Player): Player => {
  return currentPlayer === 'B' ? 'R' : 'B';
};

/*
move(board): Board 
Select a column
From there, go down rows (starting at 0) until the next row is either the bottom or is NOT null
  If that is satisfied, set the current cell to the current player
*/

export const move = (
  board: Board,
  column: number,
  currentPlayer: Player
): Game => {
  const newBoard = structuredClone(board);

  //exceptions
  if (
    column < 0 ||
    column >= newBoard[0].length ||
    newBoard[0][column] !== null
  ) {
    return { board, currentPlayer };
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
      board: newBoard,
      currentPlayer,
      winningPlayer: currentPlayer,
    };
  }

  if (!hasWinner && newBoard.flat().every((cell) => cell !== null)) {
    return {
      board: newBoard,
      currentPlayer,
      winningPlayer: 'tie',
    };
  }

  return {
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
    direction: [number, number] //
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
