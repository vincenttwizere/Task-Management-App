import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Check if we're using mock Firestore
const isMockDb = !db.collection || typeof db.collection !== 'function';

// Mock comments for development
let mockComments = [
  {
    id: 'comment-1',
    taskId: 'task-1',
    userId: 'mock-user-1',
    userDisplayName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    content: 'I\'ve started working on the design mockups. Should have the first version ready by tomorrow.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    mentions: [],
    attachments: []
  },
  {
    id: 'comment-2',
    taskId: 'task-1',
    userId: 'mock-user-2',
    userDisplayName: 'Jane Smith',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    content: 'Great! @John Doe Can you also include the mobile responsive versions?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60),
    mentions: ['mock-user-1'],
    attachments: []
  },
  {
    id: 'comment-3',
    taskId: 'task-2',
    userId: 'mock-user-3',
    userDisplayName: 'Mike Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content: 'The backend API is now ready for testing. You can find the documentation in the attached file.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    mentions: [],
    attachments: [
      {
        id: 'att-1',
        name: 'API_Documentation.pdf',
        url: 'https://example.com/api-docs.pdf',
        size: 1024000,
        type: 'application/pdf'
      }
    ]
  }
];

// Subscribe to task comments
export const subscribeToTaskComments = (taskId, callback) => {
  if (isMockDb) {
    // Mock implementation with real-time simulation
    console.log('Using mock comment subscription for development');
    
    const taskComments = mockComments.filter(c => c.taskId === taskId);
    callback(taskComments);
    
    return () => {
      console.log('Mock comment subscription cleaned up');
    };
  }

  const q = query(
    collection(db, 'comments'),
    where('taskId', '==', taskId),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const comments = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      });
    });
    callback(comments);
  });
};

// Create a comment
export const createComment = async (commentData) => {
  try {
    const comment = {
      ...commentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    if (isMockDb) {
      // Mock implementation
      console.log('Creating mock comment:', comment);
      const mockComment = { 
        id: `comment-${Date.now()}`, 
        ...comment,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockComments.push(mockComment);
      return mockComment;
    }

    const docRef = await addDoc(collection(db, 'comments'), comment);
    return { id: docRef.id, ...comment };
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Update a comment
export const updateComment = async (commentId, updates) => {
  try {
    if (isMockDb) {
      // Mock implementation
      console.log('Updating mock comment:', commentId, updates);
      const commentIndex = mockComments.findIndex(c => c.id === commentId);
      if (commentIndex !== -1) {
        mockComments[commentIndex] = { 
          ...mockComments[commentIndex], 
          ...updates,
          updatedAt: new Date()
        };
      }
      return Promise.resolve();
    }

    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    if (isMockDb) {
      // Mock implementation
      console.log('Deleting mock comment:', commentId);
      mockComments = mockComments.filter(c => c.id !== commentId);
      return Promise.resolve();
    }

    await deleteDoc(doc(db, 'comments', commentId));
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Get comment by ID
export const getComment = async (commentId) => {
  try {
    if (isMockDb) {
      const comment = mockComments.find(c => c.id === commentId);
      return comment || null;
    }

    const commentRef = doc(db, 'comments', commentId);
    const commentDoc = await getDoc(commentRef);
    
    if (!commentDoc.exists()) {
      return null;
    }

    const data = commentDoc.data();
    return {
      id: commentDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
  } catch (error) {
    console.error('Error getting comment:', error);
    throw error;
  }
};

// Add attachment to comment
export const addCommentAttachment = async (commentId, attachment) => {
  try {
    if (isMockDb) {
      // Mock implementation
      console.log('Adding attachment to mock comment:', commentId, attachment);
      const commentIndex = mockComments.findIndex(c => c.id === commentId);
      if (commentIndex !== -1) {
        mockComments[commentIndex].attachments.push(attachment);
        mockComments[commentIndex].updatedAt = new Date();
      }
      return Promise.resolve();
    }

    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, {
      attachments: [...(await getComment(commentId)).attachments, attachment],
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding comment attachment:', error);
    throw error;
  }
};

// Remove attachment from comment
export const removeCommentAttachment = async (commentId, attachmentId) => {
  try {
    if (isMockDb) {
      // Mock implementation
      console.log('Removing attachment from mock comment:', commentId, attachmentId);
      const commentIndex = mockComments.findIndex(c => c.id === commentId);
      if (commentIndex !== -1) {
        mockComments[commentIndex].attachments = mockComments[commentIndex].attachments.filter(
          att => att.id !== attachmentId
        );
        mockComments[commentIndex].updatedAt = new Date();
      }
      return Promise.resolve();
    }

    const commentRef = doc(db, 'comments', commentId);
    const comment = await getComment(commentId);
    const updatedAttachments = comment.attachments.filter(att => att.id !== attachmentId);
    
    await updateDoc(commentRef, {
      attachments: updatedAttachments,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error removing comment attachment:', error);
    throw error;
  }
};

// Parse mentions from comment content
export const parseMentions = (content) => {
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
};

// Format comment content with mentions
export const formatCommentContent = (content, users) => {
  let formattedContent = content;
  
  users.forEach(user => {
    const regex = new RegExp(`@${user.displayName.split(' ')[0]}`, 'gi');
    formattedContent = formattedContent.replace(
      regex, 
      `<span class="text-primary-600 font-medium">@${user.displayName}</span>`
    );
  });
  
  return formattedContent;
}; 