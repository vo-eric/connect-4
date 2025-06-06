import { initializeGame, move as makeMove, type Game } from '../src/game';

export interface ConnectFourAPIInterface {
  createGame: () => Promise<Game>;
  move: (gameId: string, column: number) => Promise<Game>;
  getGame: (gameId: string) => Promise<Game>;
  getUnfinishedGames: () => Promise<Game[]>;
  getFinishedGames: () => Promise<Game[]>;
  updateScore: (gameId: string) => Promise<Game>;
  restartGame: (gameId: string) => Promise<Game>;
}
export class ConnectFourAPI implements ConnectFourAPIInterface {
  private matches: Map<string, Game> = new Map();

  async createGame(): Promise<Game> {
    const newGame = initializeGame();
    this.matches.set(newGame.id, newGame);
    return newGame;
  }

  async getGame(gameId: string): Promise<Game> {
    const game = this.matches.get(gameId);

    if (!game) {
      throw new Error('Game not found');
    }

    return game;
  }

  async move(gameId: string, column: number): Promise<Game> {
    const game = await this.getGame(gameId);

    const updatedGame = makeMove(
      game.id,
      game.board,
      column,
      game.currentPlayer
    );

    this.matches.set(gameId, {
      ...updatedGame,
      blackWins: game.blackWins,
      redWins: game.redWins,
    });

    return { ...updatedGame, blackWins: game.blackWins, redWins: game.redWins };
  }

  async getFinishedGames(): Promise<Game[]> {
    const allGames = Array.from(this.matches.values());
    const finishedGames = allGames.filter((game) => !!game.winningPlayer);
    return finishedGames;
  }

  async getUnfinishedGames(): Promise<Game[]> {
    const allGames = Array.from(this.matches.values());
    const getUnfinishedGames = allGames.filter((game) => !game.winningPlayer);
    return getUnfinishedGames;
  }

  async updateScore(gameId: string): Promise<Game> {
    const game = this.matches.get(gameId);

    if (!game) {
      throw new Error('Game not found');
    }

    const { winningPlayer } = game;

    if (winningPlayer === 'R') {
      game.redWins++;
    } else if (winningPlayer === 'B') {
      game.blackWins++;
    }

    return game;
  }

  async restartGame(gameId: string): Promise<Game> {
    const game = initializeGame();
    const newGame = { ...game, id: gameId };

    this.matches.set(gameId, newGame);
    return newGame;
  }
}

const BASE_URL: string = process.env.SERVER_URL || 'localhost:3000';
export class ConnectFourClientAPI implements ConnectFourAPIInterface {
  async createGame() {
    const response = await fetch(`${BASE_URL}/api/game`, {
      method: 'POST',
    });

    if (!response.ok) {
      return;
    }

    return await response.json();
  }

  async getGame(gameId: string) {
    const response = await fetch(`${BASE_URL}/api/game/${gameId}`);
    const game = await response.json();
    return game;
  }

  async move(gameId: string, column: number) {
    const response = await fetch(`${BASE_URL}/api/game/${gameId}/move`, {
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
    const response = await fetch(`${BASE_URL}/api/games?finished=true`);
    const games = await response.json();
    return games;
  }

  async getUnfinishedGames() {
    const response = await fetch(`${BASE_URL}/api/games?finished=false`);
    const games = await response.json();
    return games;
  }

  async updateScore(gameId: string): Promise<Game> {
    const game = await this.getGame(gameId);

    const response = await fetch(`${BASE_URL}/api/game/${gameId}/updateScore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        winner: game.winningPlayer,
      }),
    });

    const updatedGame = await response.json();
    return updatedGame;
  }

  async restartGame(gameId: string): Promise<Game> {
    const response = await fetch(`${BASE_URL}/api/game/${gameId}/restart`);
    const newGame = await response.json();
    return newGame;
  }
}
