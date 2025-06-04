import express from 'express';
import ViteExpress from 'vite-express';
import ConnectFourAPI from './api/connectFour';

const app = express();
const connectFour = new ConnectFourAPI();

app.get('/api/games/:id', async (req, res) => {
  const game = await connectFour.getGame(req.params.id);
  return res.json(game);
});

app.post('/api/game', async (req, res) => {
  const newGame = await connectFour.createGame();
  res.json(newGame);
});

ViteExpress.listen(app, 3000, () => console.log('Server is listening...'));
