const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserRole = {
  ADMIN: "admin",
  HR: "hr",
  EMPLOYEE: "employee",
  CANDIDATE: "candidate",
};

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // enforce strong password
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CANDIDATE,
    },

    // 🔑 Security / authentication
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String }, // for signup email verify
    resetPasswordToken: { type: String }, // for forgot password
    resetPasswordExpires: { type: Date },

    // 🔑 Session management
    refreshToken: { type: String }, // store only one active refresh token
    lastLogin: { type: Date },
    lastLoginIP: { type: String },

    // 🔑 Document Vault (each user owns a private vault folder)
    documents: [
      {
        fileName: { type: String },
        filePath: { type: String }, // path in storage (ex: /uploads/userId/filename.pdf)
        fileType: { type: String }, // pdf, docx, jpg, png
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = { User, UserRole };
