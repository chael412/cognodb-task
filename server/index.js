import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import express from "express";
import cors from "cors";
import driver from "./src/db.js";
import { 
  getPeerNetwork, 
  getPrerequisiteChain, 
  getAllSubjectsWithPrerequisites 
} from "./src/queries.js";

const app = express();

// Enable CORS for React frontend requests
app.use(cors());
app.use(express.json());

// Verify DB connectivity on startup
async function checkConnection() {
    try {
        await driver.verifyConnectivity();
        console.log("✅ Connected to Neo4j Database!");
    } catch (error) {
        console.error("❌ Connection failed:", error.message);
    }
}
checkConnection();

// API Endpoints
app.get("/api/peers/:studentId", async (req, res) => {
    try {
        const data = await getPeerNetwork(req.params.studentId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/prerequisites/:code", async (req, res) => {
    try {
        const data = await getPrerequisiteChain(req.params.code);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get("/api/subjects/prerequisites", async (req, res) => {
  try {
    const data = await getAllSubjectsWithPrerequisites();
    res.json(data);
  } catch (err) {
    console.error("❌ BACKEND ERROR:", err); // Prints error details in your Node terminal
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});