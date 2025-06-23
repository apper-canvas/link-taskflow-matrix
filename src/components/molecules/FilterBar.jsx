import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const FilterBar = ({ 
  categories = [], 
  onFilterChange, 
  activeFilters = {},
  className = '' 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const priorities = [
    { value: 'low', label: 'Low', color: '#51CF66' },
    { value: 'medium', label: 'Medium', color: '#FFD93D' },
    { value: 'high', label: 'High', color: '#FF6B6B' },
    { value: 'urgent', label: 'Urgent', color: '#FF3333' }
  ];

  const views = [
    { value: 'all', label: 'All Tasks', icon: 'List' },
    { value: 'active', label: 'Active', icon: 'Circle' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ];

  const handleFilterToggle = (type, value) => {
    const currentFilters = activeFilters[type] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(f => f !== value)
      : [...currentFilters, value];
    
    onFilterChange({
      ...activeFilters,
      [type]: newFilters
    });
  };

  const handleViewChange = (view) => {
    onFilterChange({
      ...activeFilters,
      view
    });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((count, filters) => {
      if (Array.isArray(filters)) {
        return count + filters.length;
      }
      return filters ? count + 1 : count;
    }, 0);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* View Selector */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            {views.map(view => (
              <Button
                key={view.value}
                size="sm"
                variant={activeFilters.view === view.value ? 'primary' : 'ghost'}
                icon={view.icon}
                onClick={() => handleViewChange(view.value)}
                className="text-xs"
              >
                {view.label}
              </Button>
            ))}
          </div>

          {/* Active Filter Count */}
          {getActiveFilterCount() > 0 && (
            <Badge variant="primary" size="sm">
              {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearAllFilters}
              icon="X"
            >
              Clear
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            icon="Filter"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </div>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 space-y-4 border-t pt-4"
        >
          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <motion.button
                    key={category.Id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFilterToggle('categories', category.Id)}
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium border transition-all
                      ${(activeFilters.categories || []).includes(category.Id)
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                      }
                    `}
                  >
                    <ApperIcon name={category.icon} className="w-3 h-3 mr-1 inline" />
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Priorities */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
            <div className="flex flex-wrap gap-2">
              {priorities.map(priority => (
                <motion.button
                  key={priority.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterToggle('priorities', priority.value)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize
                    ${(activeFilters.priorities || []).includes(priority.value)
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                    }
                  `}
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-1 inline-block"
                    style={{ backgroundColor: priority.color }}
                  />
                  {priority.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Due Date</h4>
            <div className="flex flex-wrap gap-2">
              {['overdue', 'today', 'tomorrow', 'thisWeek', 'noDate'].map(dateFilter => (
                <motion.button
                  key={dateFilter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterToggle('dateFilters', dateFilter)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize
                    ${(activeFilters.dateFilters || []).includes(dateFilter)
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary/50'
                    }
                  `}
                >
                  {dateFilter.replace(/([A-Z])/g, ' $1').trim()}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FilterBar;