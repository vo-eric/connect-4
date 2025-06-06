import express from 'express';
// import ViteExpress from 'vite-express';
import { ConnectFourDbAPI } from './src/db/db';
import { Server } from 'socket.io';
import cors from 'cors';
import {
  PLAYER_CONNECTED,
  PLAYER_JOINED,
  PLAYER_MOVED,
  REQUEST_GAME_RESTART,
  RESTART_GAME,
} from './socketEvents';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
  })
);
const connectFour = new ConnectFourDbAPI();

app.get('/api/game/:id', async (req, res) => {
  const game = await connectFour.getGame(req.params.id);
  return res.json(game);
});

app.get('/api/games', async (req, res) => {
  if (req.query.finished === 'true') {
    const games = await connectFour.getFinishedGames();
    return res.json(games);
  } else {
    const games = await connectFour.getUnfinishedGames();
    return res.json(games);
  }
});

app.post('/api/game', async (_, res) => {
  const newGame = await connectFour.createGame();
  return res.json(newGame);
});

app.post('/api/game/:id/move', async (req, res) => {
  const updatedGame = await connectFour.move(req.params.id, req.body.column);

  io.to(getRoomId(updatedGame)).emit(PLAYER_MOVED, updatedGame);
  return res.json(updatedGame);
});

app.post('/api/game/:id/updateScore', async (req, res) => {
  const updatedGame = await connectFour.updateScore(req.params.id);
  return res.json(updatedGame);
});

app.get('/api/game/:id/restart', async (req, res) => {
  const game = await connectFour.restartGame(req.params.id);
  return res.json(game);
});

const PORT = parseInt(process.env.PORT || '3000');

const server = app.listen(PORT, () =>
  console.log(`Server is listening at http://localhost:${PORT}`)
);

const getRoomId = (game) => `game-${game.id}`;

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  const handleConnection = async (gameId: string) => {
    const game = await connectFour.getGame(gameId);

    if (!game) {
      throw new Error(`Game ${gameId} was not found`);
    }

    const roomId = getRoomId(game);
    socket.join(roomId);
    const sockets = await io.in(roomId).fetchSockets();
    const ids = sockets.map((socket) => socket.id);
    io.to(roomId).emit(PLAYER_JOINED, ids);
  };

  const handleRestart = async (gameId: string) => {
    const newGame = await connectFour.restartGame(gameId);
    const roomId = getRoomId(newGame);
    io.to(roomId).emit(RESTART_GAME, newGame);
  };

  socket.on(PLAYER_CONNECTED, handleConnection);

  socket.on(REQUEST_GAME_RESTART, handleRestart);

  socket.on('disconnect', () => {
    socket.off(PLAYER_CONNECTED, handleConnection);
  });
});
