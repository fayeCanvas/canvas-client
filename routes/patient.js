const express = require("express");
const patientRoutes = express.Router();
const { withAuth } = require("../middlewares/authMiddleware");
const {
  addPatient,
  deletePatient,
  getAllPatients,
  getUserDetailsById,
} = require("../controllers/patient_controller");
const patientProfileController = require("../controllers/patient_profile_controller.js")

patientRoutes.post("/api/patients", withAuth, addPatient);
patientRoutes.delete("/api/patients/:id", withAuth, deletePatient);
patientRoutes.get("/api/therapist/patients/:id", withAuth, getAllPatients);
patientRoutes.get("/api/patients/:id", withAuth, getUserDetailsById);

// patientRoutes.post('/api/patients',withAuth,addPatient)

patientRoutes.delete('/api/patients/:id',withAuth,deletePatient)
patientRoutes.get('/api/patients/:id',withAuth,getAllPatients)

patientRoutes.get('/api/patient/profile/:id', patientProfileController.show)
patientRoutes.post('/api/patient/profile/:id', patientProfileController.edit)

module.exports = patientRoutes
