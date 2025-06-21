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

// Mock users for development
let mockUsers = [
  {
    id: 'mock-user-1',
    uid: 'mock-user-1',
    displayName: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'admin',
    department: 'Engineering',
    position: 'Senior Developer',
    bio: 'Full-stack developer with 5+ years of experience',
    timezone: 'America/New_York',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    lastActive: new Date(),
    status: 'online'
  },
  {
    id: 'mock-user-2',
    uid: 'mock-user-2',
    displayName: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'manager',
    department: 'Design',
    position: 'UI/UX Designer',
    bio: 'Creative designer passionate about user experience',
    timezone: 'America/Los_Angeles',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25), // 25 days ago
    lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: 'away'
  },
  {
    id: 'mock-user-3',
    uid: 'mock-user-3',
    displayName: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'member',
    department: 'Marketing',
    position: 'Marketing Manager',
    bio: 'Digital marketing specialist focused on growth',
    timezone: 'America/Chicago',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), // 20 days ago
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'offline'
  }
];

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    if (isMockDb) {
      const user = mockUsers.find(u => u.uid === userId || u.id === userId);
      return user || null;
    }

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data();
    return {
      id: userDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      lastActive: data.lastActive?.toDate()
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    if (isMockDb) {
      const userIndex = mockUsers.findIndex(u => u.uid === userId || u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      }
      return Promise.resolve();
    }

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Create user profile
export const createUserProfile = async (userData) => {
  try {
    const user = {
      ...userData,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      status: 'online'
    };

    if (isMockDb) {
      const mockUser = { 
        id: `mock-user-${Date.now()}`, 
        ...user,
        createdAt: new Date(),
        lastActive: new Date()
      };
      mockUsers.push(mockUser);
      return mockUser;
    }

    const docRef = await addDoc(collection(db, 'users'), user);
    return { id: docRef.id, ...user };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    if (isMockDb) {
      return mockUsers;
    }

    const q = query(collection(db, 'users'), orderBy('displayName', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        lastActive: data.lastActive?.toDate()
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Search users
export const searchUsers = async (searchTerm) => {
  try {
    if (isMockDb) {
      const term = searchTerm.toLowerCase();
      return mockUsers.filter(user => 
        user.displayName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.department.toLowerCase().includes(term) ||
        user.position.toLowerCase().includes(term)
      );
    }

    // For real Firestore, we'd need to implement search differently
    // This is a simplified version
    const q = query(collection(db, 'users'), orderBy('displayName', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    const term = searchTerm.toLowerCase();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const user = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        lastActive: data.lastActive?.toDate()
      };
      
      if (
        user.displayName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.department.toLowerCase().includes(term) ||
        user.position.toLowerCase().includes(term)
      ) {
        users.push(user);
      }
    });
    
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Update user status
export const updateUserStatus = async (userId, status) => {
  try {
    if (isMockDb) {
      const userIndex = mockUsers.findIndex(u => u.uid === userId || u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex].status = status;
        mockUsers[userIndex].lastActive = new Date();
      }
      return Promise.resolve();
    }

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      status,
      lastActive: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

// Get user avatar URL
export const getUserAvatar = (user) => {
  if (user?.avatar) {
    return user.avatar;
  }
  
  // Generate initials avatar
  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';
  
  const colors = [
    'bg-primary-500', 'bg-success-500', 'bg-warning-500', 
    'bg-error-500', 'bg-accent-500', 'bg-purple-500'
  ];
  const color = colors[user?.id?.charCodeAt(0) % colors.length] || 'bg-gray-500';
  
  return { initials, color };
}; 