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

// Check if we're using mock Firestore
const isMockDb = !db.collection || typeof db.collection !== 'function';

// Real-time projects listener
export const subscribeToProjects = (userId, callback) => {
  if (isMockDb) {
    // Mock implementation
    console.log('Using mock project subscription for development');
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, 'projects'),
    where('members', 'array-contains', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    callback(projects);
  });
};

// Create a new project
export const createProject = async (projectData, userId) => {
  try {
    const project = {
      ...projectData,
      createdBy: userId,
      members: [userId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      checklist: projectData.checklist || [],
      progress: 0
    };

    if (isMockDb) {
      // Mock implementation
      console.log('Creating mock project:', project);
      const mockProject = { id: `mock-${Date.now()}`, ...project };
      return mockProject;
    }

    const docRef = await addDoc(collection(db, 'projects'), project);
    return { id: docRef.id, ...project };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Update a project
export const updateProject = async (projectId, updates) => {
  try {
    if (isMockDb) {
      // Mock implementation
      console.log('Updating mock project:', projectId, updates);
      return Promise.resolve();
    }

    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    if (isMockDb) {
      // Mock implementation
      console.log('Deleting mock project:', projectId);
      return Promise.resolve();
    }

    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Update project checklist
export const updateProjectChecklist = async (projectId, checklist) => {
  try {
    const progress = checklist.length > 0 
      ? Math.round((checklist.filter(item => item.checked).length / checklist.length) * 100)
      : 0;

    await updateProject(projectId, { 
      checklist, 
      progress,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating project checklist:', error);
    throw error;
  }
};

// Add member to project
export const addProjectMember = async (projectId, memberEmail) => {
  try {
    if (isMockDb) {
      // Mock implementation
      console.log('Adding mock member to project:', projectId, memberEmail);
      return Promise.resolve();
    }

    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }

    const projectData = projectDoc.data();
    const updatedMembers = [...projectData.members, memberEmail];

    await updateDoc(projectRef, {
      members: updatedMembers,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding project member:', error);
    throw error;
  }
}; 