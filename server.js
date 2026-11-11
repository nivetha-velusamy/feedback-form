const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory feedback store
const feedbackStore = [];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.get("/api/feedback", (req, res) => {
  res.status(200).json({
    count: feedbackStore.length,
    feedbacks: feedbackStore
  });
});

app.post("/api/feedback", (req, res) => {
  const { name, email, rating, category, message } = req.body || {};

  const feedbackData = {
    id: "fb_" + Date.now(),
    name: name || "Anonymous",
    email: email || "Not provided",
    rating: Number(rating) || 5,
    category: category || "General",
    message: message || (typeof req.body === "string" ? req.body : "No message provided"),
    createdAt: new Date().toISOString()
  };

  feedbackStore.unshift(feedbackData);
  console.log("Received Feedback:", feedbackData);

  res.status(200).json({
    success: true,
    message: "Feedback received successfully!",
    feedback: feedbackData
  });
});

// Fallback to public/index.html or status message
app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "public", "index.html");
  if (require("fs").existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.send("Feedback Server Running");
});

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Feedback server running on port ${PORT}`);
  });
}

module.exports = app;
