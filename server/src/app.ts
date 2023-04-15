import "dotenv/config";
import "./queues";
import express from 'express';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json());

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.get("/", async function (req, res) {
  // Interaction type and data
  res.status(200).json({ok: true});
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});


