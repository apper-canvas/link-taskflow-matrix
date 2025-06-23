import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const hasValue = value && value.length > 0;
  const shouldFloatLabel = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      {/* Input Field */}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <ApperIcon name={icon} className="w-5 h-5" />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={shouldFloatLabel ? placeholder : ''}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            ${error ? 'border-error' : 'border-gray-300'}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
          `}
          {...props}
        />

        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <ApperIcon name={icon} className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Floating Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            top: shouldFloatLabel ? '0px' : '50%',
            fontSize: shouldFloatLabel ? '12px' : '16px',
            color: focused ? '#5B4CFF' : error ? '#FF6B6B' : '#6B7280'
          }}
          transition={{ duration: 0.2 }}
          className={`
            absolute left-4 transform -translate-y-1/2 bg-white px-1 pointer-events-none
            ${icon && iconPosition === 'left' && !shouldFloatLabel ? 'left-10' : ''}
          `}
        >
          {label}
        </motion.label>
      )}

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;