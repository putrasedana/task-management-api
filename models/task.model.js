import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => `task-${uuidv4()}`, // Custom ID for tasks
    unique: true, // Ensure the custom ID is unique
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true, // Store the ID of the user who created the task
  },
  status: {
    type: String,
    enum: ["to-do", "in-progress", "completed"], // Possible statuses for the task
    default: "to-do", // Default status
  },
  archived: {
    type: Boolean,
    default: false, // Default value for the archived property
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
});

// Export the model
const Task = mongoose.model("Task", taskSchema);
export default Task;
