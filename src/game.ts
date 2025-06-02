/*


State:
  Current player
  Game board/state


*/

export type Player = 'red' | 'black';
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
    currentPlayer: 'black',
  };
};
