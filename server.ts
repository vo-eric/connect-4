import express from 'express';
import ViteExpress from 'vite-express';
import { ConnectFourDbAPI } from './src/db/db';

const app = express();
app.use(express.json());
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

  return res.json(updatedGame);
});

ViteExpress.listen(app, 3000, () => console.log('Server is listening...'));
