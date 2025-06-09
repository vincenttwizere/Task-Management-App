import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Real-time tasks listener
export const subscribeToTasks = (userId, callback) => {
  const q = query(
    collection(db, 'tasks'),
    where('assignedTo', '==', userId),
    orderBy('dueDate', 'asc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const tasks = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tasks.push({ 
        id: doc.id, 
        ...data,
        dueDate: data.dueDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        completedAt: data.completedAt?.toDate()
      });
    });
    callback(tasks);
  });
};

// Real-time tasks by project listener
export const subscribeToProjectTasks = (projectId, callback) => {
  const q = query(
    collection(db, 'tasks'),
    where('projectId', '==', projectId),
    orderBy('dueDate', 'asc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const tasks = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tasks.push({ 
        id: doc.id, 
        ...data,
        dueDate: data.dueDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        completedAt: data.completedAt?.toDate()
      });
    });
    callback(tasks);
  });
};

// Create a new task
export const createTask = async (taskData, userId) => {
  try {
    const task = {
      ...taskData,
      createdBy: userId,
      status: taskData.status || 'todo',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      completedAt: null
    };

    const docRef = await addDoc(collection(db, 'tasks'), task);
    return { id: docRef.id, ...task };
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update a task
export const updateTask = async (taskId, updates) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Mark task as completed/incomplete
export const toggleTaskStatus = async (taskId, completed) => {
  try {
    const updates = {
      completed,
      completedAt: completed ? serverTimestamp() : null,
      status: completed ? 'completed' : 'todo'
    };
    
    await updateTask(taskId, updates);
  } catch (error) {
    console.error('Error toggling task status:', error);
    throw error;
  }
};

// Get task by ID
export const getTask = async (taskId) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    const taskDoc = await getDoc(taskRef);
    
    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }

    const data = taskDoc.data();
    return {
      id: taskDoc.id,
      ...data,
      dueDate: data.dueDate?.toDate(),
      createdAt: data.createdAt?.toDate(),
      completedAt: data.completedAt?.toDate()
    };
  } catch (error) {
    console.error('Error getting task:', error);
    throw error;
  }
}; 