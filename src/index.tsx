import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HSRCalc } from './pages/hsrCalc';
import { About } from './pages/about';
import { Suspense } from 'react';

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
        path: '/about',
        element: <Suspense fallback={'Loading...'}><About /></Suspense>
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
]);

container.render(<RouterProvider router={router} />);