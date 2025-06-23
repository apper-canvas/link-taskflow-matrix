import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import taskService from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const TaskCard = ({ task, category, onUpdate, onDelete, onSelect, className = '' }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const priorityColors = {
    low: '#51CF66',
    medium: '#FFD93D',
    high: '#FF6B6B',
    urgent: '#FF3333'
  };

  const priorityBorderWidth = {
    low: '1px',
    medium: '2px',
    high: '3px',
    urgent: '4px'
  };

  const handleComplete = async (checked) => {
    setIsUpdating(true);
    try {
      const updatedTask = await taskService.update(task.Id, { completed: checked });
      onUpdate(updatedTask);
      if (checked) {
        toast.success('Task completed! 🎉');
      }
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
};

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(task.Id);
        onDelete(task.Id);
        toast.success('Task deleted');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();
    const isOverdue = date < now && !task.completed;
    
    return {
      text: format(date, 'MMM d, h:mm a'),
      isOverdue
    };
  };

  const dueDateInfo = formatDueDate(task.dueDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={`
        bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4
        border-l-4 ${className}
      `}
      style={{ borderLeftColor: priorityColors[task.priority] }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleComplete}
            disabled={isUpdating}
          />
        </div>
<div className="flex-1 min-w-0" onClick={() => onSelect?.(task)}>
          <h3 
            className={`font-medium text-gray-900 cursor-pointer hover:text-primary transition-colors ${task.completed ? 'line-through text-gray-500' : ''}`}
          >
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`text-sm text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3">
            {category && (
              <Badge
                icon={category.icon}
                color={category.color}
                size="xs"
              >
                {category.name}
              </Badge>
            )}
            
            <Badge
              variant="default"
              size="xs"
              className="capitalize"
            >
              {task.priority}
            </Badge>

            {dueDateInfo && (
              <Badge
                variant={dueDateInfo.isOverdue ? "error" : "default"}
                size="xs"
                icon="Clock"
              >
                {dueDateInfo.text}
              </Badge>
            )}
          </div>
        </div>
<div className="flex-shrink-0 flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            icon="Edit"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(task);
            }}
            className="opacity-0 group-hover:opacity-100"
          />
          <Button
            size="sm"
            variant="ghost"
            icon="Trash2"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
className="opacity-0 group-hover:opacity-100 text-secondary hover:text-secondary"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;