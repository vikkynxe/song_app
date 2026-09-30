/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { PlayerProvider } from './context/PlayerContext';
import LogIn from './pages/log_in';
import CreateAccount from './pages/CreateAccount';
import HomePage from './pages/HomePage';
import MusicPlayerFromapp from './pages/MusicPlayerFromapp';

const AppContent: React.FC = () => {
  const { path } = useRouter();

  // Normalize path without trailing slash (unless root)
  const normalizedPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

  switch (normalizedPath) {
    case '/create_account':
      return <CreateAccount />;

    case '/HomePage':
      return <HomePage />;

    case '/AudioPlayer':
      return <MusicPlayerFromapp />;

    case '/':
    default:
      return <LogIn />;
  }
};

export default function App() {
  return (
    <RouterProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </RouterProvider>
  );
}
