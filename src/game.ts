/*


State:
  Current player
  Game board/state


*/

export type Player = 'R' | 'B';
export type Cell = Player | null;
export type Board = Cell[][];
export type Winner = Player | undefined;
export type Game = {
  board: Board;
  currentPlayer: Player;
  hasWinner?: Winner;
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

  // console.log('updated', newBoard);

  return {
    board: newBoard,
    currentPlayer: determinePlayer(currentPlayer),
  };
};
