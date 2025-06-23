import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  writeBatch,
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Check if we're using mock Firestore
const isMockDb = !db.collection || typeof db.collection !== 'function';

// Mock notifications for development
let mockNotifications = [
  {
    id: 'mock-1',
    userId: 'mock-user',
    type: 'task_assignment',
    title: 'New Task Assigned',
    message: 'You have been assigned to "Design new homepage"',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    priority: 'medium'
  },
  {
    id: 'mock-2',
    userId: 'mock-user',
    type: 'project_update',
    title: 'Project Updated',
    message: 'Project "Website Redesign" has been updated',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    priority: 'low'
  },
  {
    id: 'mock-3',
    userId: 'mock-user',
    type: 'team',
    title: 'Team Member Joined',
    message: 'Sarah Wilson has joined the project',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    priority: 'low'
  }
];

// Store callbacks for mock real-time updates
let mockCallbacks = [];

// Real-time notifications listener
export const subscribeToNotifications = (userId, callback) => {
  if (isMockDb) {
    // Mock implementation with real-time simulation
    console.log('Using mock notification subscription for development');
    
    // Filter notifications for the current user
    const userNotifications = mockNotifications.filter(n => n.userId === userId || n.userId === 'mock-user');
    callback(userNotifications);
    
    // Store callback for real-time updates
    mockCallbacks.push(callback);
    
    // Return a cleanup function that simulates real-time updates
    return () => {
      console.log('Mock notification subscription cleaned up');
      // Remove callback from the array
      mockCallbacks = mockCallbacks.filter(cb => cb !== callback);
    };
  }

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const notifications = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate()
      });
    });
    callback(notifications);
  });
};

// Helper function to trigger mock callbacks
const triggerMockCallbacks = (userId) => {
  const userNotifications = mockNotifications.filter(n => n.userId === userId || n.userId === 'mock-user');
  mockCallbacks.forEach(callback => {
    callback(userNotifications);
  });
};

// Create a notification
export const createNotification = async (notificationData) => {
  try {
    const notification = {
      ...notificationData,
      read: false,
      createdAt: serverTimestamp()
    };

    if (isMockDb) {
      // Mock implementation
      console.log('Creating mock notification:', notification);
      const mockNotification = { 
        id: `mock-${Date.now()}`, 
        ...notification,
        createdAt: new Date()
      };
      mockNotifications.unshift(mockNotification);
      
      // Trigger real-time updates
      triggerMockCallbacks(notificationData.userId);
      
      return mockNotification;
    }

    const docRef = await addDoc(collection(db, 'notifications'), notification);
    return { id: docRef.id, ...notification };
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    if (isMockDb) {
      // Mock implementation
      console.log('Marking mock notification as read:', notificationId);
      const notification = mockNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        notification.readAt = new Date();
        
        // Trigger real-time updates for the user
        triggerMockCallbacks(notification.userId);
      }
      return Promise.resolve();
    }

    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId) => {
  try {
    if (isMockDb) {
      // Mock implementation
      console.log('Marking all mock notifications as read for user:', userId);
      let hasChanges = false;
      mockNotifications.forEach(notification => {
        if ((notification.userId === userId || notification.userId === 'mock-user') && !notification.read) {
          notification.read = true;
          notification.readAt = new Date();
          hasChanges = true;
        }
      });
      
      // Trigger real-time updates if there were changes
      if (hasChanges) {
        triggerMockCallbacks(userId);
      }
      
      return Promise.resolve();
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);

    querySnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        read: true,
        readAt: serverTimestamp()
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    if (isMockDb) {
      // Mock implementation
      console.log('Deleting mock notification:', notificationId);
      mockNotifications = mockNotifications.filter(n => n.id !== notificationId);
      return Promise.resolve();
    }

    await deleteDoc(doc(db, 'notifications', notificationId));
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Create task assignment notification
export const createTaskAssignmentNotification = async (taskId, assignedTo, taskTitle, assignedBy) => {
  try {
    await createNotification({
      userId: assignedTo,
      type: 'task_assignment',
      title: 'New Task Assigned',
      message: `You have been assigned to "${taskTitle}"`,
      taskId,
      assignedBy,
      priority: 'medium'
    });
  } catch (error) {
    console.error('Error creating task assignment notification:', error);
    throw error;
  }
};

// Create project update notification
export const createProjectUpdateNotification = async (projectId, projectName, updateType, updatedBy) => {
  try {
    await createNotification({
      userId: updatedBy,
      type: 'project_update',
      title: 'Project Updated',
      message: `Project "${projectName}" has been ${updateType}`,
      projectId,
      updatedBy,
      priority: 'low'
    });
  } catch (error) {
    console.error('Error creating project update notification:', error);
    throw error;
  }
}; 