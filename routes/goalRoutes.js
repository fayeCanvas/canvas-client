const express = require("express");
const goalRoutes = express.Router();
const { withAuth } = require("../middlewares/authMiddleware");
const {
  addGoal,
  getGoalsByPatientId,
  markGoalAsCompleted,
  sendNotifications,
} = require("../controllers/goal_controller");
const {
  getQuestionsByGoalId,
  addAnswer,
} = require("../controllers/GoalQuestionController");

goalRoutes.post("/api/goals", withAuth, addGoal);
goalRoutes.get("/api/goals/:id", withAuth, getGoalsByPatientId);
goalRoutes.get("/api/goals/goalCompleted/:id", withAuth, markGoalAsCompleted);
goalRoutes.put("/api/goalQuestions/:id", withAuth, addAnswer);
goalRoutes.get("/api/goalQuestions/:id", withAuth, getQuestionsByGoalId);
goalRoutes.get("/api/goals/notify", sendNotifications)

module.exports = goalRoutes;
