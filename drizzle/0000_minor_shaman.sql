CREATE TYPE "public"."player" AS ENUM('B', 'R');--> statement-breakpoint
CREATE TYPE "public"."winner" AS ENUM('R', 'B', 'tie');--> statement-breakpoint
CREATE TABLE "tic_tac_toe_games" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"board" jsonb NOT NULL,
	"current_player" "player" NOT NULL,
	"winning_player" "player"
);
