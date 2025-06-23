import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

const TaskDetailSidebar = ({ 
  task, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete,
  onNavigate 
}) => {
  const [editedTask, setEditedTask] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editHistory, setEditHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (task) {
      setEditedTask({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''
      });
      loadCategories();
      loadEditHistory();
    }
  }, [task]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadEditHistory = async () => {
    if (!task) return;
    setIsLoading(true);
    try {
      const history = await taskService.getEditHistory(task.Id);
      setEditHistory(history);
    } catch (error) {
      console.error('Failed to load edit history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setIsSaving(true);
    try {
      const updates = {
        title: editedTask.title.trim(),
        description: editedTask.description.trim(),
        priority: editedTask.priority,
        categoryId: editedTask.categoryId,
        dueDate: editedTask.dueDate ? new Date(editedTask.dueDate).toISOString() : null
      };

      const updatedTask = await taskService.update(task.Id, updates);
      onUpdate(updatedTask);
      setEditedTask({
        ...updatedTask,
        dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate).toISOString().slice(0, 16) : ''
      });
      loadEditHistory(); // Refresh history after update
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await taskService.delete(task.Id);
        onDelete(task.Id);
        onClose();
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      const updatedTask = await taskService.update(task.Id, { 
        completed: !task.completed 
      });
      onUpdate(updatedTask);
      setEditedTask({
        ...updatedTask,
        dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate).toISOString().slice(0, 16) : ''
      });
      loadEditHistory();
      toast.success(updatedTask.completed ? 'Task completed! 🎉' : 'Task marked as incomplete');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsSaving(false);
    }
  };

  const formatHistoryDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return formatInTimeZone(date, Intl.DateTimeFormat().resolvedOptions().timeZone, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
    }
  };

  const getFieldDisplayName = (field) => {
    const fieldNames = {
      title: 'Title',
      description: 'Description',
      priority: 'Priority',
      categoryId: 'Category',
      dueDate: 'Due Date',
      completed: 'Status'
    };
    return fieldNames[field] || field;
  };

  const formatFieldValue = (field, value) => {
    if (value === null || value === undefined) return 'None';
    
    switch (field) {
      case 'categoryId':
        const category = categories.find(c => c.Id === value);
        return category ? category.name : `Category ${value}`;
      case 'dueDate':
        return value ? format(new Date(value), 'MMM d, yyyy h:mm a') : 'None';
      case 'completed':
        return value ? 'Completed' : 'Active';
      case 'priority':
        return value ? value.charAt(0).toUpperCase() + value.slice(1) : 'None';
      default:
        return value.toString();
    }
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId);
  };

  const priorityColors = {
    low: '#51CF66',
    medium: '#FFD93D',
    high: '#FF6B6B',
    urgent: '#FF3333'
  };

  if (!task || !editedTask) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
              <div className="flex items-center gap-2">
                {onNavigate && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="ChevronUp"
                      onClick={() => onNavigate('prev')}
                      className="p-2"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="ChevronDown"
                      onClick={() => onNavigate('next')}
                      className="p-2"
                    />
                  </>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  icon="X"
                  onClick={onClose}
                  className="p-2"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                History
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'details' ? (
                <div className="p-6 space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={task.completed ? "success" : "default"}
                      icon={task.completed ? "CheckCircle" : "Circle"}
                    >
                      {task.completed ? 'Completed' : 'Active'}
                    </Badge>
                    {task.priority && (
                      <Badge
                        variant="default"
                        className="capitalize"
                        style={{ backgroundColor: priorityColors[task.priority] + '20', color: priorityColors[task.priority] }}
                      >
                        {task.priority}
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <Input
                      type="text"
                      value={editedTask.title}
                      onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter task title"
                      className="w-full"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={editedTask.description}
                      onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      placeholder="Enter task description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      value={editedTask.categoryId || ''}
                      onChange={(e) => setEditedTask(prev => ({ ...prev, categoryId: parseInt(e.target.value) || null }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.Id} value={category.Id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <select
                      value={editedTask.priority}
                      onChange={(e) => setEditedTask(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      value={editedTask.dueDate}
                      onChange={(e) => setEditedTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>

                  {/* Task Info */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Created: {format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}</p>
                    {task.completedAt && (
                      <p>Completed: {format(new Date(task.completedAt), 'MMM d, yyyy h:mm a')}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Edit History</h3>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <ApperIcon name="Loader2" className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : editHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ApperIcon name="History" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No edit history available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editHistory.map((entry, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              variant={entry.action === 'created' ? 'success' : 'default'}
                              size="sm"
                              icon={entry.action === 'created' ? 'Plus' : 'Edit'}
                            >
                              {entry.action === 'created' ? 'Created' : 'Updated'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatHistoryDate(entry.timestamp)}
                            </span>
                          </div>
                          
                          {entry.changes && entry.changes.length > 0 && (
                            <div className="space-y-2">
                              {entry.changes.map((change, changeIndex) => (
                                <div key={changeIndex} className="text-sm">
                                  <span className="font-medium text-gray-700">
                                    {getFieldDisplayName(change.field)}:
                                  </span>
                                  <div className="ml-2 text-gray-600">
                                    {change.oldValue !== null && (
                                      <div className="flex items-center gap-1">
                                        <span className="line-through text-red-600">
                                          {formatFieldValue(change.field, change.oldValue)}
                                        </span>
                                        <ApperIcon name="ArrowRight" size={12} className="text-gray-400" />
                                        <span className="text-green-600">
                                          {formatFieldValue(change.field, change.newValue)}
                                        </span>
                                      </div>
                                    )}
                                    {change.oldValue === null && (
                                      <span className="text-green-600">
                                        {formatFieldValue(change.field, change.newValue)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {activeTab === 'details' && (
              <div className="p-6 border-t border-gray-200 space-y-3">
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !editedTask.title.trim()}
                    className="flex-1"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleComplete}
                    disabled={isSaving}
                    icon={task.completed ? "Circle" : "CheckCircle"}
                  >
                    {task.completed ? 'Reopen' : 'Complete'}
                  </Button>
                </div>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="w-full"
                  icon="Trash2"
                >
                  Delete Task
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailSidebar;