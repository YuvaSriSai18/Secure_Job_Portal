const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { verifyToken, authorizeRoles } = require("../middlewares/auth");

// ----------------------------
// Routes
// ----------------------------

// 📌 List all users → Admin only
router.get("/", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Get single user → Admin can access any user, others can access only their own profile
router.get("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.id.role !== "admin" && req.user.id._id !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Update own profile → Admin can update anyone, others can update only themselves
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.id.role !== "admin" && req.user.id._id !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Update role → Admin only
router.patch("/:id/role", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Role updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Delete user → Admin only
router.delete("/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
