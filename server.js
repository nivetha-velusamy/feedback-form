
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Feedback Server Running");
});

app.post("/api/feedback", (req, res) => {
    const feedbackData = req.body;

    console.log("Received Feedback:", feedbackData);

    res.status(200).json({
        message: "Feedback received successfully!"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Feedback server running on port ${PORT}`);
});
