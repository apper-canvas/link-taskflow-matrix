import { motion } from 'framer-motion';
import ProgressRing from '@/components/atoms/ProgressRing';
import ApperIcon from '@/components/ApperIcon';

const ProgressCard = ({ 
  title, 
  progress, 
  total, 
  completed, 
  color = '#5B4CFF',
  icon,
  className = '' 
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              <ApperIcon name={icon} className="w-5 h-5" style={{ color }} />
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">
              {completed} of {total} completed
            </p>
          </div>
        </div>
        
        <ProgressRing
          progress={percentage}
          size={60}
          strokeWidth={6}
          color={color}
          showPercentage={false}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">
          {percentage}%
        </span>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">
            {total - completed} remaining
          </div>
          {percentage === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-success font-medium text-sm"
            >
              🎉 Complete!
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressCard;