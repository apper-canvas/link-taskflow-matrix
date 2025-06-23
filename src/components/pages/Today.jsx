import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isToday } from 'date-fns';
import QuickAdd from '@/components/molecules/QuickAdd';
import TaskList from '@/components/organisms/TaskList';
import ProgressCard from '@/components/molecules/ProgressCard';
import categoryService from '@/services/api/categoryService';
import taskService from '@/services/api/taskService';

const Today = () => {
  const [categories, setCategories] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [todayStats, setTodayStats] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    loadCategories();
    loadTodayStats();
  }, [refreshTrigger]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadTodayStats = async () => {
    try {
      const tasks = await taskService.getAll();
      const todayTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        return isToday(new Date(task.dueDate));
      });
      
      setTodayStats({
        total: todayTasks.length,
        completed: todayTasks.filter(task => task.completed).length
      });
    } catch (error) {
      console.error('Failed to load today stats:', error);
    }
  };

  const handleTaskAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTaskUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Filter for today's tasks
  const todayFilters = {
    view: 'all',
    dateFilters: ['today']
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-heading font-bold text-gray-900"
          >
            Today's Tasks
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600"
          >
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-shrink-0"
        >
          <ProgressCard
            title="Today's Progress"
            progress={todayStats.completed}
            total={todayStats.total}
            completed={todayStats.completed}
            color="#5B4CFF"
            icon="Calendar"
            className="w-80"
          />
        </motion.div>
      </div>

      {/* Quick Add */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <QuickAdd
          categories={categories}
          onTaskAdded={handleTaskAdded}
        />
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <TaskList
          filters={todayFilters}
          onTaskUpdate={handleTaskUpdate}
          refreshTrigger={refreshTrigger}
        />
      </motion.div>
    </motion.div>
  );
};

export default Today;