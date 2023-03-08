var express = require("express");
const sendgrid_controller = require("../controllers/sendgrid_controller")

const message = new express.Router();
const { withAuth } = require("../middlewares/authMiddleware");

message.post("/send/email", sendgrid_controller.sendEmail);


module.exports = message;
