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
    const game = await this.db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.id, gameId));

    const { id, board, currentPlayer } = game[0];

    const updatedGame = await move(id, board, column, currentPlayer);

    await this.db
      .update(gamesTable)
      .set({
        id: updatedGame.id,
        board: updatedGame.board,
        currentPlayer: updatedGame.currentPlayer,
        winningPlayer: updatedGame.winningPlayer,
      })
      .where(eq(gamesTable.id, gameId));

    return updatedGame;
  }

  async getUnfinishedGames(): Promise<Game[]> {
    const games = await this.db
      .select()
      .from(gamesTable)
      .where(isNull(gamesTable.winningPlayer));

    return games;
  }

  async getFinishedGames(): Promise<Game[]> {
    const games = await this.db
      .select()
      .from(gamesTable)
      .where(isNotNull(gamesTable.winningPlayer));

    return games;
  }
}
