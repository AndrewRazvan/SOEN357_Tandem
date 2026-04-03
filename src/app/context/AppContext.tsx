import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type User = 'alex' | 'jamie';

export interface Task {
  id: string;
  name: string;
  description?: string;
  ratings: {
    alex?: number;
    jamie?: number;
  };
  agreedBurden?: number;
  assignedTo?: User;
  status: 'rating-alex' | 'rating-jamie' | 'reveal' | 'agreement' | 'assigned' | 'complete';
  createdAt: string;
}

interface AppContextType {
  currentUser: User;
  tasks: Task[];
  switchUser: (user: User) => void;
  addTask: (name: string, description?: string) => string;
  rateTask: (taskId: string, user: User, rating: number) => void;
  assignTask: (taskId: string, assignedTo: User, agreedBurden: number) => void;
  completeTask: (taskId: string) => void;
  getTask: (taskId: string) => Task | undefined;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const initialTasks: Task[] = [
  {
    id: '1',
    name: 'Weekly groceries',
    description: "Trader Joe's run — produce, staples, and snacks",
    ratings: { alex: 3, jamie: 4 },
    agreedBurden: 3,
    assignedTo: 'alex',
    status: 'assigned',
    createdAt: '2026-03-29',
  },
  {
    id: '2',
    name: 'Deep clean bathroom',
    description: 'Scrub, disinfect, and restock supplies',
    ratings: { alex: 5, jamie: 3 },
    agreedBurden: 4,
    assignedTo: 'jamie',
    status: 'assigned',
    createdAt: '2026-03-28',
  },
  {
    id: '3',
    name: 'Schedule HVAC service',
    description: 'Annual maintenance — need to book in advance',
    ratings: { alex: 2, jamie: 3 },
    agreedBurden: 2,
    assignedTo: 'alex',
    status: 'assigned',
    createdAt: '2026-03-27',
  },
  {
    id: '4',
    name: 'Pay utility bills',
    description: 'Electric and water for March',
    ratings: { alex: 2, jamie: 2 },
    agreedBurden: 2,
    assignedTo: 'alex',
    status: 'complete',
    createdAt: '2026-03-25',
  },
  {
    id: '5',
    name: 'Take out recycling',
    description: '',
    ratings: { alex: 1, jamie: 1 },
    agreedBurden: 1,
    assignedTo: 'jamie',
    status: 'complete',
    createdAt: '2026-03-24',
  },
  {
    id: '6',
    name: 'Vacuum living room',
    description: '',
    ratings: { alex: 2, jamie: 3 },
    agreedBurden: 3,
    assignedTo: 'jamie',
    status: 'complete',
    createdAt: '2026-03-23',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>('alex');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const switchUser = (user: User) => setCurrentUser(user);

  const addTask = (name: string, description?: string): string => {
    const id = Date.now().toString();
    const newTask: Task = {
      id,
      name,
      description,
      ratings: {},
      status: 'rating-alex',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    return id;
  };

  const rateTask = (taskId: string, user: User, rating: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedRatings = { ...t.ratings, [user]: rating };
        const nextStatus: Task['status'] =
          user === 'alex'
            ? 'rating-jamie'
            : t.ratings.alex !== undefined
            ? 'reveal'
            : 'rating-jamie';
        return { ...t, ratings: updatedRatings, status: nextStatus };
      })
    );
  };

  const assignTask = (taskId: string, assignedTo: User, agreedBurden: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, assignedTo, agreedBurden, status: 'assigned' } : t
      )
    );
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'complete' } : t))
    );
  };

  const getTask = (taskId: string) => tasks.find((t) => t.id === taskId);

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        tasks,
        switchUser,
        addTask,
        rateTask,
        assignTask,
        completeTask,
        getTask,
        updateTaskStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function getUserLabel(user: User): string {
  try {
    const stored = localStorage.getItem('tandem_user_names');
    if (stored) {
      const names = JSON.parse(stored) as Record<string, string>;
      if (names[user]) return names[user];
    }
  } catch {}
  return user === 'alex' ? 'Alex' : 'Jamie';
}

export function getOtherUser(user: User): User {
  return user === 'alex' ? 'jamie' : 'alex';
}
