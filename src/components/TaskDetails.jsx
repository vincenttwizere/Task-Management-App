import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  XMarkIcon,
  PaperClipIcon,
  PhotoIcon,
  DocumentIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  UserCircleIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { 
  subscribeToTaskComments, 
  createComment, 
  updateComment, 
  deleteComment,
  parseMentions 
} from '../services/commentService';
import { 
  subscribeToTaskFiles, 
  uploadFile, 
  deleteFile, 
  formatFileSize, 
  getFileIcon,
  validateFileUpload 
} from '../services/fileService';
import { getAllUsers, getUserAvatar } from '../services/userService';

export default function TaskDetails({ isOpen, onClose, task, onTaskUpdate }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (!task) return;

    // Subscribe to comments
    const unsubscribeComments = subscribeToTaskComments(task.id, (commentsData) => {
      setComments(commentsData);
    });

    // Subscribe to files
    const unsubscribeFiles = subscribeToTaskFiles(task.id, (filesData) => {
      setFiles(filesData);
    });

    // Load users for mentions
    const loadUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadUsers();

    return () => {
      unsubscribeComments();
      unsubscribeFiles();
    };
  }, [task]);

  // Handle mention search
  useEffect(() => {
    if (mentionSearch) {
      const filtered = users.filter(user =>
        user.displayName.toLowerCase().includes(mentionSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(mentionSearch.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  }, [mentionSearch, users]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const mentions = parseMentions(newComment);
      const commentData = {
        taskId: task.id,
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName || 'User',
        userAvatar: currentUser.photoURL,
        content: newComment,
        mentions
      };

      await createComment(commentData);
      setNewComment('');
      setShowMentions(false);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleCommentEdit = async (commentId) => {
    if (!editCommentContent.trim()) return;

    try {
      await updateComment(commentId, { content: editCommentContent });
      setEditingComment(null);
      setEditCommentContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);

    try {
      for (const file of files) {
        validateFileUpload(file);
        await uploadFile(
          file,
          task.id,
          null,
          currentUser.uid,
          currentUser.displayName || 'User',
          currentUser.photoURL
        );
      }
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDelete = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await deleteFile(fileId);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const handleMentionSelect = (user) => {
    const beforeMention = newComment.substring(0, newComment.lastIndexOf('@'));
    const afterMention = newComment.substring(newComment.lastIndexOf('@') + mentionSearch.length + 1);
    setNewComment(beforeMention + `@${user.displayName} ` + afterMention);
    setShowMentions(false);
    setMentionSearch('');
  };

  const handleCommentInput = (e) => {
    const value = e.target.value;
    setNewComment(value);
    
    // Check for @ symbol to show mentions
    const lastAtSymbol = value.lastIndexOf('@');
    if (lastAtSymbol !== -1) {
      const searchTerm = value.substring(lastAtSymbol + 1).split(' ')[0];
      setMentionSearch(searchTerm);
    } else {
      setShowMentions(false);
      setMentionSearch('');
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error-100 text-error-800';
      case 'medium': return 'bg-warning-100 text-warning-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-800';
      case 'in-progress': return 'bg-primary-100 text-primary-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!task) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4 border-b border-primary-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-500 rounded-lg">
                        <DocumentIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <Dialog.Title className="text-xl font-bold text-gray-900">
                          {task.title}
                        </Dialog.Title>
                        <p className="text-sm text-gray-600">
                          Created {formatTime(task.createdAt)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="flex h-96">
                  {/* Left Panel - Task Details */}
                  <div className="w-1/2 border-r border-gray-200 p-6 overflow-y-auto">
                    <div className="space-y-6">
                      {/* Task Info */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Task Details</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <p className="mt-1 text-gray-900">{task.description || 'No description provided'}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Priority</label>
                              <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Status</label>
                              <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </div>
                          </div>

                          {task.dueDate && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Due Date</label>
                              <p className="mt-1 text-gray-900 flex items-center">
                                <ClockIcon className="h-4 w-4 mr-2" />
                                {formatTime(task.dueDate)}
                              </p>
                            </div>
                          )}

                          {task.category && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Category</label>
                              <p className="mt-1 text-gray-900">{task.category}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Files */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              onChange={handleFileUpload}
                              disabled={isUploading}
                            />
                            <div className="flex items-center space-x-2 px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
                              <PaperClipIcon className="h-4 w-4" />
                              <span>{isUploading ? 'Uploading...' : 'Add Files'}</span>
                            </div>
                          </label>
                        </div>
                        
                        <div className="space-y-2">
                          {files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{getFileIcon(file.fileType)}</span>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <a
                                  href={file.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                                >
                                  <DocumentIcon className="h-4 w-4" />
                                </a>
                                <button
                                  onClick={() => handleFileDelete(file.id)}
                                  className="p-1 text-gray-400 hover:text-error-600 rounded transition-colors"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {files.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No attachments</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel - Comments */}
                  <div className="w-1/2 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                        Comments ({comments.length})
                      </h3>
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {comment.userAvatar ? (
                                <img
                                  src={comment.userAvatar}
                                  alt={comment.userDisplayName}
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                                  <UserCircleIcon className="h-5 w-5 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {comment.userDisplayName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatTime(comment.createdAt)}
                                  </p>
                                </div>
                                {comment.userId === currentUser.uid && (
                                  <div className="flex items-center space-x-1">
                                    <button
                                      onClick={() => {
                                        setEditingComment(comment.id);
                                        setEditCommentContent(comment.content);
                                      }}
                                      className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                                    >
                                      <PencilIcon className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => handleCommentDelete(comment.id)}
                                      className="p-1 text-gray-400 hover:text-error-600 rounded transition-colors"
                                    >
                                      <TrashIcon className="h-3 w-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              
                              {editingComment === comment.id ? (
                                <div className="mt-2">
                                  <textarea
                                    value={editCommentContent}
                                    onChange={(e) => setEditCommentContent(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    rows="3"
                                  />
                                  <div className="flex items-center space-x-2 mt-2">
                                    <button
                                      onClick={() => handleCommentEdit(comment.id)}
                                      className="px-3 py-1 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingComment(null);
                                        setEditCommentContent('');
                                      }}
                                      className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                                  {comment.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {comments.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-8">No comments yet</p>
                      )}
                    </div>

                    {/* Add Comment */}
                    <div className="border-t border-gray-200 pt-4">
                      <form onSubmit={handleCommentSubmit} className="relative">
                        <textarea
                          value={newComment}
                          onChange={handleCommentInput}
                          placeholder="Add a comment... Use @ to mention someone"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                          rows="3"
                        />
                        
                        {/* Mentions Dropdown */}
                        {showMentions && (
                          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                            {filteredUsers.map((user) => (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => handleMentionSelect(user)}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                              >
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.displayName} className="h-6 w-6 rounded-full" />
                                ) : (
                                  <div className="h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">
                                      {user.displayName.charAt(0)}
                                    </span>
                                  </div>
                                )}
                                <span className="text-sm text-gray-900">{user.displayName}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                              />
                              <PaperClipIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                            </label>
                          </div>
                          <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                          >
                            <PaperAirplaneIcon className="h-4 w-4" />
                            <span>Send</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 