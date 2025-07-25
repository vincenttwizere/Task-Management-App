import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
  FolderIcon,
  PlusIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  subscribeToProjects, 
  createProject, 
  updateProjectChecklist,
  addProjectMember 
} from '../services/projectService';
import { createProjectUpdateNotification } from '../services/notificationService';

export default function Projects() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isProjectDetailsModalOpen, setIsProjectDetailsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    category: 'work',
    dueDate: '',
    checklist: [{ text: '', checked: false }]
  });
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    email: '',
    role: 'member',
    project: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if we should show the new project modal
    if (location.state?.showNewProjectModal) {
      setIsNewProjectModalOpen(true);
      window.history.replaceState({}, document.title);
    }
    // Check if we should show the add team member modal
    if (location.state?.showAddTeamModal) {
      setIsAddTeamModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to real-time projects
    const unsubscribe = subscribeToProjects(currentUser.uid, (projectsData) => {
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work':
        return 'bg-blue-100 text-blue-800';
      case 'development':
        return 'bg-purple-100 text-purple-800';
      case 'marketing':
        return 'bg-green-100 text-green-800';
      case 'personal':
        return 'bg-yellow-100 text-yellow-800';
      case 'school':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewProjectSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const projectData = {
        name: newProject.name,
        description: newProject.description,
        category: newProject.category,
        dueDate: newProject.dueDate,
        checklist: newProject.checklist.filter(item => item.text.trim() !== '')
      };

      await createProject(projectData, currentUser.uid);
      
      // Create notification for project creation
      await createProjectUpdateNotification(
        'temp-id', // Will be updated after project creation
        projectData.name,
        'created',
        currentUser.uid
      );

      setNewProject({
        name: '',
        description: '',
        category: 'work',
        dueDate: '',
        checklist: [{ text: '', checked: false }]
      });
      setIsNewProjectModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again.');
    }
  };

  const addChecklistItem = () => {
    setNewProject({
      ...newProject,
      checklist: [...newProject.checklist, { text: '', checked: false }],
    });
  };

  const removeChecklistItem = (index) => {
    setNewProject({
      ...newProject,
      checklist: newProject.checklist.filter((_, i) => i !== index),
    });
  };

  const updateChecklistItem = (index, value) => {
    const updated = [...newProject.checklist];
    updated[index].text = value;
    setNewProject({ ...newProject, checklist: updated });
  };

  const updateChecklistChecked = async (projectId, index) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const updatedChecklist = project.checklist.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      );

      await updateProjectChecklist(projectId, updatedChecklist);
    } catch (error) {
      console.error('Error updating checklist:', error);
      setError('Failed to update checklist. Please try again.');
    }
  };

  const getProgress = (checklist) => {
    if (!checklist || !checklist.length) return 0;
    const completed = checklist.filter(item => item.checked).length;
    return Math.round((completed / checklist.length) * 100);
  };

  const handleAddTeamMemberSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const project = projects.find(p => p.name === newTeamMember.project);
      if (!project) {
        setError('Project not found');
        return;
      }

      await addProjectMember(project.id, newTeamMember.email);
      
      setIsAddTeamModalOpen(false);
      setNewTeamMember({
        name: '',
        email: '',
        role: 'member',
        project: ''
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      setError('Failed to add team member. Please try again.');
    }
  };

  const handleProjectCardClick = (project) => {
    setSelectedProject(project);
    setIsProjectDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            New Project
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError('')}
                    className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectCardClick(project)}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-6 cursor-pointer"
            >
              <h2 className="text-lg font-medium text-gray-900">{project.name || project.title}</h2>
              <p className="mt-2 text-sm text-gray-500">{project.description}</p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Progress</span>
                  <span>{getProgress(project.checklist)}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${getProgress(project.checklist)}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Checklist</h3>
                <ul className="mt-2 space-y-2">
                  {project.checklist && project.checklist.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateChecklistChecked(project.id, idx);
                        }}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className={`ml-2 text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>Due {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
        {/* New Project Modal */}
        <Transition.Root show={isNewProjectModalOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setIsNewProjectModalOpen}>
            <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      onClick={() => setIsNewProjectModalOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      ×
                    </button>
                  </div>

                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Create New Project
                      </Dialog.Title>

                      <form onSubmit={handleNewProjectSubmit} className="mt-6 space-y-6">
                        <div>
                          <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">
                            Project Name
                          </label>
                          <input
                            type="text"
                            id="project-name"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                          />
                        </div>

                        <div>
                          <label htmlFor="project-description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="project-description"
                            rows={3}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          />
                        </div>

                        <div>
                          <label htmlFor="project-category" className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            id="project-category"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            value={newProject.category}
                            onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                          >
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                            <option value="school">School</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="project-due-date" className="block text-sm font-medium text-gray-700">
                            Due Date
                          </label>
                          <input
                            type="date"
                            id="project-due-date"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            value={newProject.dueDate}
                            onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                          />
                        </div>

                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Create Project
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={() => setIsNewProjectModalOpen(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        {/* Add Team Member Modal */}
        <Transition appear show={isAddTeamModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsAddTeamModalOpen(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Add Team Member
                    </Dialog.Title>

                    <form onSubmit={handleAddTeamMemberSubmit} className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newTeamMember.name}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={newTeamMember.email}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Role
                        </label>
                        <select
                          value={newTeamMember.role}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="member">Team Member</option>
                          <option value="admin">Project Admin</option>
                          <option value="manager">Project Manager</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Project
                        </label>
                        <select
                          value={newTeamMember.project}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, project: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        >
                          <option value="">Select a project</option>
                          {projects.map(project => (
                            <option key={project.id} value={project.name}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsAddTeamModalOpen(false)}
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Add Member
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        {/* Project Details Modal */}
        <Transition.Root show={isProjectDetailsModalOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setIsProjectDetailsModalOpen}>
            <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
                  {selectedProject && (
                    <>
                      <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                        <button
                          type="button"
                          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                          onClick={() => setIsProjectDetailsModalOpen(false)}
                        >
                          <span className="sr-only">Close</span>
                          ×
                        </button>
                      </div>

                      <div>
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          {selectedProject.name || selectedProject.title}
                        </Dialog.Title>
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">{selectedProject.description}</p>
                        </div>

                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-900">Progress</h4>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>{getProgress(selectedProject.checklist)}% Complete</span>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${getProgress(selectedProject.checklist)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-900">Checklist</h4>
                          <ul className="mt-2 space-y-2">
                            {selectedProject.checklist.map((item, idx) => (
                              <li key={idx} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={item.checked}
                                  onChange={() => updateChecklistChecked(selectedProject.id, idx)}
                                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className={`ml-2 text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                  {item.text}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6">
                          <p className="text-sm text-gray-500">
                            Due Date: {selectedProject.dueDate ? new Date(selectedProject.dueDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </DashboardLayout>
  );
} 