require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());

// configure cors: allow credentials so browser will send cookies
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://secure-job-portal.vercel.app",
      "https://secure-job-portal.onrender.com"
    ],
    credentials: true,
  })
);

// routes
const authRoutes = require("./routes/authRoute");
app.use("/api/auth", authRoutes);
const jobRoutes = require("./routes/JobRoutes");
app.use("/api/job", jobRoutes);
const applicationRoutes = require("./routes/applicationRoutes");
app.use("/api/application", applicationRoutes);
const docRoute = require("./routes/documentRoutes");
app.use("/api/document", docRoute);
const usersRoute = require("./routes/UserRoutes");
app.use("/api/user", usersRoute);

// error handler (simple)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

// connect to mongodb and start
const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI;

mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error", err);
    process.exit(1);
  });
