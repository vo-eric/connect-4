import express from 'express';
import ViteExpress from 'vite-express';
import ConnectFourAPI from './api/connectFour';

const app = express();

app.get('/message', (_, res) => res.send('Hello from express!'));

app.post('/game', async (req, res) => {
  const connectFour = new ConnectFourAPI();
  const newGame = await connectFour.createGame();
  res.json(newGame);
});

ViteExpress.listen(app, 3000, () => console.log('Server is listening...'));
