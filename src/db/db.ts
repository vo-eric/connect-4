import { drizzle } from 'drizzle-orm/postgres-js';
import type { ConnectFourAPIInterface } from '../../api/connectFour';
import { initializeGame, move, type Game } from '../game';
import { gamesTable } from './schema';
import { eq, isNotNull, isNull } from 'drizzle-orm';

export class ConnectFourDbAPI implements ConnectFourAPIInterface {
  private db = drizzle(process.env.DATABASE_URL!);

  async createGame(): Promise<Game> {
    const game = await initializeGame();
    const { id, board, currentPlayer } = game;

    await this.db.insert(gamesTable).values({
      id,
      board,
      currentPlayer,
    });

    return game;
  }

  async getGame(gameId: string): Promise<Game> {
    const game = await this.db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.id, gameId));

    return game[0];
  }

  async move(gameId: string, column: number): Promise<Game> {
    const [game] = await this.db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.id, gameId));

    const updatedGame = await move(game, column);

    await this.db
      .update(gamesTable)
      .set({
        board: updatedGame.board,
        currentPlayer: updatedGame.currentPlayer,
        winningPlayer: updatedGame.winningPlayer,
        redWins: updatedGame.redWins,
        blackWins: updatedGame.blackWins,
      })
      .where(eq(gamesTable.id, gameId));

    return updatedGame;
  }

  async getUnfinishedGames(): Promise<Game[]> {
    try {
      const games = await this.db
        .select()
        .from(gamesTable)
        .where(isNull(gamesTable.winningPlayer));

      return games;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getFinishedGames(): Promise<Game[]> {
    try {
      const games = await this.db
        .select()
        .from(gamesTable)
        .where(isNotNull(gamesTable.winningPlayer));

      return games;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async restartGame(gameId: string): Promise<Game> {
    const existingGame = await this.getGame(gameId);
    const newGame = await initializeGame();

    const game = {
      id: gameId,
      board: newGame.board,
      winningPlayer: newGame.winningPlayer,
      currentPlayer: newGame.currentPlayer,
      redWins: existingGame.redWins,
      blackWins: existingGame.blackWins,
    };

    await this.db
      .update(gamesTable)
      .set({
        board: newGame.board,
        winningPlayer: null,
        currentPlayer: newGame.currentPlayer,
        redWins: existingGame.redWins,
        blackWins: existingGame.blackWins,
      })
      .where(eq(gamesTable.id, gameId));

    return game;
  }
}
