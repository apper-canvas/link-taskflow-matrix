import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import categoryService from '@/services/api/categoryService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    color: '#5B4CFF',
    icon: 'Tag'
  });

  const availableIcons = [
    'Tag', 'Briefcase', 'Users', 'Code', 'User', 'Home', 'Heart',
    'Star', 'Zap', 'Coffee', 'Book', 'Camera', 'Music', 'Plane',
    'Car', 'Phone', 'Mail', 'Clock', 'Calendar', 'Flag'
  ];

  const availableColors = [
    '#5B4CFF', '#FF6B6B', '#4ECDC4', '#51CF66', '#FFD93D',
    '#FF8C42', '#8B5CF6', '#EC4899', '#06B6D4', '#10B981'
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingCategory) {
        const updatedCategory = await categoryService.update(editingCategory.Id, formData);
        setCategories(prev => prev.map(cat => 
          cat.Id === updatedCategory.Id ? updatedCategory : cat
        ));
        toast.success('Category updated successfully');
      } else {
        const newCategory = await categoryService.create(formData);
        setCategories(prev => [...prev, newCategory]);
        toast.success('Category created successfully');
      }

      // Reset form
      setFormData({ name: '', color: '#5B4CFF', icon: 'Tag' });
      setShowCreateForm(false);
      setEditingCategory(null);
    } catch (error) {
      toast.error(editingCategory ? 'Failed to update category' : 'Failed to create category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await categoryService.delete(categoryId);
        setCategories(prev => prev.filter(cat => cat.Id !== categoryId));
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', color: '#5B4CFF', icon: 'Tag' });
    setShowCreateForm(false);
    setEditingCategory(null);
  };

  if (loading) {
    return <SkeletonLoader count={4} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadCategories}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-heading font-bold text-gray-900"
          >
            Categories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600"
          >
            Organize your tasks with custom categories
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            icon="Plus"
            onClick={() => setShowCreateForm(true)}
            disabled={showCreateForm}
          >
            Create Category
          </Button>
        </motion.div>
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-heading font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Category Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {availableIcons.map(icon => (
                    <motion.button
                      key={icon}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      className={`
                        w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all
                        ${formData.icon === icon 
                          ? 'border-primary bg-primary/10' 
                          : 'border-gray-300 hover:border-primary/50'
                        }
                      `}
                    >
                      <ApperIcon name={icon} className="w-5 h-5" />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {availableColors.map(color => (
                    <motion.button
                      key={color}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`
                        w-8 h-8 rounded-full border-2 transition-all
                        ${formData.color === color 
                          ? 'border-gray-800 scale-110' 
                          : 'border-gray-300'
                        }
                      `}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={!formData.name.trim()}>
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories List */}
      {categories.length === 0 ? (
        <EmptyState
          icon="Tags"
          title="No categories yet"
          description="Create your first category to organize your tasks"
          actionLabel="Create Category"
          onAction={() => setShowCreateForm(true)}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {categories.map((category, index) => (
              <motion.div
                key={category.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <ApperIcon 
                        name={category.icon} 
                        className="w-5 h-5" 
                        style={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">
                        {category.taskCount} task{category.taskCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Edit"
                      onClick={() => handleEdit(category)}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Trash2"
                      onClick={() => handleDelete(category.Id)}
                      className="text-secondary hover:text-secondary"
                    />
                  </div>
                </div>

                <Badge
                  color={category.color}
                  size="sm"
                  className="w-full justify-center"
                >
                  {category.taskCount} active task{category.taskCount !== 1 ? 's' : ''}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Categories;