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

// Real-time notifications listener
export const subscribeToNotifications = (userId, callback) => {
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

// Create a notification
export const createNotification = async (notificationData) => {
  try {
    const notification = {
      ...notificationData,
      read: false,
      createdAt: serverTimestamp()
    };

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