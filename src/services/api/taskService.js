import tasksData from '../mockData/tasks.json';

// Utility function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...tasksData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      order: tasks.length + 1,
      editHistory: [{
        timestamp: new Date().toISOString(),
        action: 'created',
        changes: Object.keys(taskData).map(key => ({
          field: key,
          newValue: taskData[key],
          oldValue: null
        }))
      }]
    };
    tasks.push(newTask);
    return { ...newTask };
  },

async update(id, updates) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const originalTask = tasks[index];
    const updatedTask = { 
      ...originalTask, 
      ...updates,
      Id: originalTask.Id // Prevent Id modification
    };
    
    // Handle completion status
    if (updates.completed !== undefined) {
      updatedTask.completedAt = updates.completed ? new Date().toISOString() : null;
    }
    
    // Track edit history
    const changes = [];
    Object.keys(updates).forEach(key => {
      if (key !== 'Id' && originalTask[key] !== updates[key]) {
        changes.push({
          field: key,
          oldValue: originalTask[key],
          newValue: updates[key]
        });
      }
    });
    
    if (changes.length > 0) {
      updatedTask.editHistory = [
        ...(originalTask.editHistory || []),
        {
          timestamp: new Date().toISOString(),
          action: 'updated',
          changes
        }
      ];
    }
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    tasks.splice(index, 1);
    return true;
  },

  async getByCategory(categoryId) {
    await delay(300);
    return tasks.filter(t => t.categoryId === parseInt(categoryId, 10)).map(t => ({ ...t }));
  },

  async getByStatus(completed) {
    await delay(300);
    return tasks.filter(t => t.completed === completed).map(t => ({ ...t }));
  },

  async getByPriority(priority) {
    await delay(300);
    return tasks.filter(t => t.priority === priority).map(t => ({ ...t }));
  },

  async getByDateRange(startDate, endDate) {
    await delay(300);
    return tasks.filter(t => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      return dueDate >= startDate && dueDate <= endDate;
    }).map(t => ({ ...t }));
  },

  async reorder(taskIds) {
    await delay(300);
    taskIds.forEach((id, index) => {
      const task = tasks.find(t => t.Id === parseInt(id, 10));
      if (task) {
        task.order = index + 1;
      }
});
    return [...tasks];
  },

  async getEditHistory(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    return task ? (task.editHistory || []) : [];
  }
};

export default taskService;