import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { CreateTask } from './pages/CreateTask.tsx';
import { PrivateRating } from './pages/PrivateRating.tsx';
import { Reveal } from './pages/Reveal.tsx';
import { Agreement } from './pages/Agreement.tsx';
import { TaskDetail } from './pages/TaskDetail.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: 'create', Component: CreateTask },
      { path: 'rate/:taskId/:user', Component: PrivateRating },
      { path: 'reveal/:taskId', Component: Reveal },
      { path: 'agree/:taskId', Component: Agreement },
      { path: 'task/:taskId', Component: TaskDetail },
    ],
  },
]);
