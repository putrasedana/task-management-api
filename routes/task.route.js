import express from "express";
import Task from "../models/task.model.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a Task
router.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body;
    const owner = req.userId;

    const newTask = new Task({
      title,
      body,
      owner,
    });

    await newTask.save();

    res.status(201).json({
      status: "success",
      message: "Task created",
      data: newTask,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create task",
      error: error.message,
    });
  }
});

// Get non-archived tasks
router.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      owner: req.userId,
      archived: false,
    });

    res.status(200).json({
      status: "success",
      message: "Tasks retrieved",
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve tasks",
      error: error.message,
    });
  }
});

// Get archived tasks
router.get("/tasks/archived", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      owner: req.userId,
      archived: true,
    });

    res.status(200).json({
      status: "success",
      message: "Archived tasks retrieved",
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve archived tasks",
      error: error.message,
    });
  }
});

// Get a task by id
router.get("/tasks/:task_id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      id: req.params.task_id,
      owner: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Task retrieved",
      data: {
        id: task._id,
        title: task.title,
        body: task.body,
        status: task.status,
        createdAt: task.createdAt,
        archived: task.archived,
        owner: task.owner,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve task",
      error: error.message,
    });
  }
});

// Archive a task
router.post("/tasks/:task_id/archive", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { id: req.params.task_id, owner: req.userId },
      { archived: true },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Task archived",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to archive task",
      error: error.message,
    });
  }
});

// Unarchive a task
router.post("/tasks/:task_id/unarchive", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { id: req.params.task_id, owner: req.userId },
      { archived: false },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Task unarchived",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to unarchive task",
      error: error.message,
    });
  }
});

// Delete a task
router.delete("/tasks/:task_id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      id: req.params.task_id,
      owner: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete task",
      error: error.message,
    });
  }
});

// Update a task
router.put("/tasks/:task_id", authMiddleware, async (req, res) => {
  try {
    const { title, body, archived, status } = req.body;

    const allowedStatuses = ["to-do", "in-progress", "completed"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: `Invalid status value. Allowed values are: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { id: req.params.task_id, owner: req.userId },
      { title, body, archived, status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        status: "fail",
        message:
          "Task not found or user does not have permission to update this task",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Task updated",
      data: {
        id: updatedTask._id,
        title: updatedTask.title,
        body: updatedTask.body,
        status: updatedTask.status,
        createdAt: updatedTask.createdAt,
        archived: updatedTask.archived,
        owner: updatedTask.owner,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update task",
      error: error.message,
    });
  }
});

export default router;
