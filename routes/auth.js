var express = require("express");
var userController = require("../controllers/users_controller.js");
var authController = require("../controllers/auth_controller.js");

const authRoutes = new express.Router();
const { withAuth } = require("../middlewares/authMiddleware");

authRoutes.post("/api/auth/login", userController.login);
// authRoutes.post("/api/auth/forgotpassword", authController.forgotPassword);
authRoutes.post('/auth/forgot-password', authController.forgotPassword)
authRoutes.post("/auth/reset-password/:token", authController.verifyToken);
authRoutes.post("/api/auth/register", userController.register);
authRoutes.get("/api/users/getAll", withAuth, userController.getAllUsers),
authRoutes.get("/api/users/:id", withAuth, userController.getUserDetailsById);

module.exports = authRoutes;
