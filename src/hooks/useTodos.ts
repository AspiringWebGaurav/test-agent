// src/hooks/useTodos.ts
import useSWR, { mutate } from 'swr';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Todo } from '@/types';
import { useEffect, useCallback } from 'react';

/**
 * Fetcher function for SWR
 */
const todosFetcher = async (path: string): Promise<Todo[]> => {
  return new Promise((resolve, reject) => {
    const [, uid] = path.split('/');
    const todosQuery = query(
      collection(db, 'users', uid, 'todos'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      todosQuery,
      (snapshot) => {
        const todos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Todo[];
        resolve(todos);
      },
      (error) => {
        console.error('Error fetching todos:', error);
        reject(error);
      }
    );

    // Return unsubscribe function for cleanup
    return unsubscribe;
  });
};

/**
 * Main hook for Todo operations with SWR
 */
export function useTodos() {
  const { user } = useAuth();
  
  const swrKey = user ? `users/${user.uid}/todos` : null;
  
  const { data: todos, error, mutate: mutateTodos } = useSWR<Todo[]>(
    swrKey,
    todosFetcher,
    {
      refreshInterval: 30000, // Poll every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    }
  );

  // Create a new todo
  const createTodo = useCallback(async (todoData: {
    title: string;
    notes?: string;
    dueAt?: Date;
  }) => {
    if (!user) throw new Error('User not authenticated');

    // Generate a unique ID for the todo
    const todoId = `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newTodo: any = {
      id: todoId,
      title: todoData.title.trim(),
      isCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Only add optional fields if they have values
    if (todoData.notes?.trim()) {
      newTodo.notes = todoData.notes.trim();
    }
    
    if (todoData.dueAt) {
      newTodo.dueAt = Timestamp.fromDate(todoData.dueAt);
    }

    const cleanTodo = newTodo;

    try {
      // Use setDoc with the generated ID instead of addDoc
      const { setDoc } = await import('firebase/firestore');
      await setDoc(
        doc(db, 'users', user.uid, 'todos', todoId),
        cleanTodo
      );
      
      // Optimistically update the cache
      mutateTodos();
      
      return todoId;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }, [user, mutateTodos]);

  // Update a todo
  const updateTodo = useCallback(async (todoId: string, updates: Partial<Todo>) => {
    if (!user) throw new Error('User not authenticated');

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    // Remove undefined values and id field
    const { id, createdAt, ...cleanUpdates } = updateData;
    const filteredUpdates = Object.fromEntries(
      Object.entries(cleanUpdates).filter(([_, value]) => value !== undefined)
    );

    try {
      await updateDoc(
        doc(db, 'users', user.uid, 'todos', todoId),
        filteredUpdates
      );
      
      // Optimistically update the cache
      mutateTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }, [user, mutateTodos]);

  // Delete a todo
  const deleteTodo = useCallback(async (todoId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'todos', todoId));
      
      // Optimistically update the cache
      mutateTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }, [user, mutateTodos]);

  // Toggle todo completion
  const toggleTodo = useCallback(async (todoId: string, isCompleted: boolean) => {
    await updateTodo(todoId, { isCompleted });
  }, [updateTodo]);

  // Snooze a todo (add 30 minutes to due date)
  const snoozeTodo = useCallback(async (todoId: string, currentDueAt?: Timestamp) => {
    const baseTime = currentDueAt ? currentDueAt.toMillis() : Date.now();
    const snoozeTime = baseTime + (30 * 60 * 1000); // 30 minutes
    const newDueAt = Timestamp.fromMillis(snoozeTime);
    
    await updateTodo(todoId, { dueAt: newDueAt });
  }, [updateTodo]);

  return {
    todos: todos || [],
    loading: !error && !todos,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    snoozeTodo,
    mutate: mutateTodos,
  };
}

/**
 * Hook for getting overdue todos count (for notifications)
 */
export function useOverdueTodosCount() {
  const { todos } = useTodos();
  
  const overdueCount = todos.filter(todo => {
    if (todo.isCompleted || !todo.dueAt) return false;
    return Date.now() > todo.dueAt.toMillis();
  }).length;

  return overdueCount;
}

/**
 * Hook for getting overdue todos (for notifications panel)
 */
export function useOverdueTodos() {
  const { todos, ...rest } = useTodos();
  
  const overdueTodos = todos.filter(todo => {
    if (todo.isCompleted || !todo.dueAt) return false;
    return Date.now() > todo.dueAt.toMillis();
  });

  return {
    overdueTodos,
    ...rest,
  };
}