import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QuickAdd from '@/components/molecules/QuickAdd';
import FilterBar from '@/components/molecules/FilterBar';
import TaskList from '@/components/organisms/TaskList';
import ProgressCard from '@/components/molecules/ProgressCard';
import categoryService from '@/services/api/categoryService';
import taskService from '@/services/api/taskService';

const All = () => {
const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ view: 'all' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [allStats, setAllStats] = useState({ total: 0, completed: 0 });
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    loadCategories();
    loadAllStats();
  }, [refreshTrigger]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadAllStats = async () => {
    try {
      const tasks = await taskService.getAll();
      setAllStats({
        total: tasks.length,
        completed: tasks.filter(task => task.completed).length
      });
    } catch (error) {
      console.error('Failed to load all stats:', error);
    }
  };

  const handleTaskAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTaskUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
setRefreshTrigger(prev => prev + 1);
  };

  const handleTaskSelect = (task) => {
    setSelectedTaskId(task?.Id || null);
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
            All Tasks
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600"
          >
            View and manage all your tasks in one place
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-shrink-0"
        >
          <ProgressCard
            title="Overall Progress"
            progress={allStats.completed}
            total={allStats.total}
            completed={allStats.completed}
            color="#51CF66"
            icon="ListTodo"
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <FilterBar
          categories={categories}
          onFilterChange={setFilters}
          activeFilters={filters}
        />
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
<TaskList
          filters={filters}
          onTaskUpdate={handleTaskUpdate}
          refreshTrigger={refreshTrigger}
          selectedTaskId={selectedTaskId}
          onTaskSelect={handleTaskSelect}
        />
      </motion.div>
    </motion.div>
  );
};

export default All;