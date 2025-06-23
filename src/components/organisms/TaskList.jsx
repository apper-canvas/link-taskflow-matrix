import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import { toast } from 'react-toastify';
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

const TaskList = ({ 
  filters = {}, 
  onTaskUpdate,
  refreshTrigger = 0,
  className = '' 
}) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
    loadCategories();
  }, [refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const tasksData = await taskService.getAll();
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
    onTaskUpdate?.(updatedTask);
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId);
  };

  const filterTasks = (tasks) => {
    let filtered = [...tasks];

    // View filter
    if (filters.view) {
      switch (filters.view) {
        case 'active':
          filtered = filtered.filter(task => !task.completed);
          break;
        case 'completed':
          filtered = filtered.filter(task => task.completed);
          break;
        case 'all':
        default:
          break;
      }
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(task => 
        filters.categories.includes(task.categoryId)
      );
    }

    // Priority filter
    if (filters.priorities && filters.priorities.length > 0) {
      filtered = filtered.filter(task => 
        filters.priorities.includes(task.priority)
      );
    }

    // Date filters
    if (filters.dateFilters && filters.dateFilters.length > 0) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);

      filtered = filtered.filter(task => {
        const hasOverdue = filters.dateFilters.includes('overdue');
        const hasToday = filters.dateFilters.includes('today');
        const hasTomorrow = filters.dateFilters.includes('tomorrow');
        const hasThisWeek = filters.dateFilters.includes('thisWeek');
        const hasNoDate = filters.dateFilters.includes('noDate');

        if (!task.dueDate && hasNoDate) return true;
        if (!task.dueDate) return false;

        const dueDate = new Date(task.dueDate);
        const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

        if (hasOverdue && dueDate < now && !task.completed) return true;
        if (hasToday && dueDateOnly.getTime() === today.getTime()) return true;
        if (hasTomorrow && dueDateOnly.getTime() === tomorrow.getTime()) return true;
        if (hasThisWeek && dueDateOnly >= today && dueDateOnly <= weekEnd) return true;

        return false;
      });
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      
      return a.dueDate ? -1 : b.dueDate ? 1 : 0;
    });
  };

  const filteredTasks = filterTasks(tasks);

  if (loading) {
    return <SkeletonLoader count={5} className={className} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadData}
        className={className}
      />
    );
  }

  if (filteredTasks.length === 0) {
    const hasFilters = Object.keys(filters).some(key => {
      const value = filters[key];
      return Array.isArray(value) ? value.length > 0 : value;
    });

    return (
      <EmptyState
        icon={hasFilters ? "Search" : "CheckSquare"}
        title={hasFilters ? "No tasks match your filters" : "No tasks yet"}
        description={hasFilters 
          ? "Try adjusting your filters to see more tasks"
          : "Create your first task to get started with TaskFlow"
        }
        actionLabel={hasFilters ? undefined : "Create Task"}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            layout
          >
            <TaskCard
              task={task}
              category={getCategoryById(task.categoryId)}
              onUpdate={handleTaskUpdate}
              onDelete={handleTaskDelete}
              className="group"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;