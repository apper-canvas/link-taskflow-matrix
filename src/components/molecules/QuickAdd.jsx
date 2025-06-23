import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import taskService from '@/services/api/taskService';

const QuickAdd = ({ categories = [], onTaskAdded, className = '' }) => {
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [categoryId, setCategoryId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsAdding(true);
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null
      };

      const newTask = await taskService.create(taskData);
      onTaskAdded(newTask);
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategoryId('');
      setDueDate('');
      setIsExpanded(false);
      
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add task');
    } finally {
      setIsAdding(false);
    }
  };

  const parseNaturalLanguage = (input) => {
    // Simple natural language parsing for due dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (input.toLowerCase().includes('today')) {
      setDueDate(today.toISOString().split('T')[0]);
    } else if (input.toLowerCase().includes('tomorrow')) {
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }

    // Priority parsing
    if (input.toLowerCase().includes('urgent') || input.toLowerCase().includes('asap')) {
      setPriority('urgent');
    } else if (input.toLowerCase().includes('high priority')) {
      setPriority('high');
    } else if (input.toLowerCase().includes('low priority')) {
      setPriority('low');
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    parseNaturalLanguage(value);
  };

  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
      initial={false}
      animate={{ height: isExpanded ? 'auto' : '60px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <form onSubmit={handleQuickAdd} className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              value={title}
              onChange={handleTitleChange}
              placeholder="Add a task... (try 'urgent meeting tomorrow')"
              onFocus={() => setIsExpanded(true)}
              icon="Plus"
            />
          </div>
          
          <Button
            type="submit"
            disabled={!title.trim() || isAdding}
            className="flex-shrink-0"
          >
            {isAdding ? (
              <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
            ) : (
              'Add'
            )}
          </Button>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 space-y-4"
          >
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              icon="FileText"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">No category</option>
                  {categories.map(category => (
                    <option key={category.Id} value={category.Id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsExpanded(false);
                  setDescription('');
                  setPriority('medium');
                  setCategoryId('');
                  setDueDate('');
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default QuickAdd;