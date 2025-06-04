CREATE TABLE "game" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"board" jsonb NOT NULL,
	"current_player" "player" NOT NULL,
	"winning_player" "player"
);