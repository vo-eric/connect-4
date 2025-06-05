import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import GameView from './GameView.tsx';
import GamesList from './GamesList.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ConnectFourClientAPI } from '../api/connectFour';

const api = new ConnectFourClientAPI();

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  {
    path: '/games',
    Component: GamesList,
    loader: async () => {
      const finishedGames = await api.getFinishedGames();
      const unfinishedGames = await api.getUnfinishedGames();

      return { finishedGames, unfinishedGames };
    },
  },
  {
    path: '/games/:gameId',
    loader: async ({ params }) => {
      if (!params.gameId) {
        throw new Error('Game ID is required.');
      }

      const game = await api.getGame(params.gameId);
      return { game };
    },
    Component: GameView,
  },
  /*

  {
    path: "/teams/:teamId",
    loader: async ({ params }) => {
      let team = await fetchTeam(params.teamId);
      return { name: team.name };
    },
    Component: Team,
  },

  */
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
