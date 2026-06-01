/**
 * Application Router
 * 
 * Defines routing architecture, wrapping dynamically imported components
 * in React.Suspense to strictly enforce the chunk limits.
 */
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { RootLayout } from '../components/layout/RootLayout';

// Tier 3 components must be lazily imported
const Home = lazy(() => import('../pages/Home'));

// Fallback skeleton loader for Suspense bounds
import PageSkeleton from '../components/PageSkeleton';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// The explore route is Tier 2 so it can be eagerly imported or lazy loaded, let's eager load here to diversify bundles
import Explore from '../pages/Explore';
import Artists from '../pages/Artists';
import ArtistProfile from '../pages/ArtistProfile';
import Curated from '../pages/Curated';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Profile from '../pages/Profile';

// Tier 3 Details Page
const ImmersiveDetail = lazy(() => import('../pages/artwork/ImmersiveDetail'));

// Global 404/Error Catch
import ErrorPage from '../pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'explore',
        element: <Explore />
      },
      {
        path: 'artwork/:id',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <ImmersiveDetail />
          </Suspense>
        )
      },
      // Real Routes
      {
        path: 'artists',
        element: <Artists />
      },
      {
        path: 'artists/:id',
        element: <ArtistProfile />
      },
      {
        path: 'curated',
        element: <Curated />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'admin',
        element: <AdminDashboard />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
