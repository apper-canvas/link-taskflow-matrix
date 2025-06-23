import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { routeArray } from '@/config/routes';
import ApperIcon from '@/components/ApperIcon';
import ProgressCard from '@/components/molecules/ProgressCard';

const Sidebar = () => {
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Mock progress data - in real app, this would come from context/state
  const todayProgress = {
    total: 8,
    completed: 3
  };

  const weekProgress = {
    total: 25,
    completed: 12
  };

  return (
    <motion.aside
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-80 bg-surface border-r border-gray-200 overflow-y-auto z-40"
    >
      <div className="p-6 space-y-6">
        {/* Navigation */}
        <nav className="space-y-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Navigation
          </h2>
          {routeArray.map((route) => (
            <motion.div key={route.id} variants={itemVariants}>
              <NavLink
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-5 h-5" />
                <span className="font-medium">{route.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Progress Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Progress
          </h2>
          
          <motion.div variants={itemVariants}>
            <ProgressCard
              title="Today's Tasks"
              progress={todayProgress.completed}
              total={todayProgress.total}
              completed={todayProgress.completed}
              color="#5B4CFF"
              icon="Calendar"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ProgressCard
              title="This Week"
              progress={weekProgress.completed}
              total={weekProgress.total}
              completed={weekProgress.completed}
              color="#4ECDC4"
              icon="CalendarDays"
            />
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completed today</span>
              <span className="font-medium text-success">{todayProgress.completed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pending</span>
              <span className="font-medium text-warning">{todayProgress.total - todayProgress.completed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completion rate</span>
              <span className="font-medium text-primary">
                {todayProgress.total > 0 ? Math.round((todayProgress.completed / todayProgress.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;