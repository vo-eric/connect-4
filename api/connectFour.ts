import { initializeGame, move as makeMove, type Game } from '../src/game';

export interface ConnectFourAPIInterface {
  createGame: () => Promise<Game>;
  move: (gameId: string, column: number) => Promise<Game>;
  getGame: (gameId: string) => Promise<Game>;
  getUnfinishedGames: () => Promise<Game[]>;
  getFinishedGames: () => Promise<Game[]>;
}
export class ConnectFourAPI implements ConnectFourAPIInterface {
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

    const updatedGame = makeMove(
      game.id,
      game.board,
      column,
      game.currentPlayer
    );
    this.matches.set(gameId, updatedGame);

    return updatedGame;
  }

  async getFinishedGames() {
    const allGames = Array.from(this.matches.values());
    const finishedGames = allGames.filter((game) => !!game.winningPlayer);
    return finishedGames;
  }

  async getUnfinishedGames() {
    const allGames = Array.from(this.matches.values());
    const getUnfinishedGames = allGames.filter((game) => !game.winningPlayer);
    return getUnfinishedGames;
  }
}

export class ConnectFourClientAPI implements ConnectFourAPIInterface {
  async createGame() {
    const response = await fetch('/api/game', {
      method: 'POST',
    });

    if (!response.ok) {
      return;
    }

    return await response.json();
  }

  async getGame(gameId: string) {
    const response = await fetch(`/api/game/${gameId}`);
    const game = await response.json();
    return game;
  }

  async move(gameId: string, column: number) {
    const response = await fetch(`/api/game/${gameId}/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        column,
      }),
    });
    const newGameState = await response.json();
    return newGameState;
  }

  async getFinishedGames() {
    const response = await fetch(`/api/games?finished=true`);
    const games = await response.json();
    return games;
  }

  async getUnfinishedGames() {
    const response = await fetch(`/api/games?finished=false`);
    const games = await response.json();
    return games;
  }
}
