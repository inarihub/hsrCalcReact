import {createRoot} from 'react-dom/client';
import {App} from './components/App';
import {
    RouterProvider,
    createBrowserRouter
} from 'react-router-dom';
import {Shop} from './pages/shop';
import {About} from './pages/about';
import { Suspense } from 'react';

const root = document.getElementById('root');

if(!root) {
    throw new Error('root not found');
}

const container = createRoot(root);

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
            path: '/about',
            element: <Suspense fallback={'Loading...'}><About /></Suspense>
        },
        {
            path: '/store',
            element: <Suspense fallback={'Loading...'}><Shop /></Suspense>
        }
      ]
    },
  ]);

container.render(<RouterProvider router={router} />);