import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked, 
  onChange, 
  label, 
  className = '',
  size = 'md',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const checkboxClasses = `
    relative inline-flex items-center justify-center rounded border-2 transition-all duration-200 cursor-pointer
    ${checked ? 'bg-primary border-primary' : 'bg-white border-gray-300 hover:border-primary/50'}
    ${sizes[size]}
  `;

  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={checkboxClasses}
          onClick={() => onChange(!checked)}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onChange(!checked)}
            className="sr-only"
            {...props}
          />
          
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 30 
              }}
            >
              <ApperIcon 
                name="Check" 
                className={`text-white ${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'}`} 
              />
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {label && (
        <span className={`ml-2 text-gray-700 ${checked ? 'line-through text-gray-500' : ''}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;