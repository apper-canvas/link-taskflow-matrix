import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QuickAdd from '@/components/molecules/QuickAdd';
import FilterBar from '@/components/molecules/FilterBar';
import TaskList from '@/components/organisms/TaskList';
import categoryService from '@/services/api/categoryService';

const Home = () => {
const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ view: 'active' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleTaskAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTaskUpdate = () => {
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
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-heading font-bold text-gray-900 mb-2"
        >
          Welcome to TaskFlow
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          Organize your tasks with style and efficiency
        </motion.p>
      </div>

      {/* Quick Add */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
        transition={{ delay: 0.3 }}
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
        transition={{ delay: 0.4 }}
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

export default Home;