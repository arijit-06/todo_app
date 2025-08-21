import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Task } from '../types';

const COLLECTION_NAME = 'tasks';

const convertDeadline = (deadline?: Date) => {
  return deadline ? Timestamp.fromDate(deadline) : null;
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const now = Timestamp.now();
    return await addDoc(collection(db, COLLECTION_NAME), {
      ...task,
      createdAt: now,
      updatedAt: now,
      deadline: convertDeadline(task.deadline),
    });
  } catch (error) {
    throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  try {
    const taskRef = doc(db, COLLECTION_NAME, taskId);
    return await updateDoc(taskRef, {
      ...updates,
      updatedAt: Timestamp.now(),
      deadline: convertDeadline(updates.deadline),
    });
  } catch (error) {
    throw new Error(`Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const taskRef = doc(db, COLLECTION_NAME, taskId);
    return await deleteDoc(taskRef);
  } catch (error) {
    throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const subscribeToTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          deadline: data.deadline?.toDate(),
        } as Task;
      });
      callback(tasks);
    });
  } catch (error) {
    throw new Error(`Failed to subscribe to tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
