import { useState, useEffect } from 'react';
import { Task } from '../types';
import { subscribeToTasks, createTask, updateTask, deleteTask } from '../services/tasks';
import { useAuth } from './useAuth';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToTasks(user.id, (newTasks) => {
      setTasks(newTasks);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
  };
}