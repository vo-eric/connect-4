import { jsonb, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import type { Board } from '../game';

export const playerEnum = pgEnum('player', ['B', 'R']);
export const winnerEnum = pgEnum('winner', ['R', 'B', 'tie']);

export const gamesTable = pgTable('game', {
  id: varchar({ length: 255 }).primaryKey(),
  board: jsonb().$type<Board>().notNull(),
  currentPlayer: playerEnum('current_player').notNull(),
  winningPlayer: winnerEnum('winning_player'),
});
