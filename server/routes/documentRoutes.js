const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const { verifyToken } = require("../middlewares/auth");

// All roles can upload
router.post("/upload", verifyToken, documentController.uploadDocument);

// Get current user's documents
router.get("/my", verifyToken, documentController.getMyDocuments);

// Get single document (access handled in controller)
router.get("/:id", verifyToken, documentController.getDocument);

// Delete document (access handled in controller)
router.delete("/:id", verifyToken, documentController.deleteDocument);

module.exports = router;
