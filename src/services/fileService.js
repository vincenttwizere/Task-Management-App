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

// Mock files for development
let mockFiles = [
  {
    id: 'file-1',
    taskId: 'task-1',
    commentId: null,
    fileName: 'design_mockup_v1.fig',
    fileSize: 2048000,
    fileType: 'application/fig',
    fileUrl: 'https://example.com/files/design_mockup_v1.fig',
    uploadedBy: 'mock-user-1',
    uploadedByDisplayName: 'John Doe',
    uploadedByAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    thumbnailUrl: null,
    isImage: false
  },
  {
    id: 'file-2',
    taskId: 'task-1',
    commentId: null,
    fileName: 'wireframe_design.png',
    fileSize: 512000,
    fileType: 'image/png',
    fileUrl: 'https://example.com/files/wireframe_design.png',
    uploadedBy: 'mock-user-2',
    uploadedByDisplayName: 'Jane Smith',
    uploadedByAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    thumbnailUrl: 'https://example.com/thumbnails/wireframe_design.png',
    isImage: true
  },
  {
    id: 'file-3',
    taskId: 'task-2',
    commentId: 'comment-3',
    fileName: 'API_Documentation.pdf',
    fileSize: 1024000,
    fileType: 'application/pdf',
    fileUrl: 'https://example.com/files/API_Documentation.pdf',
    uploadedBy: 'mock-user-3',
    uploadedByDisplayName: 'Mike Johnson',
    uploadedByAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    thumbnailUrl: null,
    isImage: false
  }
];

// Subscribe to task files
export const subscribeToTaskFiles = (taskId, callback) => {
  if (isMockDb) {
    // Mock implementation with real-time simulation
    console.log('Using mock file subscription for development');
    
    const taskFiles = mockFiles.filter(f => f.taskId === taskId);
    callback(taskFiles);
    
    return () => {
      console.log('Mock file subscription cleaned up');
    };
  }

  const q = query(
    collection(db, 'files'),
    where('taskId', '==', taskId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const files = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      files.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      });
    });
    callback(files);
  });
};

// Upload file
export const uploadFile = async (file, taskId, commentId = null, userId, userDisplayName, userAvatar) => {
  try {
    // In a real implementation, you would upload to Firebase Storage or similar
    // For now, we'll simulate the upload process
    
    const fileData = {
      taskId,
      commentId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: URL.createObjectURL(file), // In real app, this would be the uploaded URL
      uploadedBy: userId,
      uploadedByDisplayName: userDisplayName,
      uploadedByAvatar: userAvatar,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      isImage: file.type.startsWith('image/')
    };

    if (isMockDb) {
      // Mock implementation
      console.log('Uploading mock file:', fileData);
      const mockFile = { 
        id: `file-${Date.now()}`, 
        ...fileData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockFiles.push(mockFile);
      return mockFile;
    }

    const docRef = await addDoc(collection(db, 'files'), fileData);
    return { id: docRef.id, ...fileData };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Delete file
export const deleteFile = async (fileId) => {
  try {
    if (isMockDb) {
      // Mock implementation
      console.log('Deleting mock file:', fileId);
      mockFiles = mockFiles.filter(f => f.id !== fileId);
      return Promise.resolve();
    }

    await deleteDoc(doc(db, 'files', fileId));
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Get file by ID
export const getFile = async (fileId) => {
  try {
    if (isMockDb) {
      const file = mockFiles.find(f => f.id === fileId);
      return file || null;
    }

    const fileRef = doc(db, 'files', fileId);
    const fileDoc = await getDoc(fileRef);
    
    if (!fileDoc.exists()) {
      return null;
    }

    const data = fileDoc.data();
    return {
      id: fileDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
};

// Get all files for a task
export const getTaskFiles = async (taskId) => {
  try {
    if (isMockDb) {
      return mockFiles.filter(f => f.taskId === taskId);
    }

    const q = query(
      collection(db, 'files'),
      where('taskId', '==', taskId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const files = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      files.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      });
    });
    
    return files;
  } catch (error) {
    console.error('Error getting task files:', error);
    throw error;
  }
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file icon based on type
export const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) {
    return '🖼️';
  } else if (fileType.includes('pdf')) {
    return '📄';
  } else if (fileType.includes('word') || fileType.includes('document')) {
    return '📝';
  } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
    return '📊';
  } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
    return '📈';
  } else if (fileType.includes('zip') || fileType.includes('archive')) {
    return '📦';
  } else if (fileType.includes('video')) {
    return '🎥';
  } else if (fileType.includes('audio')) {
    return '🎵';
  } else {
    return '📎';
  }
};

// Validate file upload
export const validateFileUpload = (file, maxSize = 10 * 1024 * 1024) => { // 10MB default
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed'
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not allowed');
  }

  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${formatFileSize(maxSize)}`);
  }

  return true;
};

// Generate thumbnail for image files
export const generateThumbnail = (file) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(null);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const maxSize = 200;
      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg', 0.8);
    };

    img.src = URL.createObjectURL(file);
  });
}; 