import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root.tsx';
import { IndexGate } from './pages/IndexGate.tsx';
import { CreateTask } from './pages/CreateTask.tsx';
import { PrivateRating } from './pages/PrivateRating.tsx';
import { Reveal } from './pages/Reveal.tsx';
import { Agreement } from './pages/Agreement.tsx';
import { TaskDetail } from './pages/TaskDetail.tsx';
import { Welcome } from './pages/Welcome.tsx';

// Primary flow: create → rate (Alex) → rate (Jamie) → reveal → agree/assign → task detail.
export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: IndexGate },
      { path: 'welcome', Component: Welcome },
      { path: 'create', Component: CreateTask },
      { path: 'rate/:taskId/:user', Component: PrivateRating },
      { path: 'reveal/:taskId', Component: Reveal },
      { path: 'agree/:taskId', Component: Agreement },
      { path: 'task/:taskId', Component: TaskDetail },
    ],
  },
]);
