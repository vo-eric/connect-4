import { initializeGame, move as makeMove, type Game } from '../src/game';

export interface ConnectFourAPIInterface {
  createGame: () => Promise<Game>;
  move: (gameId: string, column: number) => Promise<Game>;
  getGame: (gameId: string) => Promise<Game>;
}

export default class ConnectFourAPI implements ConnectFourAPIInterface {
  private matches: Map<string, Game> = new Map();

  async createGame() {
    const newGame = initializeGame();
    this.matches.set(newGame.id, newGame);
    return newGame;
  }

  async getGame(gameId: string) {
    const game = this.matches.get(gameId);

    if (!game) {
      throw new Error('Game not found');
    }

    return game;
  }

  async move(gameId: string, column: number) {
    const game = await this.getGame(gameId);

    return makeMove(game.id, game.board, column, game.currentPlayer);
  }
}
