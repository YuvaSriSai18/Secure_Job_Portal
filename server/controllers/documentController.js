const Document = require("../models/Document");
const { UserRole } = require("../models/User");

// Upload metadata after Firebase upload
exports.uploadDocument = async (req, res) => {
  try {
    const { fileName, filePath, mimeType } = req.body;
    // You’ll pass filePath as Firebase download URL after uploading from frontend/backend

    const doc = await Document.create({
      owner: req.user.id,
      fileName,
      filePath,
      mimeType,
      uploadedBy: req.user.id,
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error uploading document" });
  }
};

// List my documents
exports.getMyDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ owner: req.user.id });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents" });
  }
};

// Download/Preview
exports.getDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Access control:
    if (
      doc.owner.toString() !== req.user.id &&
      req.user.role !== UserRole.HR &&
      req.user.role !== UserRole.ADMIN
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this document" });
    }

    // Return Firebase file path (frontend can handle preview/download)
    res.json({ fileUrl: doc.filePath });
  } catch (err) {
    res.status(500).json({ message: "Error fetching document" });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Only owner, HR, or Admin can delete
    if (
      doc.owner.toString() !== req.user.id &&
      req.user.role !== UserRole.HR &&
      req.user.role !== UserRole.ADMIN
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this document" });
    }

    await doc.remove();
    // 👉 optionally: also delete from Firebase Storage via SDK
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting document" });
  }
};
