import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HSRCalc } from './pages/hsrCalc';
import { Help } from './pages/help';
import { Suspense } from 'react';
import { BonusSetManager } from './pages/bonusSetManager';

const root = document.getElementById('root');

if (!root) {
  throw new Error('root not found');
}

const container = createRoot(root);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to='/hsrCalc' />
      },
      {
        path: '/help',
        element: <Suspense fallback={'Loading...'}><Help /></Suspense>
      },
      {
        path: '/bonusManager',
        element: <Suspense fallback={'Loading...'}><BonusSetManager /></Suspense>
      },
      {
        path: '/hsrCalc',
        element: <Suspense fallback={'Loading...'}><HSRCalc /></Suspense>
      },
      {
        path: '*',
        element: <Navigate to='/hsrCalc' replace={true} />
      }
    ]
  },
], {basename: '/hsrExpressCalc'}
);

container.render(<RouterProvider router={router} />);
