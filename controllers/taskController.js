const prisma = require('../config/database');

async function getTasks(req, res) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const statusFilter = req.query.status;
    const titleSearch = req.query.search;

    const where = { userId: req.user.id };
    if (statusFilter === 'true' || statusFilter === 'false') {
      where.status = statusFilter === 'true';
    }

    // First, get all tasks matching the filters (without title search)
    const allTasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Apply case-insensitive title search in JavaScript if needed
    let filteredTasks = allTasks;
    if (titleSearch) {
      const searchLower = titleSearch.toLowerCase();
      filteredTasks = allTasks.filter(task =>
        task.title.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const total = filteredTasks.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const tasks = filteredTasks.slice(startIndex, endIndex);

    res.json({ page, limit, total, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch tasks' });
  }
}

async function createTask(req, res) {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId: req.user.id,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create task' });
  }
}

async function updateTask(req, res) {
  try {
    const taskId = Number(req.params.id);
    if (!taskId) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    if (typeof req.body.status === 'boolean') updates.status = req.body.status;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updatedTask = await prisma.task.update({ where: { id: taskId }, data: updates });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update task' });
  }
}

async function deleteTask(req, res) {
  try {
    const taskId = Number(req.params.id);
    if (!taskId) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await prisma.task.delete({ where: { id: taskId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete task' });
  }
}

async function toggleTask(req, res) {
  try {
    const taskId = Number(req.params.id);
    if (!taskId) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: !task.status },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to toggle task' });
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
};
