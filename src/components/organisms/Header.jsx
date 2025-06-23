import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 h-16 bg-white border-b border-gray-200 z-40"
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
          >
            <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-heading font-bold text-gray-900">
              TaskFlow
            </h1>
            <p className="text-sm text-gray-600">
              Organize your tasks with style
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-full"
          >
            <ApperIcon name="Zap" className="w-4 h-4" />
            <span className="text-sm font-medium">Productive</span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;